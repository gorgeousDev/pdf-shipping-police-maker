# S&A Receipt — HTML Rebuild Implementation and Verification Report

## Implemented

- Replaced the Canvas/PDF-Lib receipt renderers with semantic HTML for the receipt page, header, item table, totals, payment section, and footer. The complete scan is not used as output artwork.
- Kept receipt values in the S&A data model. Defaults map the e-invoice seller, Cairo-local issue date/time, internal number, buyer name, item descriptions, quantities, and unit prices. Receipt-only customer code, cashier, and till fields remain blank.
- Preserved two-decimal receipt formatting and the approved 14% VAT calculation. Current initial totals are line totals `3000.00`, `180263.10`, and `52.69`; sales `183315.79`; discount `0.00`; VAT `25664.21`; net/paid `208980.00`.
- Set the S&A receipt font stack to Helvetica, Arial, sans-serif. Helvetica is not installed in the current Windows Fonts directory, so this machine uses Arial; the reference is raster-only and its original typeface cannot be identified.
- Aligned the table to the reference's RTL visual order: item description, quantity, unit price, then line total from right to left. Header labels and column headings use regular weight; payment and return rules are dashed, and the footer separator remains solid.
- Kept the QR as a standalone inline SVG trace. The source scan is used only to extract its pattern; the output PDF contains no raster image XObjects.
- Export uses browser print-to-PDF with `@page` set to `595pt 842pt` and zero margins. The export path prints the HTML DOM, not a screenshot.
- Descriptions wrap at a fixed font size within a fixed table body. Layout validation blocks export if rows exceed that body; summary, payment, and footer positions do not shift when receipt values are edited.

## Verification performed

- The browser preview loaded the mapped e-invoice data, left the three unmapped fields blank, and reported no baseline layout errors.
- The fixed 280 px source-coordinate table body is measured after rendering. A 160-character description triggers the table-overflow message and disables export; restoring the original value clears the error without changing the saved invoice data. The body-height threshold should be rechecked in the browser after the full-page reference coordinates are applied.
- Generated a PDF using headless Chrome's print-to-PDF protocol. It contains one page, has a measured MediaBox of `[0 0 594.95996 841.91998]` pt, and contains no `/Image` XObjects.
- The PDF reports `ArialMT` and `Arial-BoldMT` font resources: the stylesheet prefers Helvetica, but Helvetica is absent from this Windows machine and Arial is the configured fallback.
- The current-output screenshot is treated as data/diagnostic input only. Layout coordinates follow the full-page image in the reference folder, including its blank upper margin; the original 595 × 842 pt page geometry is retained.
- The RTL table order, heading weights, dashed payment/return rules, and solid footer separator remain intact. Row heights may expand for wrapped item descriptions, but the table boundary, summary, payment, and footer anchors remain fixed; export is blocked if the rows exceed the measured table area.
- `node --check src/sa-receipt.js`, `node --check src/app.js`, and `git diff --check` passed.

## Remaining limitations

- Chromium's measured output is 0.04004 pt narrower and 0.08002 pt shorter than the reference's exact 595 × 842 pt MediaBox, despite the matching CSS `@page` size. This is a small, measurable browser print-rounding difference.
- The comparison confirms layout styling, not pixel-identical output. The reference is a scan and its exact fonts are unknown; long invoice descriptions differ from the shorter reference items and therefore wrap onto additional lines.
- The reference contains no font resources. Helvetica is requested first, but the current Windows environment falls back to Arial; glyph shapes and weights remain approximate.
- The QR payload and machine-readability are unverified. Its traced pattern is independent of the editable e-invoice data.

See the [digital rebuild plan](./s-and-a-digital-rebuild-plan.md), [reference analysis](./s-and-a-reference-analysis.md), and [coordinate map](./s-and-a-field-map.md).
