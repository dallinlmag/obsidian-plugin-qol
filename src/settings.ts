import {App, PluginSettingTab, Setting} from "obsidian";
import QOLPlugin from "./main";

export interface PluginSettings {
	/** Width as a percentage of the editor pane (10–100) */
	widthPercent: number;
	/** Minimum width in pixels (0 = no minimum) */
	minWidthPx: number;
	/** Maximum width in pixels (0 = no maximum) */
	maxWidthPx: number;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	widthPercent: 100,
	minWidthPx: 0,
	maxWidthPx: 0,
};

export class QOLSettingTab extends PluginSettingTab {
	plugin: QOLPlugin;

	constructor(app: App, plugin: QOLPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		new Setting(containerEl)
			.setDesc("The default readable line length in Obsidian is 700 px. Use that as a reference when setting min/max values below.");

		new Setting(containerEl)
			.setName("Width percentage")
			.setDesc("How much of the editor pane the text should fill (10–100%).")
			.addSlider(slider => slider
				.setLimits(10, 100, 1)
				.setValue(this.plugin.settings.widthPercent)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.widthPercent = value;
					await this.plugin.saveSettings();
					this.plugin.applyWidthStyle();
				}));

		new Setting(containerEl)
			.setName("Minimum width (px)")
			.setDesc("Minimum width in pixels. Set to 0 for no minimum.")
			.addText(text => text
				.setPlaceholder("700")
				.setValue(String(this.plugin.settings.minWidthPx))
				.onChange(async (value) => {
					const num = parseInt(value, 10);
					this.plugin.settings.minWidthPx = isNaN(num) || num < 0 ? 0 : num;
					await this.plugin.saveSettings();
					this.plugin.applyWidthStyle();
				}));

		new Setting(containerEl)
			.setName("Maximum width (px)")
			.setDesc("Maximum width in pixels. Set to 0 for no maximum.")
			.addText(text => text
				.setPlaceholder("0")
				.setValue(String(this.plugin.settings.maxWidthPx))
				.onChange(async (value) => {
					const num = parseInt(value, 10);
					this.plugin.settings.maxWidthPx = isNaN(num) || num < 0 ? 0 : num;
					await this.plugin.saveSettings();
					this.plugin.applyWidthStyle();
				}));
	}
}
