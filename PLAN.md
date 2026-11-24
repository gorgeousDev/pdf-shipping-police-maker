# Shipping Label Copy & Editor

## Objective

Use `reference/avalon-jt.pdf` as the immutable source of truth. The browser app has two export behaviors:

- With no replacements selected, download the original PDF bytes unchanged.
- With replacements selected, preserve the original PDF page size and draw the selected masks and replacements into a full-page Canvas composite.

The original PDF is a single-page, fully raster label. Do not redraw fixed artwork or alter either barcode except to regenerate its verified payload when the label ID is selected.

## Scope

- Replace visible order, COD, service/route, recipient, sender, and remarks text through explicit per-field controls.
- Keep fixed labels, rules, footer, and all unselected content unchanged.
- Allow the source label ID to be replaced and regenerate both Code 128 barcodes with the same payload.
- Preview at the source raster dimensions and preserve the source PDF page size.
- Handle Arabic replacement text with explicit RTL canvas direction and the source's left alignment.
- Keep replacement state centralized in one data model.

## Out of scope

- Changing source artwork, page geometry, or fixed labels.
- Frameworks, backends, saved shipment data, provider integrations, or bulk labels.

## Source measurements

- One portrait page; MediaBox 215 × 369 pt (75.8472 × 130.175 mm).
- One 895 × 1537 RGB, 8-bit image XObject fills the complete page.
- PDF page content contains only the image placement; there are no native text objects or recoverable font names.
- Reference PDF SHA-256: `f5c6c1afa1ebb6032d5083e90a8770578c40c88a4d70e5f337fc89fbe167c8d7`.
- Direct pixel measurements and unresolved items are recorded in [reference-analysis.md](./docs/reference-analysis.md) and [field_map.md](./docs/field_map.md).

## Rendering and export design

- The preview background is a fresh, lossless extraction of the source image.
- Unedited export uses the fetched reference PDF bytes directly; it does not render or regenerate the page.
- Edited export loads the original PDF with pdf-lib and adds a full-page PNG rendered from the same Canvas as the preview. This keeps preview and export masks/text aligned.
- A field remains untouched until its “Replace” checkbox is selected. A selected blank value clears that field; the label ID must contain 1–15 uppercase alphanumeric characters.
- Selecting the label ID replaces its printed text and both Code 128 barcodes. The top code uses Set A; the side code uses Set B with numeric compression.
- White mask bounds and replacement text layout bounds are separate. Replacement text may use the available line area, shrinks toward a documented minimum size, then clips at its layout box. Remarks wrap and clip at the blank remarks region. Fixed elements never move.

## Acceptance criteria

1. Initial preview pixels match the extracted source raster at 895 × 1537.
2. No replacements selected: exported bytes have the same SHA-256 as the source PDF.
3. Edited export remains one page at 215 × 369 pt and retains original page artwork.
4. Differences in the preview are limited to selected cover boxes or the blank remarks region.
5. Each replacement uses its measured source coordinates; adjacent static text and separators are unchanged. Barcodes change only when the label ID is selected.
6. Arabic replacement text renders with RTL direction and shaping while aligning to the measured left edge; font differences are documented.
7. Oversized values follow the clipping/wrapping rules above.
8. Both generated barcodes decode to the entered ID using the verified Code 128 symbology and their original code-set strategies.

## Current status

The source barcode payloads and symbologies are decoded, and the editor updates both barcodes when the label ID changes. Browser comparisons, PDF dimensions, generated barcode decoding, and Arabic alignment have passed. The source font is unknown, and the reference visibly contains three sender Arabic address lines.
