# Fresh Rebuild Implementation Plan

## Chosen behavior

Keep the reference PDF as the source of truth:

1. If no replacement is selected, download the exact reference PDF bytes.
2. If replacements are selected, draw their measured white masks first, then render the replacements onto one full-page Canvas. Embed that Canvas in the original PDF page at its existing dimensions so preview and export use the same composition.

The preview raster is extracted directly from the source PDF, not from the retired application.

## Application structure

- `index.html` — editor and preview shell, plus the pinned pdf-lib script.
- `src/app.js` — centralized replacement state, measured fields, Canvas preview, and PDF export.
- `src/barcode.js` — Code 128 encoders for the two verified source code-set strategies.
- `src/styles.css` — responsive editor and preview layout.
- `assets/reference-raster.png` — source image at native 895 × 1537 resolution.
- `reference/avalon-jt.pdf` — immutable master for exact exports.

## Edited-field behavior

- Ordinary fields begin unchecked and empty. The label-ID and footer timestamp fields default to their source-visible values.
- Selecting “Replace” activates a field; an empty ordinary field clears its original text.
- Text mask bounds and replacement layout boxes are separate. All masks are drawn before replacement content to avoid clipping text with a neighboring mask.
- The label ID accepts 1–15 uppercase alphanumeric characters and updates the human-readable ID and both Code 128 barcodes. The top code uses Set A; the side code uses Set B with Code C numeric compression.
- The footer timestamp is editable independently of the fixed phone number/icon.
- Arabic controls are RTL with Arabic language metadata. Canvas drawing sets RTL direction and physical left alignment.
- Remarks wrap in their blank region and clip at its lower boundary.
- The source font is unknown; edited text uses a browser sans-serif fallback and may not exactly match the raster typeface.

## PDF approach

The unedited route downloads the original bytes directly. For an edited route, pdf-lib 1.17.1 loads the original page and places the full-page Canvas composite over it at 215 × 369 pt. This retains the reference page size and avoids separate overlay/vector coordinate scaling.

## Focused verification

- Compare the initial Canvas pixel-for-pixel with the source raster.
- Compare unedited-export SHA-256 with the source PDF checksum.
- Check edited export page count and MediaBox.
- Compare edited Canvas pixels with the source and verify differences stay within selected fields.
- Decode both generated Code 128 values and verify checksums.
- Inspect Arabic shaping, left alignment, and text bounds in the browser preview.
