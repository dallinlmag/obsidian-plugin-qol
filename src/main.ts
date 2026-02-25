import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, PluginSettings, QOLSettingTab} from "./settings";

const STYLE_ID = "qol-text-width-style";

export default class QOLPlugin extends Plugin {
	settings: PluginSettings;
	private previousReadableLineLength: boolean | null = null;

	async onload() {
		await this.loadSettings();

		// Remember the user's current readable-line-length preference, then disable it
		this.previousReadableLineLength = (this.app.vault as any).getConfig("readableLineLength") ?? true;
		(this.app.vault as any).setConfig("readableLineLength", false);

		this.applyWidthStyle();
		this.addSettingTab(new QOLSettingTab(this.app, this));
	}

	onunload() {
		// Remove injected style
		document.getElementById(STYLE_ID)?.remove();

		// Restore the user's previous readable-line-length setting
		if (this.previousReadableLineLength !== null) {
			(this.app.vault as any).setConfig("readableLineLength", this.previousReadableLineLength);
		}
	}

	/** Build and inject (or update) the dynamic <style> element for text width. */
	applyWidthStyle() {
		const {widthPercent, minWidthPx, maxWidthPx} = this.settings;

		const min = minWidthPx > 0 ? `${minWidthPx}px` : "0px";
		const preferred = `${widthPercent}%`;
		const max = maxWidthPx > 0 ? `${maxWidthPx}px` : "100%";

		const css = `
/* QOL Plugin – text width override */
.markdown-source-view .cm-sizer,
.markdown-reading-view .markdown-preview-sizer {
	max-width: clamp(${min}, ${preferred}, ${max}) !important;
	margin-left: auto !important;
	margin-right: auto !important;
}`;

		let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
		if (!styleEl) {
			styleEl = document.createElement("style");
			styleEl.id = STYLE_ID;
			document.head.appendChild(styleEl);
		}
		styleEl.textContent = css;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
