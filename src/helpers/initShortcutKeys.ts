import { mainWindow } from "../main";

export const shortcutId =
{
    open: "le-shortcut-open",
    select: "le-shortcut-select",
    delete: "le-shortcut-delete",
    multiplier: "le-shortcut-multiplier",
    place: "le-shortcut-place",
    cycle: "le-shortcut-cycle"
};

export const shortcutNames =
{
    open: "Litter Editor: Open",
    select: "Litter Editor: Select litter",
    delete: "Litter Editor: Delete litter",
    multiplier: "Litter Editor: Toggle multiplier",
    place: "Litter Editor: Place litter",
    cycle: "Litter Editor: Cycle litter type"
};

export const shortcutBindings =
{
    open: ["CTRL+SHIFT+L"],
    select: ["CTRL+SHIFT+P"],
    delete: ["CTRL+SHIFT+D"],
    multiplier: ["CTRL+SHIFT+M"],
    place: ["CTRL+SHIFT+B"],
    cycle: ["CTRL+SHIFT+C"]
};

export function initShortcuts(): void
{
    ui.registerShortcut({
        id: shortcutId.open,
        text: shortcutNames.open,
        bindings: shortcutBindings.open,
        callback: () => { mainWindow.open(); }
    });

    ui.registerShortcut({
        id: shortcutId.select,
        text: shortcutNames.select,
        bindings: shortcutBindings.select,
        callback: () => { mainWindow.selectLitter("litter"); }
    });

    ui.registerShortcut({
        id: shortcutId.delete,
        text: shortcutNames.delete,
        bindings: shortcutBindings.delete,
        callback: () => { mainWindow.removeLitter("litter"); }
    });

    ui.registerShortcut({
        id: shortcutId.multiplier,
        text: shortcutNames.multiplier,
        bindings: shortcutBindings.multiplier,
        callback: () => { mainWindow.toggleMultiplier(); }
    });

    ui.registerShortcut({
        id: shortcutId.place,
        text: shortcutNames.place,
        bindings: shortcutBindings.place,
        callback: () => { mainWindow.createLitter("litter"); }
    });

    ui.registerShortcut({
        id: shortcutId.cycle,
        text: shortcutNames.cycle,
        bindings: shortcutBindings.cycle,
        callback: () => { mainWindow.cycleLitter(); }
    });
}

