# YouTube No Video Length

A Firefox and Chrome extension for watching YouTube without spoilers. It hides video lengths, the progress bar and other hints of how much of a video is left. Playback still works, and skip buttons replace the progress bar.

## What it hides

- Duration badges and "watched" bars on thumbnails
- The total time, progress bar, playhead and scrub previews in the player (elapsed time stays)
- End cards, and durations in the autoplay and fullscreen suggestions
- Chapters, key moments and transcript timestamps
- Timestamp links in descriptions, which are blurred but still clickable

Comments and Shorts are deliberately left alone.

Worlds get spoiled too quickly.

## Install

Protection is on by default. Use the toolbar icon to turn it off or on.

**Firefox** (128 or later)

Download the `.xpi` from the latest [release](https://github.com/HenrikRosander/Youtube-No-Video-Length/releases/latest) and open it in Firefox. It updates itself when a new release comes out.

To try changes from this folder instead, open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on** and select `manifest.json`. Temporary add-ons are removed when Firefox closes.

**Chrome**

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder.

Chrome keeps it installed, but may show a warning about developer-mode extensions at startup. Chrome hides new extensions in the puzzle-piece menu, so pin it to see the toggle.

Both browsers load the same folder. The manifest lists both `service_worker` (used by Chrome) and `scripts` (used by Firefox) for the background script, and each browser ignores the key it doesn't use.

## Releasing a new version

Releases are signed by Mozilla as an unlisted add-on, so they install permanently but aren't on the add-on store.

One-time setup: create API credentials at [addons.mozilla.org](https://addons.mozilla.org/developers/addon/api/key/) and add them to this repo under **Settings → Secrets and variables → Actions** as `AMO_API_KEY` (the JWT issuer) and `AMO_API_SECRET` (the JWT secret).

To release:

1. Raise `version` in `manifest.json` and commit it.
2. Tag and push: `git tag v0.3.0 && git push origin main v0.3.0`

The [release workflow](.github/workflows/release.yml) then signs the add-on, attaches the `.xpi` to a GitHub release and adds it to `updates.json`. Installed copies check that file about once a day. Mozilla never signs the same version twice, so a failed release needs a new version number if it got past signing.

## When YouTube changes

Most breakages will be a selector going out of date. All YouTube selectors are in `content/hide.css`, except the player classes used to place the skip buttons in `content/content.js`.
