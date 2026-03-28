# OpenRCT2 Litter Editor

A specialized tool for OpenRCT2 that allows you to place, manipulate, and generate complex patterns using litter (vomit and trash). Move beyond simple cleanup and use litter as a creative medium for track detailing, custom signage, and image reproduction.

## Features

### 1. Manual Litter Manipulation
*   **Precision Placement**: Place specific types of litter (vomit or trash) exactly where you want them.
*   **Coordinate Control**: Manually adjust the X, Y, and Z (height) coordinates of existing litter elements.
*   **Pipette Tool**: Quickly select existing litter on the map to view and edit its properties.
*   **Multiplier Settings**: Toggle between x1, x10, and x100 increments for rapid coordinate adjustments.

### 2. Track Distributor
*   **Ride Integration**: Select any ride in your park and distribute litter along its track layout. It distributes litter by 32 unit increments, so it is consistent across any length of track piece.
*   **Custom Density**: Control the number of litter items generated along the track.
*   **Vertical Offsets**: Set height offsets to position litter above or below the track surface for unique effects.

### 3. Diagonal Text Tool
*   **Custom Signage**: "Print" text strings onto the map using litter as pixels.
*   **Typography Controls**: Adjust kerning (character spacing) and relative spacing across X, Y, and Z axes.
*   **Alignment and Bias**: Fine-tune the positioning and slant of the generated text.
*   **Undo Support**: Quickly remove the last generated text string if it needs adjustment.

### 4. Image Printer
*   **Pixel Art Generation**: Convert image data into litter-based patterns.
*   **Web Integration**: Use the companion web tool to convert your own images into the required format.
*   **Multi-Plane Support**: Print images on different spatial planes to create 3D litter structures.
*   **Undo Support**: Quickly remove the last generated bmp if it needs adjustment.

## Image Conversion Web Tool

To use the Image Printer feature, you must first convert your images using the BMP webtool:

**Address**: [https://thertyrct.github.io/litterEditor/](https://thertyrct.github.io/litterEditor/)

## Shortcut Defaults

The following keyboard shortcuts are configured by default. These can be customized in the OpenRCT2 Options menu under the "Shortcut Keys" tab.

*   **Open Litter Editor**: CTRL+SHIFT+L
*   **Select Litter**: CTRL+SHIFT+P (Activates pipette tool)
*   **Delete Litter**: CTRL+SHIFT+D (Activates deletion tool)
*   **Toggle Multiplier**: CTRL+SHIFT+M (Cycles x1, x10, x100)
*   **Place Litter**: CTRL+SHIFT+B (Activates placement tool)
*   **Cycle Litter Type**: CTRL+SHIFT+C (Cycles between vomit and trash)


Follow the instructions on the webtool to generate the data string required by the in-game Image Printer tab.
