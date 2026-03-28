//import { debug } from "../helpers/logger";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { getTileElements } from "../helpers/Z-Coords";
import { litterCount, totalLitterCount } from "../helpers/litterStats";
import { LITTER_FONT } from "../helpers/litterFont";

export const windowId = "litter-editor-window";

const windowColour = 12;
const widgetLineHeight = 14;

// Tab 1 Widgets
const buttonPipette: string = "litter-editor-button-pipette";
const toolSelectLitter: string = "litter-editor-tool-select-litter";
const litterTypeDropDown: string = "litter-editor-litter-type-drop-down";
const litterTypeLabel: string = "litter-editor-litter-type-label";
const buttonDelete: string = "litter-editor-button-delete";
const toolRemoveLitter: string = "litter-editor-tool-remove-litter";
const xPositionLabel: string = "litter-editor-x-position-label";
const yPositionLabel: string = "litter-editor-y-position-label";
const zPositionLabel: string = "litter-editor-z-position-label";
const xPositionSpinner: string = "litter-editor-x-position-spinner";
const yPositionSpinner: string = "litter-editor-y-position-spinner";
const zPositionSpinner: string = "litter-editor-z-position-spinner";
const litterViewport: string = "litter-editor-litter-viewport";
const multiplierDropdown: string = "litter-editor-multiplier-drop-down";
const buttonCreateLitter: string = "litter-editor-button-create-litter";
const multiplierIndex: string[] = ["x1", "x10", "x100"];
const multiplierLabel: string = "litter-editor-multiplier-label";
const toolCreateLitter: string = "litter-editor-tool-create-litter";

// Tab 4: Diagonal Text Widgets
const toolDiagText: string = "litter-editor-diag-text-tool";
const diagTextLabel: string = "litter-editor-diag-text-label";
const diagTextCurrentLabel: string = "litter-editor-diag-text-current-label";
const diagTextDropDown: string = "litter-editor-diag-text-drop-down";
const diagTextDropDownLabel: string = "litter-editor-diag-text-drop-down-label";
const diagTextPlaceButton: string = "litter-editor-diag-text-place-button";
const diagTextUndoButton: string = "litter-editor-diag-text-undo-button";
const diagTextXSpacingSpinner: string = "litter-editor-diag-text-x-spacing-spinner";
const diagTextYSpacingSpinner: string = "litter-editor-diag-text-y-spacing-spinner";
const diagTextZSpacingSpinner: string = "litter-editor-diag-text-z-spacing-spinner";
const diagTextKerningSpinner: string = "litter-editor-diag-text-kerning-spinner";
const diagTextZOffsetSpinner: string = "litter-editor-diag-text-z-offset-spinner";
const diagTextXOffsetSpinner: string = "litter-editor-diag-text-x-offset-spinner";
const diagTextYOffsetSpinner: string = "litter-editor-diag-text-y-offset-spinner";
const diagTextBiasSpinner: string = "litter-editor-diag-text-bias-spinner";
const diagTextAlignmentDropDown: string = "litter-editor-diag-text-alignment-drop-down";
const diagTextDirectionDropDown: string = "litter-editor-diag-text-direction-drop-down";

// Tab 3: Track Distributor Widgets
const trackDistRideDropdown: string   = "litter-editor-track-dist-ride-dropdown";
const trackDistRideLabel: string      = "litter-editor-track-dist-ride-label";
const trackDistCountSpinner: string   = "litter-editor-track-dist-count-spinner";
const trackDistCountLabel: string     = "litter-editor-track-dist-count-label";
const trackDistLitterDropdown: string = "litter-editor-track-dist-litter-dropdown";
const trackDistLitterLabel: string    = "litter-editor-track-dist-litter-label";
const trackDistOffsetSpinner: string  = "litter-editor-track-dist-offset-spinner";
const trackDistOffsetLabel: string    = "litter-editor-track-dist-offset-label";
const trackDistButton: string         = "litter-editor-track-dist-button";
const trackDistUndoButton: string     = "litter-editor-track-dist-undo-button";

// Tab 5: Image Printer Widgets
const toolImagePrinter: string = "litter-editor-img-print-tool";
const imgPrintStringLabel: string = "litter-editor-img-print-string-label";
const imgPrintCurrentLabel: string = "litter-editor-img-print-current-label";
const imgPrintPlaceButton: string = "litter-editor-img-print-place-button";
const imgPrintUndoButton: string = "litter-editor-img-print-undo-button";
const imgPrintScaleSpinner: string = "litter-editor-img-print-scale-spinner";
const imgPrintPlaneDropDown: string = "litter-editor-img-print-plane-dropdown";
const imgPrintZOffsetSpinner: string = "litter-editor-img-print-z-offset-spinner";
const imgPrintXOffsetSpinner: string = "litter-editor-img-print-x-offset-spinner";
const imgPrintYOffsetSpinner: string = "litter-editor-img-print-y-offset-spinner";

// --- STATE VARIABLES ---
let idLitter: Litter;
let multiplier: number = 1;
let selectedLitterType: LitterType = "vomit";
let diagTextString: string = "";

let diagTextLitterType: LitterType = "vomit";
let diagTextXSpacing: number = 2;
let diagTextYSpacing: number = 2;
let diagTextZSpacing: number = 2;
let diagTextKerning: number = 2;
let diagTextZOffset: number = 0;
let diagTextXOffset: number = 0;
let diagTextYOffset: number = 0;
let diagTextBias: number = 0;
let diagTextAlignment: number = 0;
let diagTextDirection: number = 0;

let trackDistRideItems: string[] = [];
let trackDistRideIds: number[] = [];
let trackDistSelectedRideIdx: number = 0;
let trackDistCount: number = 4;
let trackDistLitterType: LitterType = "vomit";
let trackDistZOffset: number = 0;

// Image Printer State
let imgPrintString: string = "";
let imgPrintScale: number = 3;
let imgPrintPlane: number = 0; // 0 = Floor, 1 = Orthog, 2 = Diag
let imgPrintZOffset: number = 0;
let imgPrintXOffset: number = 0;
let imgPrintYOffset: number = 0;

export const litterTypeList: LitterType[] = ["vomit", "vomit_alt", "empty_can", "rubbish", "burger_box", "empty_cup", "empty_box", "empty_bottle", "empty_bowl_red", "empty_drink_carton", "empty_juice_cup", "empty_bowl_blue"];

// Undo State
let lastPlacedLitterIds: number[] = [];

export class LitterEditorWindow {
	open(): void {
		const window = ui.getWindow(windowId);
		if (window) {
			window.bringToFront();
		}
		else {
			let windowTitle = `Litter Editor (v${pluginVersion})`;
			if (isDevelopment) { windowTitle += " [DEBUG]"; }
			
			trackDistRideItems = [];
			trackDistRideIds = [];
			const rides = map.rides;
			for (let i = 0; i < rides.length; i++) {
				const ride = rides[i];
				trackDistRideItems.push(ride.id + ": " + ride.name);
				trackDistRideIds.push(ride.id);
			}
			trackDistSelectedRideIdx = 0;

			ui.openWindow({
				onClose: () => { ui.tool?.cancel(); },
				classification: windowId,
				title: windowTitle,
				width: 260,
				height: 260,
				colours: [windowColour, windowColour],
				tabs: [
					// TAB 1: PIPETTE
					{
						image: 5478,
						widgets: [
							
							<GroupBoxWidget>{ type: "groupbox", x: 10, y: 55, width: 240, height: 170, text: "Litter", },
							<ButtonDesc>{ name: buttonPipette, type: "button", border: true, tooltip: "Select litter", x: 20, y: 75, width:25, height: 25, image: 29402, isPressed: false, onClick: () => this.selectLitter("litter") },
							<ButtonDesc>{ name: buttonDelete, type: "button", border: true, tooltip: "Remove litter", x: 80, y: 75, width: 25, height: 25, image: 5165, isPressed: false, onClick: () => this.removeLitter("litter") },
							<ButtonDesc>{ name: buttonCreateLitter, type: "button", border: true, tooltip: "Place litter", x: 50, y: 75, width: 25, height: 25, image: 5173, isPressed: false, onClick: () => this.createLitter("litter") },
							<LabelWidget>{ name: litterTypeLabel, type: "label", x: 20, y: 110, width: 75, height: widgetLineHeight, text: "Litter Type", isDisabled: true, },
							<DropdownDesc>{ name: litterTypeDropDown, type: "dropdown", x: 90, y: 110, width: 125, height: widgetLineHeight, items: ["Vomit", "Vomit Alt", "Empty Can", "Rubbish", "Burger Box", "Empty Cup", "Empty Box", "Empty Bottle", "Empty Bowl Red", "Empty Drink Carton", "Empty Juice Cup", "Empty Bowl Blue"], selectedIndex: -1, isDisabled: true, onChange: (number) => this.setLitter(number) },
							<LabelWidget>{ name: xPositionLabel, type: "label", x: 20, y: 135, width: 125, height: widgetLineHeight, text: "X-Position", isDisabled: true, },
							<SpinnerDesc>{ name: xPositionSpinner, type: "spinner", x: 90, y: 135, width: 70, height: widgetLineHeight, text: " ", isDisabled: true, onIncrement: () => this.increase(xPositionSpinner, "x"), onDecrement: () => this.decrease(xPositionSpinner, "x"), },
							<LabelWidget>{ name: yPositionLabel, type: "label", x: 20, y: 153, width: 125, height: widgetLineHeight, text: "Y-Position", isDisabled: true, },
							<SpinnerDesc>{ name: yPositionSpinner, type: "spinner", x: 90, y: 153, width: 70, height: widgetLineHeight, text: " ", isDisabled: true, onIncrement: () => this.increase(yPositionSpinner, "y"), onDecrement: () => this.decrease(yPositionSpinner, "y"), },
							<LabelWidget>{ name: zPositionLabel, type: "label", x: 20, y: 171, width: 125, height: widgetLineHeight, text: "Z-Position", isDisabled: true, },
							<SpinnerDesc>{ name: zPositionSpinner, type: "spinner", x: 90, y: 171, width: 70, height: widgetLineHeight, text: " ", isDisabled: true, onIncrement: () => this.increase(zPositionSpinner, "z"), onDecrement: () => this.decrease(zPositionSpinner, "z"), },
							<LabelWidget>{ name: multiplierLabel, type: "label", x: 20, y: 196, width: 125, height: widgetLineHeight, text: "Multiplier", isDisabled: true, },
							<DropdownDesc>{ name: multiplierDropdown, type: "dropdown", x: 90, y: 196, width: 70, height: widgetLineHeight, items: multiplierIndex, selectedIndex: 0, isDisabled: true, onChange: (number) => this.setMultiplier(number) },
							<ViewportDesc>{ name: litterViewport, type: "viewport", x: 165, y: 135, width: 75, height: 75, }
						],
					},
					// TAB 2: STATS
					{
						image: { frameBase: 5391, frameCount: 16, frameDuration: 4, },
						widgets: [
							
							<GroupBoxDesc>{ type: "groupbox", x: 10, y: 55, width: 240, height: 170, text: "Statistics", },
							<CustomDesc>{ type: "custom", x: 20, y: 80, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(23101); if (img) { g.image(img.id, 7, 7); } } },
							<LabelDesc>{ type: "label", x: 40, y: 80, width: 110, height: widgetLineHeight, text: `Vomit: {WHITE}${litterCount("vomit")}`, },
							<CustomDesc>{ type: "custom", x: 20, y: 95, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(23104); if (img) { g.image(img.id, 7, 7); } } },
							<LabelDesc>{ type: "label", x: 40, y: 95, width: 110, height: widgetLineHeight, text: `Vomit Alt: {WHITE}${litterCount("vomit_alt")}`, },
							<CustomDesc>{ type: "custom", x: 20, y: 110, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5071); if (img) { g.image(img.id, 0, 0); } } },
							<LabelDesc>{ type: "label", x: 40, y: 110, width: 110, height: widgetLineHeight, text: `Empty Can: {WHITE}${litterCount("empty_can")}`, },
							<CustomDesc>{ type: "custom", x: 20, y: 125, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5072); if (img) { g.image(img.id, 0, 0); } } },
							<LabelDesc>{ type: "label", x: 40, y: 125, width: 110, height: widgetLineHeight, text: `Rubbish: {WHITE}${litterCount("rubbish")}`, },
							<CustomDesc>{ type: "custom", x: 20, y: 140, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5073); if (img) { g.image(img.id, 0, 0); } } },
							<LabelWidget>{ type: "label", x: 40, y: 140, width: 110, height: widgetLineHeight, text: `Burger Box: {WHITE}${litterCount("burger_box")}`, },
							<CustomDesc>{ type: "custom", x: 20, y: 155, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5084); if (img) { g.image(img.id, 0, 0); } } },
							<LabelWidget>{ type: "label", x: 40, y: 155, width: 110, height: widgetLineHeight, text: `Empty Cup: {WHITE}${litterCount("empty_cup")}`, },
							<CustomDesc>{ type: "custom", x: 130, y: 80, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5087); if (img) { g.image(img.id, 0, 0); } } },
							<LabelDesc>{ type: "label", x: 150, y: 80, width: 110, height: widgetLineHeight, text: `Empty Box: {WHITE}${litterCount("empty_box")}`, },
							<CustomDesc>{ type: "custom", x: 130, y: 95, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5088); if (img) { g.image(img.id, 0, 0); } } },
							<LabelDesc>{ type: "label", x: 150, y: 95, width: 110, height: widgetLineHeight, text: `Empty Bottle: {WHITE}${litterCount("empty_bottle")}`, },
							<CustomDesc>{ type: "custom", x: 130, y: 110, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5106); if (img) { g.image(img.id, 0, 0); } } },
							<LabelDesc>{ type: "label", x: 150, y: 110, width: 110, height: widgetLineHeight, text: `Bowl Red: {WHITE}${litterCount("empty_bowl_red")}`, },
							<CustomDesc>{ type: "custom", x: 130, y: 125, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5107); if (img) { g.image(img.id, 0, 0); } } },
							<LabelDesc>{ type: "label", x: 150, y: 125, width: 110, height: widgetLineHeight, text: `Drink Carton: {WHITE}${litterCount("empty_drink_carton")}`, },
							<CustomDesc>{ type: "custom", x: 130, y: 140, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5108); if (img) { g.tertiaryColour = 18; g.image(img.id, 0, 0); } } },
							<LabelWidget>{ type: "label", x: 150, y: 140, width: 110, height: widgetLineHeight, text: `Juice Cup: {WHITE}${litterCount("empty_juice_cup")}`, },
							<CustomDesc>{ type: "custom", x: 130, y: 155, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5110); if (img) { g.image(img.id, 0, 0); } } },
							<LabelWidget>{ type: "label", x: 150, y: 155, width: 110, height: widgetLineHeight, text: `Bowl Blue: {WHITE}${litterCount("empty_bowl_blue")}`, },
							<CustomDesc>{ type: "custom", x: 20, y: 190, width: 14, height: 14, onDraw: function (g) { const img = g.getImage(5115); if (img) { g.image(img.id, 0, 0); } } },
							<LabelWidget>{ type: "label", x: 40, y: 190, width: 200, height: widgetLineHeight, text: `Total amount of litter: {WHITE}${totalLitterCount()}`, },
						],
					},
					// TAB 3: TRACK DISTRIBUTOR
					{
						image: 29367,
						widgets: [
							<GroupBoxWidget>{ type: "groupbox", x: 10, y: 55, width: 240, height: 170, text: "Track Distributor", },
							<LabelWidget>{ name: trackDistRideLabel, type: "label", x: 20, y: 72, width: 65, height: widgetLineHeight, text: "Ride", },
							<DropdownDesc>{ name: trackDistRideDropdown, type: "dropdown", x: 90, y: 72, width: 150, height: widgetLineHeight, items: trackDistRideItems.length > 0 ? trackDistRideItems : ["(no rides)"], selectedIndex: 0, onChange: (index: number) => onTrackDistRideChanged(index), },
							<LabelWidget>{ name: trackDistCountLabel, type: "label", x: 20, y: 92, width: 65, height: widgetLineHeight, text: "Num. Litter", },
							<SpinnerDesc>{ name: trackDistCountSpinner, type: "spinner", x: 90, y: 92, width: 70, height: widgetLineHeight, text: "4", onIncrement: () => onTrackDistCountChange(1), onDecrement: () => onTrackDistCountChange(-1), },
							<LabelWidget>{ name: trackDistLitterLabel, type: "label", x: 20, y: 112, width: 65, height: widgetLineHeight, text: "Litter Type", },
							<DropdownDesc>{ name: trackDistLitterDropdown, type: "dropdown", x: 90, y: 112, width: 150, height: widgetLineHeight, items: ["Vomit", "Vomit Alt", "Empty Can", "Rubbish", "Burger Box", "Empty Cup", "Empty Box", "Empty Bottle", "Empty Bowl Red", "Empty Drink Carton", "Empty Juice Cup", "Empty Bowl Blue"], selectedIndex: 0, onChange: (index: number) => onTrackDistLitterTypeChanged(index), },
							<LabelWidget>{ name: trackDistOffsetLabel, type: "label", x: 20, y: 132, width: 65, height: widgetLineHeight, text: "Z Offset", },
							<SpinnerDesc>{ name: trackDistOffsetSpinner, type: "spinner", x: 90, y: 132, width: 70, height: widgetLineHeight, text: "0", onIncrement: () => onTrackDistOffsetChange(1), onDecrement: () => onTrackDistOffsetChange(-1), },
							<ButtonDesc>{ name: trackDistButton, type: "button", x: 20, y: 160, width: 150, height: 25, text: "Distribute Litter", onClick: () => distributeTrackLitter(), },
							<ButtonDesc>{ name: trackDistUndoButton, type: "button", x: 175, y: 160, width: 65, height: 25, text: "Undo", onClick: () => undoLastPlacement(), },
						],
					},
					// TAB 4: DIAGONAL TEXT
					{
						image: { frameBase: 5221, frameCount: 8, frameDuration: 4, },
						widgets: [
							<GroupBoxWidget>{ type: "groupbox", x: 10, y: 55, width: 240, height: 185, text: "Diagonal Text", },
							<LabelWidget>{ name: diagTextLabel, type: "label", x: 20, y: 75, width: 50, height: widgetLineHeight, text: "Text", isDisabled: true, },
							<ButtonDesc>{
								type: "button", border: true, x: 70, y: 72, width: 70, height: widgetLineHeight + 2, text: "Set Text...",
								onClick: () => {
									ui.showTextInput({
										title: "Diagonal Text", description: "Enter the text to place (A-Z):", initialValue: diagTextString,
										callback: value => {
											diagTextString = value.toUpperCase();
											const w = ui.getWindow(windowId);
											if (w) { w.findWidget<LabelWidget>(diagTextCurrentLabel).text = diagTextString || "(none)"; }
										}
									});
								}
							},
							<LabelWidget>{ name: diagTextCurrentLabel, type: "label", x: 145, y: 75, width: 100, height: widgetLineHeight, text: "(none)", },
							<LabelWidget>{ name: diagTextDropDownLabel, type: "label", x: 20, y: 95, width: 75, height: widgetLineHeight, text: "Litter Type", isDisabled: true, },
							<DropdownDesc>{ name: diagTextDropDown, type: "dropdown", x: 90, y: 95, width: 125, height: widgetLineHeight, items: ["Vomit", "Vomit Alt", "Empty Can", "Rubbish", "Burger Box", "Empty Cup", "Empty Box", "Empty Bottle", "Empty Bowl Red", "Empty Drink Carton", "Empty Juice Cup", "Empty Bowl Blue"], selectedIndex: 0, onChange: (number) => { diagTextLitterType = ["vomit", "vomit_alt", "empty_can", "rubbish", "burger_box", "empty_cup", "empty_box", "empty_bottle", "empty_bowl_red", "empty_drink_carton", "empty_juice_cup", "empty_bowl_blue"][number] as LitterType; } },
							<ButtonDesc>{ name: diagTextPlaceButton, type: "button", border: true, x: 70, y: 115, width: 75, height: widgetLineHeight + 2, text: "Place Text", isPressed: false, onClick: () => onDiagTextPlace() },
							<ButtonDesc>{ name: diagTextUndoButton, type: "button", border: true, x: 150, y: 115, width: 40, height: widgetLineHeight + 2, text: "Undo", onClick: () => undoLastPlacement() },
							
							<LabelWidget>{ type: "label", x: 15, y: 140, width: 62, height: widgetLineHeight, text: "X Spacing", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextXSpacingSpinner, type: "spinner", x: 80, y: 140, width: 55, height: widgetLineHeight, text: "2", onIncrement: () => { diagTextXSpacing = Math.min(32, diagTextXSpacing + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextXSpacingSpinner).text = diagTextXSpacing.toString(); }, onDecrement: () => { diagTextXSpacing = Math.max(0, diagTextXSpacing - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextXSpacingSpinner).text = diagTextXSpacing.toString(); }, },
							<LabelWidget>{ type: "label", x: 140, y: 140, width: 55, height: widgetLineHeight, text: "Y Spacing", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextYSpacingSpinner, type: "spinner", x: 198, y: 140, width: 45, height: widgetLineHeight, text: "2", onIncrement: () => { diagTextYSpacing = Math.min(32, diagTextYSpacing + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextYSpacingSpinner).text = diagTextYSpacing.toString(); }, onDecrement: () => { diagTextYSpacing = Math.max(0, diagTextYSpacing - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextYSpacingSpinner).text = diagTextYSpacing.toString(); }, },
							
							<LabelWidget>{ type: "label", x: 15, y: 156, width: 62, height: widgetLineHeight, text: "Z Spacing", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextZSpacingSpinner, type: "spinner", x: 80, y: 156, width: 55, height: widgetLineHeight, text: "2", onIncrement: () => { diagTextZSpacing = Math.min(32, diagTextZSpacing + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextZSpacingSpinner).text = diagTextZSpacing.toString(); }, onDecrement: () => { diagTextZSpacing = Math.max(0, diagTextZSpacing - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextZSpacingSpinner).text = diagTextZSpacing.toString(); }, },
							<LabelWidget>{ type: "label", x: 140, y: 156, width: 55, height: widgetLineHeight, text: "Kerning", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextKerningSpinner, type: "spinner", x: 198, y: 156, width: 45, height: widgetLineHeight, text: "2", onIncrement: () => { diagTextKerning = Math.min(32, diagTextKerning + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextKerningSpinner).text = diagTextKerning.toString(); }, onDecrement: () => { diagTextKerning = Math.max(0, diagTextKerning - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextKerningSpinner).text = diagTextKerning.toString(); }, },
							
							<LabelWidget>{ type: "label", x: 15, y: 172, width: 62, height: widgetLineHeight, text: "X Offset", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextXOffsetSpinner, type: "spinner", x: 80, y: 172, width: 55, height: widgetLineHeight, text: "0", onIncrement: () => { diagTextXOffset = Math.min(128, diagTextXOffset + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextXOffsetSpinner).text = diagTextXOffset.toString(); }, onDecrement: () => { diagTextXOffset = Math.max(-128, diagTextXOffset - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextXOffsetSpinner).text = diagTextXOffset.toString(); }, },
							<LabelWidget>{ type: "label", x: 140, y: 172, width: 55, height: widgetLineHeight, text: "Y Offset", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextYOffsetSpinner, type: "spinner", x: 198, y: 172, width: 45, height: widgetLineHeight, text: "0", onIncrement: () => { diagTextYOffset = Math.min(128, diagTextYOffset + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextYOffsetSpinner).text = diagTextYOffset.toString(); }, onDecrement: () => { diagTextYOffset = Math.max(-128, diagTextYOffset - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextYOffsetSpinner).text = diagTextYOffset.toString(); }, },
							
							<LabelWidget>{ type: "label", x: 15, y: 188, width: 62, height: widgetLineHeight, text: "Z Offset", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextZOffsetSpinner, type: "spinner", x: 80, y: 188, width: 55, height: widgetLineHeight, text: "0", onIncrement: () => { diagTextZOffset = Math.min(256, diagTextZOffset + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextZOffsetSpinner).text = diagTextZOffset.toString(); }, onDecrement: () => { diagTextZOffset = Math.max(-256, diagTextZOffset - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextZOffsetSpinner).text = diagTextZOffset.toString(); }, },
							<LabelWidget>{ type: "label", x: 140, y: 188, width: 55, height: widgetLineHeight, text: "Bias", isDisabled: true, },
							<SpinnerDesc>{ name: diagTextBiasSpinner, type: "spinner", x: 198, y: 188, width: 45, height: widgetLineHeight, text: "0", onIncrement: () => { diagTextBias = Math.min(128, diagTextBias + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextBiasSpinner).text = diagTextBias.toString(); }, onDecrement: () => { diagTextBias = Math.max(-128, diagTextBias - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(diagTextBiasSpinner).text = diagTextBias.toString(); }, },
							
							<LabelWidget>{ type: "label", x: 15, y: 204, width: 62, height: widgetLineHeight, text: "Alignment", isDisabled: true, },
							<DropdownDesc>{ name: diagTextAlignmentDropDown, type: "dropdown", x: 80, y: 204, width: 55, height: widgetLineHeight, items: ["Diag", "Grid"], selectedIndex: 0, onChange: (number) => { diagTextAlignment = number; }, },
							<LabelWidget>{ type: "label", x: 140, y: 204, width: 55, height: widgetLineHeight, text: "Direction", isDisabled: true, },
							<DropdownDesc>{ name: diagTextDirectionDropDown, type: "dropdown", x: 198, y: 204, width: 45, height: widgetLineHeight, items: ["Horz", "Vert"], selectedIndex: 0, onChange: (number) => { diagTextDirection = number; }, },
						],
					},
					// TAB 5: IMAGE PRINTER
					{
						image: { frameBase: 5173, frameCount: 8, frameDuration: 4, }, // Paintbrush/Scenery icon
						widgets: [
							<GroupBoxWidget>{ type: "groupbox", x: 10, y: 55, width: 240, height: 170, text: "Image Printer", },
							<LabelWidget>{ name: imgPrintStringLabel, type: "label", x: 20, y: 75, width: 50, height: widgetLineHeight, text: "Data", isDisabled: true, },
							<ButtonDesc>{
								type: "button", border: true, x: 70, y: 72, width: 70, height: widgetLineHeight + 2, text: "Set String...",
								onClick: () => {
									ui.showTextInput({
										title: "Image Printer", description: "Paste the encoded string from the Web App:", initialValue: imgPrintString,
										callback: value => {
											imgPrintString = value;
											const w = ui.getWindow(windowId);
											if (w) { w.findWidget<LabelWidget>(imgPrintCurrentLabel).text = imgPrintString ? "(Loaded)" : "(none)"; }
										}
									});
								}
							},
							<LabelWidget>{ name: imgPrintCurrentLabel, type: "label", x: 145, y: 75, width: 100, height: widgetLineHeight, text: "(none)", },
							<ButtonDesc>{ name: imgPrintPlaceButton, type: "button", border: true, x: 70, y: 95, width: 75, height: widgetLineHeight + 2, text: "Print Image", isPressed: false, onClick: () => onImgPrintPlace() },
							<ButtonDesc>{ name: imgPrintUndoButton, type: "button", border: true, x: 150, y: 95, width: 40, height: widgetLineHeight + 2, text: "Undo", onClick: () => undoLastPlacement() },
							
							// Uniform Scale Spinner
							<LabelWidget>{ type: "label", x: 15, y: 125, width: 62, height: widgetLineHeight, text: "Scale", isDisabled: true, },
							<SpinnerDesc>{ name: imgPrintScaleSpinner, type: "spinner", x: 80, y: 125, width: 55, height: widgetLineHeight, text: "3", onIncrement: () => { imgPrintScale = Math.min(32, imgPrintScale + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintScaleSpinner).text = imgPrintScale.toString(); }, onDecrement: () => { imgPrintScale = Math.max(1, imgPrintScale - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintScaleSpinner).text = imgPrintScale.toString(); }, },
							
							// Plane Dropdown (Floor, Orthog, Diag)
							<LabelWidget>{ type: "label", x: 140, y: 125, width: 55, height: widgetLineHeight, text: "Plane", isDisabled: true, },
							<DropdownDesc>{ name: imgPrintPlaneDropDown, type: "dropdown", x: 180, y: 125, width: 63, height: widgetLineHeight, items: ["Floor", "Orthog", "Diag"], selectedIndex: 0, onChange: (number) => { imgPrintPlane = number; }, },
							
							// X/Y/Z Offsets
							<LabelWidget>{ type: "label", x: 15, y: 145, width: 62, height: widgetLineHeight, text: "X Offset", isDisabled: true, },
							<SpinnerDesc>{ name: imgPrintXOffsetSpinner, type: "spinner", x: 80, y: 145, width: 55, height: widgetLineHeight, text: "0", onIncrement: () => { imgPrintXOffset = Math.min(128, imgPrintXOffset + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintXOffsetSpinner).text = imgPrintXOffset.toString(); }, onDecrement: () => { imgPrintXOffset = Math.max(-128, imgPrintXOffset - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintXOffsetSpinner).text = imgPrintXOffset.toString(); }, },
							
							<LabelWidget>{ type: "label", x: 140, y: 145, width: 55, height: widgetLineHeight, text: "Y Offset", isDisabled: true, },
							<SpinnerDesc>{ name: imgPrintYOffsetSpinner, type: "spinner", x: 188, y: 145, width: 55, height: widgetLineHeight, text: "0", onIncrement: () => { imgPrintYOffset = Math.min(128, imgPrintYOffset + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintYOffsetSpinner).text = imgPrintYOffset.toString(); }, onDecrement: () => { imgPrintYOffset = Math.max(-128, imgPrintYOffset - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintYOffsetSpinner).text = imgPrintYOffset.toString(); }, },
							
							<LabelWidget>{ type: "label", x: 15, y: 165, width: 62, height: widgetLineHeight, text: "Z Offset", isDisabled: true, },
							<SpinnerDesc>{ name: imgPrintZOffsetSpinner, type: "spinner", x: 80, y: 165, width: 55, height: widgetLineHeight, text: "0", onIncrement: () => { imgPrintZOffset = Math.min(256, imgPrintZOffset + 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintZOffsetSpinner).text = imgPrintZOffset.toString(); }, onDecrement: () => { imgPrintZOffset = Math.max(-256, imgPrintZOffset - 1); ui.getWindow(windowId).findWidget<SpinnerWidget>(imgPrintZOffsetSpinner).text = imgPrintZOffset.toString(); }, },
						],
					},
					// TAB 6: INFO
					{
						image:  5367,
						widgets: [
							<GroupBoxWidget>{ type: "groupbox", x: 10, y: 55, width: 240, height: 170, text: "Info", },
							<LabelWidget>{ type: "label", x: 20, y: 120, width: 220, height: widgetLineHeight, textAlign: "centred", text: "This LitterEditor is my first expierence with coding.\n\nSpecial thanks to:\nManticore_007, Basssiiie, Smitty\nand Gymnasiast.\n\ngithub.com/EnoxRCT/OpenRCT2-LitterEditor", },
						],
					}
				],
			});
		}
	}

	// --- TAB 1 FUNCTIONS ---
	selectLitter(type: EntityType): void {
		const window = ui.getWindow(windowId);
		if (!window) return;
		const buttonPicker = window.findWidget<ButtonWidget>(buttonPipette);
		const deleteButton = window.findWidget<ButtonWidget>(buttonDelete);
		const createLitterButton = window.findWidget<ButtonWidget>(buttonCreateLitter);
		if (buttonPicker.isPressed !== false) {
			buttonPicker.isPressed = false;
			ui.tool?.cancel();
		} else {
			buttonPicker.isPressed = true;
			deleteButton.isPressed = false;
			createLitterButton.isPressed = false;
			ui.activateTool({
				id: toolSelectLitter, cursor: "cross_hair", filter: ["entity"],
				onDown: e => {
					if (e.entityId !== undefined) {
						const entity = map.getEntity(e.entityId);
						const litter = <Litter>entity;
						idLitter = litter;
						if (!entity || entity.type !== type) {
							ui.showError("WARNING:", "This is not litter!");
						} else {
							this.getLitter(litter.litterType);
							window.findWidget<ButtonWidget>(buttonPipette).isPressed = false;
							window.findWidget<DropdownWidget>(litterTypeDropDown).isDisabled = false;
							window.findWidget<DropdownWidget>(multiplierDropdown).isDisabled = false;
							window.findWidget<SpinnerWidget>(xPositionSpinner).isDisabled = false;
							window.findWidget<SpinnerWidget>(yPositionSpinner).isDisabled = false;
							window.findWidget<SpinnerWidget>(zPositionSpinner).isDisabled = false;
							ui.tool?.cancel();
							this.getLitterCoords(litter);
							window.findWidget<ViewportWidget>(litterViewport).viewport.moveTo(litter);
						}
					}
				},
			});
		}
	}

	setLitter(number: number): void {
		// Check if the Paintbrush tool is active
		if (ui.tool && ui.tool.id === toolCreateLitter) {
			selectedLitterType = litterTypeList[number];
		} 

		else if (idLitter) {
			idLitter.litterType = litterTypeList[number];
		} 

		else {
			selectedLitterType = litterTypeList[number];
		}
	}

	getLitter(type: LitterType): void {
		const window = ui.getWindow(windowId);
		if (window) { window.findWidget<DropdownWidget>(litterTypeDropDown).selectedIndex = litterTypeList.indexOf(type); }
	}

	removeLitter(type: EntityType): void {
		const window =ui.getWindow(windowId);
		if (!window) return;
		const deleteButton = window.findWidget<ButtonWidget>(buttonDelete);
		if (deleteButton.isPressed !== false) {
			deleteButton.isPressed = false;
			ui.tool?.cancel();
		} else {
			deleteButton.isPressed = true;
			window.findWidget<ButtonWidget>(buttonPipette).isPressed = false;
			window.findWidget<ButtonWidget>(buttonCreateLitter).isPressed = false;
			ui.activateTool({
				id: toolRemoveLitter, cursor: "bin_down", filter: ["entity"],
				onDown: e => {
					if (e.entityId !== undefined) {
						const entity = map.getEntity(e.entityId);
						if (entity && entity.type === type) { entity.remove(); }
					}
				}
			});
		}
	}

	createLitter(type: EntityType): void {
		const window =ui.getWindow(windowId);
		if (!window) return;
		const createLitterButton = window.findWidget<ButtonWidget>(buttonCreateLitter);
		if (createLitterButton.isPressed !== false) {
			createLitterButton.isPressed = false;
			ui.tool?.cancel();
		} else {
			createLitterButton.isPressed = true;
			window.findWidget<ButtonWidget>(buttonPipette).isPressed = false;
			window.findWidget<ButtonWidget>(buttonDelete).isPressed = false;
			ui.activateTool({
				id: toolCreateLitter, cursor: "cross_hair", filter: ["terrain"],
				onDown: e => {
					if (e.mapCoords !== undefined) {
						const axisCoords = e.mapCoords;
						const surfaceElements = getTileElements("surface", axisCoords);
						const oneSurfaceElementZValue = surfaceElements[0].element.baseZ;
						const createdEntity = map.createEntity(type, {x: axisCoords.x, y: axisCoords.y, z: oneSurfaceElementZValue});
						if (createdEntity) { (<Litter>createdEntity).litterType = selectedLitterType; }
					}
				}
			});
		}
	}

	getLitterCoords(litterCoords: CoordsXYZ): void {
		const window = ui.getWindow(windowId);
		if (window) {
			window.findWidget<SpinnerWidget>(xPositionSpinner).text = litterCoords.x.toString();
			window.findWidget<SpinnerWidget>(yPositionSpinner).text = litterCoords.y.toString();
			window.findWidget<SpinnerWidget>(zPositionSpinner).text = litterCoords.z.toString();
		}
	}

	increase(spinner: string, axis: keyof CoordsXYZ): void {
		const widget = ui.getWindow(windowId).findWidget<SpinnerWidget>(spinner);
		idLitter[axis] = idLitter[axis] + 1 * multiplier;
		widget.text = idLitter[axis].toString();
		ui.getWindow(windowId).findWidget<ViewportWidget>(litterViewport).viewport.moveTo(idLitter);
	}

	decrease(spinner: string, axis: keyof CoordsXYZ): void {
		const widget = ui.getWindow(windowId).findWidget<SpinnerWidget>(spinner);
		idLitter[axis] = idLitter[axis] - 1 * multiplier;
		widget.text = idLitter[axis].toString();
		ui.getWindow(windowId).findWidget<ViewportWidget>(litterViewport).viewport.moveTo(idLitter);
	}

	setMultiplier(number: number): void {
		multiplier = number === 0 ? 1 : number === 1 ? 10 : 100;
	}

	toggleMultiplier(): void {
		const window = ui.getWindow(windowId);
		if (!window) return;
		const nextMultiplier = multiplier === 1 ? 10 : multiplier === 10 ? 100 : 1;
		this.setMultiplier(nextMultiplier === 1 ? 0 : nextMultiplier === 10 ? 1 : 2);
		window.findWidget<DropdownWidget>(multiplierDropdown).selectedIndex = nextMultiplier === 1 ? 0 : nextMultiplier === 10 ? 1 : 2;
	}

	cycleLitter(): void {
		const window = ui.getWindow(windowId);
		if (!window) return;
		const dropdown = window.findWidget<DropdownWidget>(litterTypeDropDown);
		const nextIndex = (dropdown.selectedIndex + 1) % litterTypeList.length;
		dropdown.selectedIndex = nextIndex;
		this.setLitter(nextIndex);
	}
}

// --- TAB 3 FUNCTIONS (TRACK DIST) ---
function onTrackDistRideChanged(index: number): void { trackDistSelectedRideIdx = index; }
function onTrackDistCountChange(delta: number): void {
	trackDistCount = Math.max(1, Math.min(8, trackDistCount + delta));
	ui.getWindow(windowId).findWidget<SpinnerWidget>(trackDistCountSpinner).text = trackDistCount.toString();
}
function onTrackDistLitterTypeChanged(index: number): void {
	const typeList: LitterType[] = ["vomit", "vomit_alt", "empty_can", "rubbish", "burger_box", "empty_cup", "empty_box", "empty_bottle", "empty_bowl_red", "empty_drink_carton", "empty_juice_cup", "empty_bowl_blue"];
	trackDistLitterType = typeList[index];
}
function onTrackDistOffsetChange(delta: number): void {
	trackDistZOffset = Math.max(-8, Math.min(8, trackDistZOffset + delta));
	ui.getWindow(windowId).findWidget<SpinnerWidget>(trackDistOffsetSpinner).text = trackDistZOffset.toString();
}

function distributeTrackLitter(): void {
	if (trackDistRideIds.length === 0 || trackDistSelectedRideIdx >= trackDistRideIds.length) { return; }
	const targetRideId = trackDistRideIds[trackDistSelectedRideIdx];
	const mapSize = map.size; 
	const N = trackDistCount; 
	lastPlacedLitterIds = []; 

	for (let tileX = 0; tileX < mapSize.x; tileX++) {
		for (let tileY = 0; tileY < mapSize.y; tileY++) {
			const tile = map.getTile(tileX, tileY);
			for (let i = 0; i < tile.elements.length; i++) {
				const el = tile.elements[i];
				if (el.type !== "track") { continue; }
				const trackEl = <TrackElement>el;
				if (trackEl.ride !== targetRideId || (trackEl.sequence !== null && trackEl.sequence > 0)) { continue; }
				const trackSegment = context.getTrackSegment(trackEl.trackType);
				if (!trackSegment) { continue; }
				const subpositions = trackSegment.getSubpositions(0, trackEl.direction);
				if (!subpositions || subpositions.length === 0) { continue; }

				const originX = tileX * 32, originY = tileY * 32;
				const itemsToPlace = Math.max(1, Math.floor((N * subpositions.length) / 32));

				for (let k = 0; k < itemsToPlace; k++) {
					const subposIndex = Math.floor(((2 * k + 1) * subpositions.length) / (2 * itemsToPlace));
					const pos = subpositions[subposIndex];
					const lx = originX + pos.x;
					const ly = originY + pos.y;
					const lz = trackEl.baseZ + pos.z + trackDistZOffset;

					const createdEntity = map.createEntity("litter", { x: lx, y: ly, z: lz });
					if (createdEntity && createdEntity.id !== null) {
						(<Litter>createdEntity).litterType = trackDistLitterType;
						lastPlacedLitterIds.push(createdEntity.id);
					}
				}
			}
		}
	}
}

// --- TAB 4 FUNCTIONS (DIAGONAL TEXT) ---
function onDiagTextPlace(): void {
	const window = ui.getWindow(windowId);
	if (!window) return;
	const placeButton = window.findWidget<ButtonWidget>(diagTextPlaceButton);
	if (placeButton.isPressed !== false) {
		placeButton.isPressed = false;
		ui.tool?.cancel();
	} else {
		placeButton.isPressed = true;
		ui.activateTool({
			id: toolDiagText, cursor: "cross_hair", filter: ["terrain"],
			onDown: e => {
				if (e.mapCoords !== undefined) {
					const surfaceElements = getTileElements("surface", e.mapCoords);
					const baseZ = surfaceElements[0].element.baseZ;
					placeDiagonalText(e.mapCoords, baseZ, diagTextString, diagTextLitterType);
					ui.getWindow(windowId).findWidget<ButtonWidget>(diagTextPlaceButton).isPressed = false;
					ui.tool?.cancel();
				}
			}
		});
	}
}

function placeDiagonalText(originCoords: CoordsXY, baseZ: number, text: string, litterType: LitterType): void {
	const CHAR_WIDTH = 5, CHAR_HEIGHT = 7;
	const charAdvanceX = (CHAR_WIDTH * diagTextXSpacing) + diagTextKerning;
	const charAdvanceY = (CHAR_WIDTH * diagTextYSpacing) + diagTextKerning;
	const rotation = ui.mainViewport.rotation;
	const upperText = text.toUpperCase();
	lastPlacedLitterIds = []; 

	// PRE-CALCULATE HEIGHT: For vertical text, shift the whole word up
	const charZStep = (CHAR_HEIGHT * diagTextZSpacing) + diagTextKerning;
	const wordVerticalShift = (diagTextDirection === 1) ? ((upperText.length - 1) * charZStep) : 0;

	for (let charIdx = 0; charIdx < upperText.length; charIdx++) {
		const glyph = LITTER_FONT[upperText[charIdx]] ?? LITTER_FONT[" "];
		for (let row = 0; row < CHAR_HEIGHT; row++) {
			for (let col = 0; col < CHAR_WIDTH; col++) {
				if (glyph[row][col] === 1) {
					let lx: number, ly: number, lz: number;
					
					// HORIZONTAL TEXT
					if (diagTextDirection === 0) {
						const dx = (charIdx * charAdvanceX) + (col * diagTextXSpacing);
						const dy = (charIdx * charAdvanceY) + (col * diagTextYSpacing);
						if (diagTextAlignment === 0) {
							switch (rotation) {
								case 0: lx = originCoords.x + diagTextXOffset - dx; ly = originCoords.y + diagTextYOffset + dy; break;
								case 1: lx = originCoords.x + diagTextXOffset - dx; ly = originCoords.y + diagTextYOffset - dy; break;
								case 2: lx = originCoords.x + diagTextXOffset + dx; ly = originCoords.y + diagTextYOffset - dy; break;
								default: lx = originCoords.x + diagTextXOffset + dx; ly = originCoords.y + diagTextYOffset + dy; break;
							}
						} else {
							switch (rotation) {
								case 0: lx = originCoords.x + diagTextXOffset - dx; ly = originCoords.y + diagTextYOffset; break;
								case 1: lx = originCoords.x + diagTextXOffset; ly = originCoords.y + diagTextYOffset - dy; break;
								case 2: lx = originCoords.x + diagTextXOffset + dx; ly = originCoords.y + diagTextYOffset; break;
								default: lx = originCoords.x + diagTextXOffset; ly = originCoords.y + diagTextYOffset + dy; break;
							}
						}
						// Character builds upwards from ground
						lz = baseZ + diagTextZOffset + (charIdx * diagTextBias) + ((CHAR_HEIGHT - 1 - row) * diagTextZSpacing);
					
					// VERTICAL TEXT
					} else {
				const colDx = (col * diagTextXSpacing) + (charIdx * diagTextBias);
				const colDy = (col * diagTextYSpacing) + (charIdx * diagTextBias);
				if (diagTextAlignment === 0) {
					switch (rotation) {
						case 0: lx = originCoords.x + diagTextXOffset - colDx; ly = originCoords.y + diagTextYOffset + colDy; break;
						case 1: lx = originCoords.x + diagTextXOffset - colDx; ly = originCoords.y + diagTextYOffset - colDy; break;
						case 2: lx = originCoords.x + diagTextXOffset + colDx; ly = originCoords.y + diagTextYOffset - colDy; break;
						default: lx = originCoords.x + diagTextXOffset + colDx; ly = originCoords.y + diagTextYOffset + colDy; break;
					}
				} else {
					const axisAdvance = (col * diagTextXSpacing) + (charIdx * diagTextBias);
							switch (rotation) {
						case 0: lx = originCoords.x + diagTextXOffset - axisAdvance; ly = originCoords.y + diagTextYOffset; break;
										case 1: lx = originCoords.x + diagTextXOffset; ly = originCoords.y + diagTextYOffset - axisAdvance; break;
										case 2: lx = originCoords.x + diagTextXOffset + axisAdvance; ly = originCoords.y + diagTextYOffset; break;
										default: lx = originCoords.x + diagTextXOffset; ly = originCoords.y + diagTextYOffset + axisAdvance; break;
							}
						}
						// Shift whole word UP, then subtract charIdx to stack downwards, and build char upwards
						lz = baseZ + diagTextZOffset + wordVerticalShift - (charIdx * charZStep) + ((CHAR_HEIGHT - 1 - row) * diagTextZSpacing);
					}
					
					const createdEntity = map.createEntity("litter", { x: lx, y: ly, z: lz });
					if (createdEntity && createdEntity.id !== null) {
						(<Litter>createdEntity).litterType = litterType;
						lastPlacedLitterIds.push(createdEntity.id); 
					}
				}
			}
		}
	}
}

// --- TAB 5 FUNCTIONS (IMAGE PRINTER) ---
function onImgPrintPlace(): void {
	if (!imgPrintString) {
		ui.showError("Error", "Please paste an image string first.");
		return;
	}
	const window = ui.getWindow(windowId);
	if (!window) return;
	
	const placeButton = window.findWidget<ButtonWidget>(imgPrintPlaceButton);
	if (placeButton.isPressed !== false) {
		placeButton.isPressed = false;
		ui.tool?.cancel();
	} else {
		placeButton.isPressed = true;
		ui.activateTool({
			id: toolImagePrinter, cursor: "cross_hair", filter: ["terrain"],
			onDown: e => {
				if (e.mapCoords !== undefined) {
					const surfaceElements = getTileElements("surface", e.mapCoords);
					const baseZ = surfaceElements[0].element.baseZ;
					placeImageFromRLE(e.mapCoords, baseZ, imgPrintString);
					ui.getWindow(windowId).findWidget<ButtonWidget>(imgPrintPlaceButton).isPressed = false;
					ui.tool?.cancel();
				}
			}
		});
	}
}

function placeImageFromRLE(originCoords: CoordsXY, baseZ: number, rleString: string): void {
	const parts = rleString.split(':');
	if (parts.length !== 2) {
		ui.showError("Error", "Invalid image string format.");
		return;
	}

	const imgWidth = parseInt(parts[0], 10);
	const imgData = parts[1];
	const rotation = ui.mainViewport.rotation;
	lastPlacedLitterIds = []; 

	// PRE-CALCULATE HEIGHT: Sum all pixels to figure out how tall the image is
	let totalPixels = 0;
	const tempRegex = /(\d*)([A-LX])/g;
	let tempMatch;
	while ((tempMatch = tempRegex.exec(imgData)) !== null) {
		totalPixels += tempMatch[1] ? parseInt(tempMatch[1], 10) : 1;
	}
	const imgHeight = Math.ceil(totalPixels / imgWidth);
	
	// If drawing a vertical wall, shift the whole thing up so the bottom hits the ground
	const verticalShift = (imgPrintPlane > 0) ? ((imgHeight - 1) * imgPrintScale) : 0;

	let pixelIndex = 0;
	const regex = /(\d*)([A-LX])/g;
	let match;

	while ((match = regex.exec(imgData)) !== null) {
		const count = match[1] ? parseInt(match[1], 10) : 1;
		const char = match[2];

		if (char !== 'X') {
			const litterType = getLitterTypeFromChar(char);
			for (let i = 0; i < count; i++) {
				const currentPos = pixelIndex + i;
				
				const gridX = currentPos % imgWidth;
				const gridY = Math.floor(currentPos / imgWidth);

				const ox = originCoords.x + imgPrintXOffset;
				const oy = originCoords.y + imgPrintYOffset;
				const oz = baseZ + imgPrintZOffset;

				const dx = gridX * imgPrintScale;
				const dy = gridY * imgPrintScale;

				let lx: number = 0, ly: number = 0, lz: number = 0;

				if (imgPrintPlane === 0) { 
					// FLOOR (Lays flat on XY plane)
					lz = oz;
					switch (rotation) {
						case 0: lx = ox - dx; ly = oy + dy; break;
						case 1: lx = ox - dy; ly = oy - dx; break;
						case 2: lx = ox + dx; ly = oy - dy; break;
						case 3: lx = ox + dy; ly = oy + dx; break;
					}
				} else if (imgPrintPlane === 1) {
					// ORTHOG (Vertical wall, aligned to map grid)
					lz = oz + verticalShift - dy; // Builds upward from baseZ!
					switch (rotation) {
					case 0: lx = ox - dx; ly = oy; break;
					case 1: lx = ox; ly = oy - dx; break;
					case 2: lx = ox + dx; ly = oy; break;
					case 3: lx = ox; ly = oy + dx; break;
					}
				} else if (imgPrintPlane === 2) {
					// DIAG (Vertical wall, square to isometric screen)
					lz = oz + verticalShift - dy; // Builds upward from baseZ!
					switch (rotation) {
						case 0: lx = ox - dx; ly = oy + dx; break;
						case 1: lx = ox - dx; ly = oy - dx; break;
						case 2: lx = ox + dx; ly = oy - dx; break;
						case 3: lx = ox + dx; ly = oy + dx; break;
					}
				}

				const createdEntity = map.createEntity("litter", { x: lx, y: ly, z: lz });
				if (createdEntity && createdEntity.id !== null) {
					(<Litter>createdEntity).litterType = litterType;
					lastPlacedLitterIds.push(createdEntity.id);
				}
			}
		}
		pixelIndex += count;
	}
}

function getLitterTypeFromChar(char: string): LitterType {
	switch (char) {
		case 'A': return "vomit"; case 'B': return "vomit_alt";
		case 'C': return "empty_can"; case 'D': return "rubbish";
		case 'E': return "burger_box"; case 'F': return "empty_cup";
		case 'G': return "empty_box"; case 'H': return "empty_bottle";
		case 'I': return "empty_bowl_red"; case 'J': return "empty_drink_carton";
		case 'K': return "empty_juice_cup"; case 'L': return "empty_bowl_blue";
		default: return "vomit";
	}
}

// --- GLOBAL UNDO ---
function undoLastPlacement(): void {
	if (lastPlacedLitterIds.length === 0) {
		ui.showError("Undo", "Nothing to undo!");
		return;
	}
	//let removedCount = 0;
	for (let i = 0; i < lastPlacedLitterIds.length; i++) {
		const entity = map.getEntity(lastPlacedLitterIds[i]);
		if (entity && entity.type === "litter") {
			entity.remove();
			//removedCount++;
		}
	}
	lastPlacedLitterIds = []; 
}
