"""Validate distribution inputs and the exported IPA; never print signing secrets."""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import plistlib
import re
import subprocess
import zipfile

BUNDLE = "com.atlasevermore.nutripilot"
TEAM = "4CFGPR2ZDT"
CERT_SHA256 = "7d33f59a893ec51405bc2a4f402cfb97d1eb7e755b57391742df88922f3c7e46"
PROFILE_SHA256 = "24c114962197492ca722146f694ef241d9667530462b12d0958c37a311c46184"


def validate_profile(profile, now=None):
    now = now or dt.datetime.now(dt.timezone.utc)
    expiry = profile["ExpirationDate"].replace(tzinfo=dt.timezone.utc)
    entitlements = profile["Entitlements"]
    if profile.get("TeamIdentifier") != [TEAM]:
        raise ValueError("Unexpected signing team")
    if entitlements.get("application-identifier") != f"{TEAM}.{BUNDLE}":
        raise ValueError("Unexpected application identifier")
    if entitlements.get("com.apple.developer.team-identifier") != TEAM:
        raise ValueError("Unexpected entitlement team")
    if entitlements.get("get-task-allow") is not False:
        raise ValueError("Debugging must be disabled")
    if "ProvisionedDevices" in profile or profile.get("ProvisionsAllDevices"):
        raise ValueError("Only App Store distribution profiles are accepted")
    if expiry <= now + dt.timedelta(hours=24):
        raise ValueError("Signing profile expires within 24 hours")
    if not any(hashlib.sha256(c).hexdigest() == CERT_SHA256
               for c in profile.get("DeveloperCertificates", [])):
        raise ValueError("Approved distribution certificate missing")
    if not re.fullmatch(r"[A-Fa-f0-9-]{36}", profile.get("UUID", "")):
        raise ValueError("Invalid profile UUID")
    return profile["UUID"]


def configure_project(text, profile_uuid):
    if not re.fullmatch(r"[A-Fa-f0-9-]{36}", profile_uuid):
        raise ValueError("Invalid profile UUID")
    count = 0

    def patch(match):
        nonlocal count
        block = match.group(0)
        if f"PRODUCT_BUNDLE_IDENTIFIER = {BUNDLE};" not in block:
            return block
        if "CODE_SIGN_STYLE = Automatic;" not in block:
            raise ValueError("Unexpected generated signing configuration")
        count += 1
        block = block.replace("CODE_SIGN_STYLE = Automatic;", "CODE_SIGN_STYLE = Manual;")
        marker = f"PRODUCT_BUNDLE_IDENTIFIER = {BUNDLE};"
        settings = (f'\n\t\t\t\tDEVELOPMENT_TEAM = {TEAM};'
                    '\n\t\t\t\tCODE_SIGN_IDENTITY = "Apple Distribution";'
                    f'\n\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "{profile_uuid}";')
        return block.replace(marker, marker + settings)

    result = re.sub(r"buildSettings = \{(?:(?!\n\t\t\t\};).)*\n\t\t\t\};",
                    patch, text, flags=re.S)
    if count != 2:
        raise ValueError("Expected exactly two generated App target configurations")
    return result


def profile_command(args):
    if hashlib.sha256(Path(args.profile).read_bytes()).hexdigest() != PROFILE_SHA256:
        raise ValueError("Profile is not the exact owner-approved Apple download")
    # Apple signature verification is separate from certificate-chain trust.
    decoded = subprocess.run(["openssl", "cms", "-verify", "-noverify", "-inform", "DER",
                              "-in", args.profile], capture_output=True, check=True).stdout
    profile = plistlib.loads(decoded)
    uuid = validate_profile(profile)
    destination = Path(args.directory)
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "profile-uuid.txt").write_text(uuid)
    (destination / "ExportOptions.plist").write_bytes(plistlib.dumps({
        "method": "app-store-connect", "destination": "export",
        "signingStyle": "manual", "teamID": TEAM,
        "signingCertificate": "Apple Distribution",
        "provisioningProfiles": {BUNDLE: uuid},
        "manageAppVersionAndBuildNumber": False,
        "uploadSymbols": False,
    }))
    project = Path(args.project)
    project.write_text(configure_project(project.read_text(), uuid))
    print("Approved profile and app-only manual signing configuration validated.")


def verify_ipa(args):
    ipa = Path(args.ipa)
    with zipfile.ZipFile(ipa) as archive:
        infos = archive.infolist()
        if sum(i.file_size for i in infos) > 1024 ** 3:
            raise ValueError("Unexpected IPA size")
        for info in infos:
            path = Path(info.filename)
            is_link = (info.external_attr >> 16) & 0o170000 == 0o120000
            if path.is_absolute() or ".." in path.parts or is_link:
                raise ValueError("Unsafe IPA path")
        roots = [n for n in archive.namelist()
                 if re.fullmatch(r"Payload/[^/]+\.app/Info\.plist", n)]
        if len(roots) != 1:
            raise ValueError("Expected exactly one application")
        data = plistlib.loads(archive.read(roots[0]))
        if data.get("CFBundleIdentifier") != BUNDLE:
            raise ValueError("Wrong IPA bundle identifier")
        if data.get("CFBundleShortVersionString") != args.version:
            raise ValueError("Wrong IPA version")
        if str(data.get("CFBundleVersion")) != args.build:
            raise ValueError("Wrong IPA build number")
        if data.get("CFBundleSupportedPlatforms") != ["iPhoneOS"]:
            raise ValueError("Expected an iPhoneOS device build")
    root = Path(args.directory)
    root.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ditto", "-x", "-k", str(ipa), str(root)], check=True)
    app = root / roots[0].removesuffix("/Info.plist")
    subprocess.run(["codesign", "--verify", "--deep", "--strict", str(app)], check=True)
    cert_prefix = str(root / "signer-")
    subprocess.run(["codesign", "-d", "--extract-certificates", cert_prefix, str(app)],
                   check=True, capture_output=True)
    if hashlib.sha256(Path(cert_prefix + "0").read_bytes()).hexdigest() != CERT_SHA256:
        raise ValueError("IPA signed by an unapproved certificate")
    if hashlib.sha256((app / "embedded.mobileprovision").read_bytes()).hexdigest() != PROFILE_SHA256:
        raise ValueError("Exported profile differs from the approved Apple download")
    profile = subprocess.run(["openssl", "cms", "-verify", "-noverify", "-inform", "DER",
                              "-in", str(app / "embedded.mobileprovision")],
                             check=True, capture_output=True).stdout
    uuid = validate_profile(plistlib.loads(profile))
    ent = subprocess.run(["codesign", "-d", "--entitlements", ":-", str(app)],
                         check=True, capture_output=True).stdout
    ent = plistlib.loads(ent)
    if (ent.get("application-identifier") != f"{TEAM}.{BUNDLE}"
            or ent.get("com.apple.developer.team-identifier") != TEAM
            or ent.get("get-task-allow") is not False):
        raise ValueError("Unexpected signed entitlements")
    receipt = {
        "revision": os.environ["GITHUB_SHA"],
        "nativeTree": subprocess.check_output(["git", "rev-parse", "HEAD:native"], text=True).strip(),
        "version": args.version, "build": args.build, "bundle": BUNDLE,
        "profileUuid": uuid, "certificateSha256": CERT_SHA256,
        "ipaSha256": hashlib.sha256(ipa.read_bytes()).hexdigest(),
        "signatureVerified": True, "storeUploaded": False,
        "purchasesTested": False,
    }
    Path(args.receipt).write_text(json.dumps(receipt, indent=2) + "\n")
    print("Device IPA signature, identity, profile, version and build verified; no store upload.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    profile = commands.add_parser("profile")
    profile.add_argument("--profile", required=True)
    profile.add_argument("--directory", required=True)
    profile.add_argument("--project", required=True)
    verify = commands.add_parser("verify")
    for name in ("ipa", "directory", "version", "build", "receipt"):
        verify.add_argument("--" + name, required=True)
    args = parser.parse_args()
    try:
        (profile_command if args.command == "profile" else verify_ipa)(args)
    except (ValueError, KeyError, subprocess.CalledProcessError, plistlib.InvalidFileException):
        raise SystemExit("iOS distribution validation failed; no artifact approved.")
