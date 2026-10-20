// Applies everything the App Store and Google Play require to the generated native projects.
// Safe to run many times (idempotent). Run after `npx cap add ios|android` and after each `npx cap sync`.
//   node scripts/configure-native.mjs           → apply
//   node scripts/configure-native.mjs --check   → only report what is missing
// Environment (optional): APP_VERSION (e.g. 1.0.0), BUILD_NUMBER (integer, must grow with each upload).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const VERSION = process.env.APP_VERSION || '1.0.0';
const BUILD = String(parseInt(process.env.BUILD_NUMBER || process.env.CM_BUILD_NUMBER || '', 10) || '');
const problems = [];
const done = [];

function edit(file, fn, label) {
  if (!fs.existsSync(file)) return false;
  const before = fs.readFileSync(file, 'utf8');
  const after = fn(before);
  if (after === before) return true;
  if (CHECK) { problems.push(`${label}: ${path.relative(root, file)}`); return true; }
  fs.writeFileSync(file, after);
  done.push(`${label}: ${path.relative(root, file)}`);
  return true;
}
function write(file, content, label) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return;
  if (CHECK) { problems.push(`${label}: ${path.relative(root, file)}`); return; }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  done.push(`${label}: ${path.relative(root, file)}`);
}

// ---------------------------------------------------------------- iOS
const plist = path.join(root, 'ios/App/App/Info.plist');
const IOS_KEYS = {
  // Without these the app crashes the first time the camera opens (meal photo, barcode, label).
  NSCameraUsageDescription: 'NutriPilot uses the camera to photograph your meals and scan food labels and barcodes, so it can estimate calories and nutrients.',
  NSPhotoLibraryUsageDescription: 'NutriPilot lets you choose a photo of a meal, a food label or a progress picture from your library.',
  // No custom encryption: skips the export-compliance question on every upload.
  ITSAppUsesNonExemptEncryption: false,
  CFBundleDisplayName: 'NutriPilot',
};
const plistValue = (v) => (typeof v === 'boolean' ? `<${v}/>` : `<string>${v}</string>`);
const hasIos = edit(plist, (xml) => {
  let out = xml;
  for (const [k, v] of Object.entries(IOS_KEYS)) {
    const re = new RegExp(`<key>${k}</key>\\s*<(string>[^<]*</string|true/|false/)>`);
    if (re.test(out)) out = out.replace(re, `<key>${k}</key>\n\t${plistValue(v)}`);
    else out = out.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${k}</key>\n\t${plistValue(v)}\n</dict>\n</plist>\n`);
  }
  // iPhone: portrait only (the layout is designed for it). iPad keeps every orientation (required for multitasking).
  out = out.replace(/(<key>UISupportedInterfaceOrientations<\/key>\s*<array>)[\s\S]*?(<\/array>)/, '$1\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t$2');
  // 64-bit only (every iPhone that runs iOS 15).
  out = out.replace(/(<key>UIRequiredDeviceCapabilities<\/key>\s*<array>\s*)<string>armv7<\/string>/, '$1<string>arm64</string>');
  return out;
}, 'iOS Info.plist (camera/photos texts, encryption, portrait)');
if (hasIos) {
  edit(path.join(root, 'ios/App/App.xcodeproj/project.pbxproj'), (txt) => {
    let out = txt.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${VERSION};`);
    if (BUILD) out = out.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${BUILD};`);
    return out;
  }, `iOS version ${VERSION}${BUILD ? ` (${BUILD})` : ''}`);
} else if (!fs.existsSync(path.join(root, 'ios'))) console.log('· iOS project not created yet (npx cap add ios) — skipped');

// ---------------------------------------------------------------- Android
const manifest = path.join(root, 'android/app/src/main/AndroidManifest.xml');
const hasAndroid = edit(manifest, (xml) => {
  let out = xml;
  const perms = ['android.permission.INTERNET', 'android.permission.CAMERA', 'android.permission.POST_NOTIFICATIONS'];
  for (const p of perms) if (!out.includes(`"${p}"`)) out = out.replace(/(\s*)<application/, `$1<uses-permission android:name="${p}" />$1<application`);
  // The camera is optional: phones/tablets without one can still install the app.
  if (!out.includes('android.hardware.camera"')) out = out.replace(/(\s*)<application/, '$1<uses-feature android:name="android.hardware.camera" android:required="false" />$1<application');
  return out;
}, 'Android manifest (camera, notifications)');
if (hasAndroid) {
  edit(path.join(root, 'android/app/build.gradle'), (g) => {
    let out = g.replace(/versionName\s+"[^"]*"/, `versionName "${VERSION}"`);
    if (BUILD) out = out.replace(/versionCode\s+\d+/, `versionCode ${BUILD}`);
    return out;
  }, `Android version ${VERSION}${BUILD ? ` (${BUILD})` : ''}`);
  // Small monochrome icon for reminders (otherwise Android shows a white square).
  write(path.join(root, 'android/app/src/main/res/drawable/ic_stat_nutripilot.xml'), `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">
  <path android:fillColor="#FFFFFFFF"
      android:pathData="M6.4,13.4C6.4,9.4 8.9,6.3 12,6.3s5.6,3.1 5.6,7.1c0,2.2 -0.8,3.9 -2.4,5.2 -1.2,0.9 -2.7,1.5 -3.2,1.5s-2,-0.5 -3.2,-1.5C7.2,17.3 6.4,15.6 6.4,13.4Z"/>
</vector>
`, 'Android notification icon');
} else if (!fs.existsSync(path.join(root, 'android'))) console.log('· Android project not created yet (npx cap add android) — skipped');

if (CHECK) {
  console.log(problems.length ? `Missing (${problems.length}):\n- ${problems.join('\n- ')}\nRun: npm run configure` : '✓ Native projects are store-ready');
  process.exit(problems.length ? 1 : 0);
}
console.log(done.length ? `✓ Applied:\n- ${done.join('\n- ')}` : '✓ Nothing to change');
