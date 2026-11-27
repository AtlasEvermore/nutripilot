import Foundation
import UIKit
import Capacitor
import AppTrackingTransparency
import FacebookCore

/// Meta SDK bridge.
/// - Starts the SDK and reports every app open (activateApp) so Meta app-promotion campaigns can count installs.
/// - Asks App Tracking Transparency once, when the web app requests it.
/// - Gives the Meta anonymous id to the web app, which forwards it to RevenueCat; RevenueCat then sends
///   trials, subscriptions and renewals to Meta server-to-server (purchases are NOT logged here, to avoid duplicates).
@objc(MetaBridgePlugin)
public class MetaBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "MetaBridgePlugin"
    public let jsName = "MetaBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestTracking", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "logEvent", returnType: CAPPluginReturnPromise)
    ]
    private var configured = false

    override public func load() {
        guard Bundle.main.object(forInfoDictionaryKey: "FacebookAppID") as? String != nil else { return }
        DispatchQueue.main.async {
            ApplicationDelegate.shared.application(UIApplication.shared, didFinishLaunchingWithOptions: nil)
            Settings.shared.isAdvertiserIDCollectionEnabled = self.trackingAuthorized()
            self.configured = true
            AppEvents.shared.activateApp()
        }
        NotificationCenter.default.addObserver(self, selector: #selector(becameActive), name: UIApplication.didBecomeActiveNotification, object: nil)
    }

    @objc private func becameActive() {
        if configured { AppEvents.shared.activateApp() }
    }

    private func trackingAuthorized() -> Bool {
        return ATTrackingManager.trackingAuthorizationStatus == .authorized
    }

    private func attName(_ s: ATTrackingManager.AuthorizationStatus) -> String {
        switch s {
        case .authorized: return "authorized"
        case .denied: return "denied"
        case .restricted: return "restricted"
        default: return "notDetermined"
        }
    }

    private func payload() -> [String: Any] {
        return [
            "configured": configured,
            "att": attName(ATTrackingManager.trackingAuthorizationStatus),
            "anonymousId": configured ? AppEvents.shared.anonymousID : ""
        ]
    }

    @objc func status(_ call: CAPPluginCall) {
        DispatchQueue.main.async { call.resolve(self.payload()) }
    }

    @objc func requestTracking(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard ATTrackingManager.trackingAuthorizationStatus == .notDetermined else { return call.resolve(self.payload()) }
            ATTrackingManager.requestTrackingAuthorization { _ in
                DispatchQueue.main.async {
                    if self.configured { Settings.shared.isAdvertiserIDCollectionEnabled = self.trackingAuthorized() }
                    call.resolve(self.payload())
                }
            }
        }
    }

    /// Funnel events that are not purchases (e.g. onboarding completed). Purchases come from RevenueCat.
    @objc func logEvent(_ call: CAPPluginCall) {
        guard configured, let name = call.getString("name"), !name.isEmpty else { return call.resolve() }
        let params = (call.getObject("params") ?? [:]).reduce(into: [AppEvents.ParameterName: Any]()) { $0[AppEvents.ParameterName($1.key)] = $1.value }
        DispatchQueue.main.async {
            AppEvents.shared.logEvent(AppEvents.Name(name), parameters: params)
            call.resolve()
        }
    }
}
