# Additional Tax Invoice — Implementation Plan

## Scope

Add a separate document mode backed by `reference/tax-invoice-ref.pdf`. The user can edit invoice data while the page layout and fixed artwork remain unchanged. Preserve the existing Shipping label, current Tax invoice, and S&A receipt behavior.

## Proposed phases

1. **Reference verification:** map exact per-field text bounds and masks from the PDF text layer and 288 dpi render. Confirm exact Arabic transcription, coordinates, colors, baselines, directions, and overflow rules. Verify the encrypted PDF can be loaded and edited by the existing browser PDF library without changing the original-byte no-edit export.
2. **Data and controls:** add an isolated invoice data model and controls for every variable value in the field map. Keep all values independent; do not infer formulas. Preserve Arabic input direction and numeric formatting.
3. **Preview:** render the full-resolution reference as fixed background and overlay replacements only in measured masks. Keep table row heights, QR, watermark, rules, labels, and legal text fixed.
4. **Export:** unchanged mode downloads original bytes. Edited mode overlays only selected fields on the original page, preserving page size and vector artwork. If the encrypted input cannot be safely edited with the available library, stop and present the alternate strategy before changing the rendering/export design.
5. **Targeted verification:** compare initial preview against the source render; export unchanged and confirm identical SHA-256; export edited fields and check one 596 × 842 pt page; render output and compare changed pixels against approved masks; exercise Arabic, maximum-length values, and clipped/wrapped descriptions; confirm QR pixels and all fixed regions remain identical.

## Acceptance criteria

1. New mode is separate and does not change the currently selected Shipping label or existing Tax invoice behavior.
2. No-edit preview matches the 596 × 842 pt source at the chosen raster scale; no-edit export is byte-identical to the source.
3. Every variable invoice value in the field map is editable in one centralized data model.
4. Edited output remains exactly one page at 596 × 842 pt; original vector artwork and QR are preserved.
5. Visual differences are limited to mapped field masks; fixed labels, panel geometry, rules, watermark, and legal notice do not move or change.
6. Arabic shaping, direction, and alignment are checked against the source. Font discrepancies are documented.
7. Long values follow measured shrink/wrap/clip rules without moving other content.
8. The QR remains unchanged and the UI/report clearly states its payload is not updated or verified.
9. No calculations are introduced unless their rules are established and explicitly added to scope.

## Implementation and verification result

The user approved this plan. The document mode and field controls are implemented in `src/tax-invoice.js` and `src/app.js`; the preview uses a 288 dpi Poppler raster as the reference background, while edited PDF output keeps the original page and overlays a transparent image containing only changed field regions.

Browser checks confirmed Arabic editing, long-name clipping, successful edited export, successful reopen of that output, and one-page 596 × 842 pt geometry. The export path also checks pixel alpha across the full overlay canvas and fails if any non-transparent pixel falls outside an edited field's mask. The unchanged path reports the original PDF export. The Shipping label selection and controls remained available after switching modes.

The encrypted source and saved output both require pdf-lib's `ignoreEncryption: true` load option. The source PDF remains the no-edit export. The QR payload is undecoded and the QR stays fixed, so it may be inconsistent with changed invoice identifiers. The edited download was not separately rendered through Poppler in this browser session; the preview was inspected and the output overlay was checked pixel-by-pixel against the approved masks.
