# Invoice / Shipping Document Choice — Implementation Plan

## User-approved product scope and implemented behavior

- Add a document choice for **Shipping label** or **Tax invoice**.
- Keep **Shipping label** selected by default and preserve every existing label editor, preview, validation, and export behavior.
- In **Tax invoice** mode, allow editing all transaction details while keeping company/store branding, fixed labels, notices, and legal terms unchanged.
- Keep the invoice table at the reference's six rows.
- Use delivered quantity and VAT-inclusive unit price as calculation inputs. Subtract each row's substitution discount from its VAT-inclusive line total, calculate VAT at 14%, and derive invoice totals.
- Update both Code 39 barcodes to the entered invoice number. Source decoding found `88908524` on both pages. Limit the invoice number to 8 Code 39 characters to retain the measured source narrow-module width in the fixed 491 px barcode region.
- With no invoice edits, export the exact source PDF bytes. Edited export may approximate the unknown source font while preserving the original page artwork and geometry.

## Rendering and export

- Extract each 2381 × 3367 embedded JPEG page as a local preview/composition asset. Keep the original PDF bytes as the no-edit export path.
- Preview both pages as full-page canvases using the same replacement layers that edited export embeds over the original PDF pages.
- Preserve each `[0 0 595.28 841.89]` pt page box and the two-page order.
- Cover only independently measured transaction-value boxes. Draw replacements in their measured text-layout boxes; define shrink/clip behavior for long values and RTL Arabic fields before implementation.
- Keep each table row at its source height. Wrap item descriptions to two lines, then shrink to a measured minimum size and clip; do not move or add rows.
- Keep Arabic address and customer values RTL and within their measured boxes. Long values shrink to a documented minimum and then clip; they do not move neighboring content.
- Use existing pdf-lib for edited two-page export; add no framework or external rendering dependency.
- Fetch and retain the invoice PDF and both page assets with explicit load errors rather than a success-shaped fallback.
- Leave the shipping-label no-edit exact-byte export and edited export unchanged.

## Planned application surfaces

- `index.html`: document-mode control, invoice editor controls, and a two-page preview.
- `src/app.js`: centralized invoice data model, mode switching, rendering, validation, derived totals, and mode-specific export.
- `src/barcode.js` or a closely scoped invoice barcode module: Code 39 encoding/validation for both invoice barcodes.
- `src/styles.css`: responsive mode selection, invoice editor controls, and two-page preview layout.
- `assets/`: exact extracted page JPEGs for invoice preview and edited composition.
- Invoice analysis, field map, this plan, and `PLAN.md`: findings, measured edit boxes, and acceptance criteria.

## Calculation proposal

For each fixed row, use:

1. `gross = deliveredQuantity × unitPriceIncludingVat`
2. `net = round((gross - substitutionDiscount) / 1.14, 2)`
3. `vat = round(gross - substitutionDiscount, 2) - net`
4. `lineTotalIncludingVat = net + vat`

Sum the six row totals for the invoice total; sum net and VAT values for the page 2 tax summary. Derive payment amount and English amount-in-words from the grand total. Verify the rounding sequence against the reference before release.

## Acceptance criteria

1. Shipping label remains the default and its current preview/edit/export behavior is unchanged.
2. Invoice mode shows both source pages and all transaction controls; no-edit invoice export is byte-for-byte identical to the source (SHA-256 `21a7b40837a696ff93c4763d75e9e97d645285a207d79768c05b0e4e17e2322e`).
3. Both edited invoice pages remain portrait A4 at `[0 0 595.28 841.89]` pt.
4. The six-row table's calculated amounts use delivered quantity, VAT-inclusive unit prices, discounts, 14% VAT, and documented two-decimal rounding.
5. Both regenerated Code 39 barcodes decode to the entered invoice number; invoice numbers are limited to 8 characters so the measured source module width is retained. When the number is unchanged, source-equivalent barcode geometry is retained.
6. Edited visual differences are limited to measured masks and editable fields; fixed artwork and legal text do not move.
7. Arabic replacement values preserve RTL shaping and measured alignment. Unknown source fonts and any remaining visual differences are documented.
8. Long values follow approved shrink/clip or wrapping rules; no unrelated field moves.
9. Loading failures for either reference or an invoice page asset are presented explicitly and disable the corresponding export.

## Mapping and verification

The source value regions and table columns/row bands are measured in [invoice-field-map.md](./invoice-field-map.md). The implementation uses those individual ink bounds and cell intersections rather than broad masks across fixed labels or separators. Any newly discovered mask or baseline mismatch should be measured and added to the map before changing that field's renderer.

Browser verification confirmed the reference calculations (net EGP 207,048.15, VAT EGP 28,986.75, total EGP 236,034.90), two portrait A4 output pages, generated Code 39 payloads on both pages, and no changed pixels outside the intended field masks. Both unchanged PDF paths were byte-identical to their source files, and an edited shipping-label export remained one page at 215 × 369 pt. The source font is unavailable because all reference content is rasterized; edited invoice text is approximate. Long edited text still needs additional visual review.
