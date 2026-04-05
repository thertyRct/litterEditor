import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { LitterEditorWindow } from "./ui/window";
import { initShortcuts } from "./helpers/initShortcutKeys";


export const mainWindow = new LitterEditorWindow();


/**
 * Entry point of the plugin.
 */
export function main(): void
{
	debug("Plugin started.");

	if (!isUiAvailable || network.mode != "none")
	{
		return;
	}

	initShortcuts(mainWindow);

	ui.registerMenuItem("Litter Editor", () => mainWindow.open());
}
