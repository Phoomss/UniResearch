"""Install the official Linux x86_64 ChromeDriver matching Brave's Chromium build."""

import io
import json
import platform
import re
import subprocess
import urllib.request
import zipfile
from pathlib import Path


def fetch_json(url):
    request = urllib.request.Request(url, headers={"User-Agent": "UniResearch-Selenium"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def chromium_version():
    # Brave's --product-version is a hybrid Chromium-major/Brave version,
    # e.g. 155.1.97.54, not the Chromium build used to select ChromeDriver.
    package_version = subprocess.check_output(
        ["dpkg-query", "--show", "--showformat=${Version}", "brave-browser"],
        text=True,
    ).strip()
    match = re.fullmatch(r"(\d+\.\d+\.\d+)(?:[-+~].*)?", package_version)
    if not match:
        raise RuntimeError(f"Unexpected Brave package version: {package_version!r}")
    tag = "v" + match.group(1)
    release = fetch_json(f"https://api.github.com/repos/brave/brave-browser/releases/tags/{tag}")
    match = re.search(r"\bChromium\s+(\d+\.\d+\.\d+\.\d+)\b", release.get("name", ""))
    if not match:
        raise RuntimeError(f"No Chromium version in official Brave release {tag}")
    version = match.group(1)
    print(f"Brave {package_version}; Chromium {version}", flush=True)
    return version


def driver_release(version):
    build = version.rsplit(".", 1)[0]
    base = "https://googlechromelabs.github.io/chrome-for-testing/"
    releases = fetch_json(base + "latest-patch-versions-per-build-with-downloads.json")["builds"]
    release = releases.get(build)
    if release is None:
        # Official selection guidance permits a milestone fallback when the
        # Chromium build has not appeared in the per-build metadata yet.
        milestone = version.split(".", 1)[0]
        release = fetch_json(base + "latest-versions-per-milestone-with-downloads.json")["milestones"].get(milestone)
    if release is None:
        raise RuntimeError(f"No official ChromeDriver for Chromium {version}")
    return release


def install():
    if platform.machine() != "x86_64":
        raise RuntimeError("Build this image for linux/amd64 (see docker-compose.selenium.yml)")
    version = chromium_version()
    release = driver_release(version)
    download = next(
        item for item in release["downloads"]["chromedriver"]
        if item["platform"] == "linux64"
    )
    with urllib.request.urlopen(download["url"], timeout=120) as response:
        archive = zipfile.ZipFile(io.BytesIO(response.read()))
    target = Path("/usr/local/bin/chromedriver")
    target.write_bytes(archive.read("chromedriver-linux64/chromedriver"))
    target.chmod(0o755)
    print(f"Brave Chromium {version}; ChromeDriver {release['version']}")
    subprocess.run([str(target), "--version"], check=True)


if __name__ == "__main__":
    install()
