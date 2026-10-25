"""Adversarial checks for the signing boundary, without Apple secrets or a Mac."""
import datetime as dt
import hashlib
import importlib.util
from pathlib import Path
import unittest
import tempfile
from types import SimpleNamespace
import plistlib
import zipfile
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("ios_distribution", Path(__file__).with_name("ios-distribution.py"))
signing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(signing)
NOW = dt.datetime(2026, 10, 25, tzinfo=dt.timezone.utc)
UUID = "95f24e59-cca8-4daf-82c9-81c7394a88d0"
FAKE_CERT = b"test-only-public-certificate"


def profile():
    return {
        "UUID": UUID, "TeamIdentifier": [signing.TEAM],
        "ExpirationDate": NOW + dt.timedelta(days=100),
        "Entitlements": {
            "application-identifier": f"{signing.TEAM}.{signing.BUNDLE}",
            "com.apple.developer.team-identifier": signing.TEAM,
            "get-task-allow": False,
        },
        "DeveloperCertificates": [FAKE_CERT],
    }


class ProfileBoundary(unittest.TestCase):
    def validate(self, value):
        with patch.object(signing, "CERT_SHA256", hashlib.sha256(FAKE_CERT).hexdigest()):
            return signing.validate_profile(value, NOW)

    def test_approved_app_store_profile(self):
        self.assertEqual(self.validate(profile()), UUID)

    def test_wrong_app_or_team_cannot_be_signed(self):
        for field, value in [("application-identifier", "OTHER.com.other.app"),
                             ("com.apple.developer.team-identifier", "OTHER")]:
            with self.subTest(field=field):
                candidate = profile()
                candidate["Entitlements"][field] = value
                with self.assertRaises(ValueError):
                    self.validate(candidate)
        candidate = profile()
        candidate["TeamIdentifier"] = ["OTHER"]
        with self.assertRaises(ValueError):
            self.validate(candidate)

    def test_debugging_cannot_be_enabled_or_unspecified(self):
        for value in [True, None, "false", 0]:
            candidate = profile()
            candidate["Entitlements"]["get-task-allow"] = value
            with self.subTest(value=value), self.assertRaises(ValueError):
                self.validate(candidate)

    def test_adhoc_enterprise_and_empty_device_list_are_rejected(self):
        for field, value in [("ProvisionedDevices", ["device"]),
                             ("ProvisionedDevices", []), ("ProvisionsAllDevices", True)]:
            candidate = profile()
            candidate[field] = value
            with self.subTest(field=field, value=value), self.assertRaises(ValueError):
                self.validate(candidate)

    def test_expired_or_nearly_expired_profile_is_rejected(self):
        for hours in [-1, 0, 23, 24]:
            candidate = profile()
            candidate["ExpirationDate"] = NOW + dt.timedelta(hours=hours)
            with self.subTest(hours=hours), self.assertRaises(ValueError):
                self.validate(candidate)

    def test_different_certificate_is_rejected(self):
        candidate = profile()
        candidate["DeveloperCertificates"] = [b"unapproved"]
        with self.assertRaises(ValueError):
            self.validate(candidate)


class AppTargetBoundary(unittest.TestCase):
    def fixture(self):
        def block(bundle):
            return ('buildSettings = {\n\t\t\t\tCODE_SIGN_STYLE = Automatic;\n'
                    f'\t\t\t\tPRODUCT_BUNDLE_IDENTIFIER = {bundle};\n\t\t\t}};')
        return "\n".join([block(signing.BUNDLE), block(signing.BUNDLE), block("org.dependency.framework")])

    def test_signing_is_scoped_to_both_app_configurations(self):
        before = self.fixture()
        after = signing.configure_project(before, UUID)
        self.assertEqual(after.count('CODE_SIGN_STYLE = Manual;'), 2)
        dependency = before[before.rindex('buildSettings = {'):]
        self.assertTrue(after.endswith(dependency))

    def test_template_drift_or_injected_profile_fails_closed(self):
        for text, uuid in [(self.fixture().replace(signing.BUNDLE, "unexpected", 1), UUID),
                           (self.fixture(), '"; arbitrary = YES;')]:
            with self.subTest(uuid=uuid), self.assertRaises(ValueError):
                signing.configure_project(text, uuid)


class ArtifactBoundary(unittest.TestCase):
    def test_wrong_bundle_version_build_platform_or_unsafe_path_never_reaches_codesign(self):
        baseline = {
            'CFBundleIdentifier': signing.BUNDLE,
            'CFBundleShortVersionString': '18.1.0',
            'CFBundleVersion': '101',
            'CFBundleSupportedPlatforms': ['iPhoneOS'],
        }
        cases = [
            {'CFBundleIdentifier': 'other.app'},
            {'CFBundleShortVersionString': '12.0.0'},
            {'CFBundleVersion': '100'},
            {'CFBundleSupportedPlatforms': ['iPhoneSimulator']},
            {'unsafe_path': True},
        ]
        with tempfile.TemporaryDirectory() as root:
            root = Path(root)
            for case in cases:
                with self.subTest(case=case):
                    data = baseline | {k: v for k, v in case.items() if k != 'unsafe_path'}
                    ipa = root / 'test.ipa'
                    with zipfile.ZipFile(ipa, 'w') as archive:
                        archive.writestr('Payload/App.app/Info.plist', plistlib.dumps(data))
                        if case.get('unsafe_path'):
                            archive.writestr('../escape', b'unsafe')
                    args = SimpleNamespace(ipa=str(ipa), version='18.1.0', build='101',
                                           directory=str(root / 'extract'), receipt=str(root / 'receipt.json'))
                    with patch.object(signing.subprocess, 'run') as command:
                        with self.assertRaises(ValueError):
                            signing.verify_ipa(args)
                        command.assert_not_called()


if __name__ == "__main__":
    unittest.main()
