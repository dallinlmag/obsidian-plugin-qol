# Obsidian QOL

Control the text width of your editor with a percentage-based slider and optional min/max pixel bounds.

This plugin replaces Obsidian's built-in "Readable line length" toggle with a more flexible width control. Instead of a fixed 700 px column, you can set the text width as a percentage of the editor pane and optionally constrain it with minimum and maximum pixel values.

## Features

- **Width percentage** — Set how much of the editor pane the text should fill (10–100%).
- **Minimum width** — Prevent the text from becoming too narrow on small panes (in pixels).
- **Maximum width** — Cap the text width on ultra-wide monitors (in pixels).

All settings are applied instantly via a `clamp()` CSS rule and take effect in both editing and reading views.

## Installation

### From community plugins

1. Open **Settings → Community plugins**.
2. Search for **Obsidian QOL**.
3. Click **Install**, then **Enable**.

### Manual installation

Copy `main.js`, `manifest.json`, and `styles.css` into your vault at:

```
<vault>/.obsidian/plugins/obsidian-qol/
```

## Usage

Open **Settings → Obsidian QOL** and adjust the width percentage, minimum width, and maximum width to your liking. Changes take effect immediately.
