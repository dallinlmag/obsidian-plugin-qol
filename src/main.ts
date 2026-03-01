import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, PluginSettings, QOLSettingTab} from "./settings";

export default class QOLPlugin extends Plugin {
	settings: PluginSettings;
	private previousReadableLineLength: boolean | null = null;

	async onload() {
		await this.loadSettings();

		// Remember the user's current readable-line-length preference, then disable it
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		this.previousReadableLineLength = (this.app.vault as any).getConfig("readableLineLength") ?? true;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		(this.app.vault as any).setConfig("readableLineLength", false);

		this.applyWidthStyle();
		this.addSettingTab(new QOLSettingTab(this.app, this));
	}

	onunload() {
		// Remove CSS custom properties
		document.body.style.removeProperty("--qol-min-width");
		document.body.style.removeProperty("--qol-preferred-width");
		document.body.style.removeProperty("--qol-max-width");

		// Restore the user's previous readable-line-length setting
		if (this.previousReadableLineLength !== null) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			(this.app.vault as any).setConfig("readableLineLength", this.previousReadableLineLength);
		}
	}

	/** Update CSS custom properties used by styles.css for text width. */
	applyWidthStyle() {
		const {widthPercent, minWidthPx, maxWidthPx} = this.settings;

		const min = minWidthPx > 0 ? `${minWidthPx}px` : "0px";
		const preferred = `${widthPercent}%`;
		const max = maxWidthPx > 0 ? `${maxWidthPx}px` : "100%";

		document.body.style.setProperty("--qol-min-width", min);
		document.body.style.setProperty("--qol-preferred-width", preferred);
		document.body.style.setProperty("--qol-max-width", max);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
