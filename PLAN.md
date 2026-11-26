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

## Invoice option — implemented

The invoice reference is a two-page A4 PDF made from full-page raster images. The approved product scope is a Shipping label / Tax invoice choice, retaining the current label workflow and adding an editable six-row invoice. The invoice model includes transaction details, derived 14% VAT totals based on delivered quantity and VAT-inclusive unit prices, and matching Code 39 barcodes tied to the invoice number. Invoice numbers are limited to 8 Code 39 characters to preserve the source barcode's measured narrow-module width. Unchanged invoices export byte-for-byte; edited pages preserve the source art and page size, with unknown font matching documented.

See [invoice-reference-analysis.md](./docs/invoice-reference-analysis.md), [invoice-field-map.md](./docs/invoice-field-map.md), and [invoice-implementation-plan.md](./docs/invoice-implementation-plan.md) for source measurements, field masks, the approved calculation rules, and implementation details.

The invoice editor and export paths are implemented. Browser verification confirmed the unchanged invoice and shipping PDFs export byte-for-byte, edited invoice output remains two portrait A4 pages, regenerated Code 39 barcodes decode to the entered number, and editable changes remain within the measured field masks. Edited text uses an approximate system font because the reference is fully rasterized.

## S&A receipt option — HTML rebuild implemented

The S&A mode now uses semantic HTML/CSS/JavaScript populated from the electronic tax invoice and browser print-to-PDF. Customer code, cashier, and register/till start blank. The full-page scan is not used in the output; the QR is a standalone SVG trace. Its font stack requests Helvetica, then Arial and sans-serif; this Windows environment has no Helvetica-named font and uses Arial.

Headless Chrome generated a one-page PDF with no raster image XObjects. Its measured MediaBox is 594.95996 × 841.91998 pt, 0.04004 pt narrower and 0.08002 pt shorter than the source's 595 × 842 pt. Layout follows the full-page image in the reference folder and preserves its blank upper margin; the latest output screenshot is used only to confirm current values and diagnose issues. Item descriptions wrap inside fixed columns; export is blocked if row heights exceed the measured table body. Browser/PDF visual verification is still needed after the full-page coordinate mapping. Font matching remains approximate. The QR payload and machine-readability are unverified.

See the [implementation report](./docs/s-and-a-implementation-plan.md), [reference analysis](./docs/s-and-a-reference-analysis.md), and [field map](./docs/s-and-a-field-map.md) for measurements and remaining limitations.

## Additional electronic tax invoice — implemented

The new `reference/tax-invoice-ref.pdf` is a one-page 596 × 842 pt PDF with native vector/text artwork, embedded DejaVu Sans fonts, and a 375 × 375 QR image. The new Electronic tax invoice mode keeps its own data model and controls, renders the 2384 × 3368 source preview, overlays replacements in fixed boxes, and exports a reconstructed one-page PDF. The default line sales amounts are calculated from quantity × unit price; the sales total, 14% VAT, and grand total are derived. Timestamp fields apply LRI/PDI isolates at render time so the visual time-then-date order matches the reference, and item descriptions wrap within their measured boxes. Numeric-only amount fields convert typed Western digits to Arabic-Indic digits; mixed text, dates, quantities with units, IDs, and codes retain their typed digit style. Controls remain independently editable after initialization.

Browser verification confirmed the mode loads and the corrected header dates, table values, and summary values render completely. Seller and buyer names, registrations, addresses, reference ID, and footer signature were checked in the exported page image after widening their masks; all words and `#` signs are present. The exported PDF reopens as one 596 × 842 pt page. Switching back to Shipping label leaves that mode selected and its original controls available. The QR payload remains undecoded and the QR is preserved unchanged, so it may no longer describe edited invoice values.

See [tax invoice reference analysis](./docs/tax-invoice-reference-analysis.md), [tax invoice field map](./docs/tax-invoice-field-map.md), [implementation plan](./docs/tax-invoice-implementation-plan.md), and [implementation and testing report](./docs/tax-invoice-implementation-and-testing-report.md).
