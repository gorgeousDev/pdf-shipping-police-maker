# S&A Receipt — Implementation and Verification Report

## Implemented

- Replaced the scanned-page preview and overlay export with a new digital page composed of vector rules, native PDF text using embedded fonts, and vector rectangles traced from the reference QR's black pixels.
- Kept the source 595 × 842 pt page size and its broad blank upper area, header, table, totals, payment section, and footer hierarchy.
- Kept receipt values in the editable JavaScript data model. Default quantities and exact unit prices initialize the rows; displayed quantities and line totals use two decimals, line totals are rounded from exact values, and the sales total, 14% VAT, net/payable, and paid amount are derived. Controls remain independently editable after initialization.
- Used fixed font-size classes; item descriptions wrap at the fixed size. If the expanded rows would push the footer beyond the page, validation blocks export rather than shrinking text.
- Reflowed the header/table area and widened the numeric columns to fit the invoice-derived values while retaining the reference's one-page structure.
- Used Noto Sans Arabic for Arabic and Liberation Sans for Latin text. The exact source typeface is unknown because the reference is a single raster JPEG.

## Verification performed

- Browser preview rendered the digital layout and reflected edits to receipt fields.
- An intentionally overlong item description produced a layout validation error; restoring the original value cleared the error.
- Exported PDF: one page, MediaBox 595 × 842 pt, verified with `pdfinfo`.
- `pdfimages -list` returned no images, confirming the digital receipt export has no embedded raster scan or raster QR.
- `pdffonts` confirmed embedded Noto Sans Arabic and Liberation Sans faces.
- Rendered the exported PDF at 160 dpi with Poppler and visually compared it with the source scan.
- Corrected export extracted text contains `3000.00`, `180263.10`, `52.69`, `183315.79`, `25664.21`, and `208980.00`. The file remains one 595 × 842 pt page with no raster images.
- `node --check` passed for `src/sa-receipt.js` and `src/app.js`; `git diff --check` passed.

## Known differences and limitations

- The original has no font resources, so the embedded font family is a visual substitute. Font sizes are held fixed by layout class, but glyph shapes and weight cannot be exact matches to the raster original.
- The long invoice-derived item text required a modest header/table reflow and wider numeric columns. Descriptions occupy multiple lines at the reference-sized table text.
- The QR was converted to vector run rectangles from the scanned pixels. No local QR decoder was available, so payload and machine-readability were not verified. The pattern is independent of the editable receipt values.
- The clean digital page does not reproduce scanner shadows, blur, or paper artifacts.

See [digital rebuild plan](./s-and-a-digital-rebuild-plan.md), [reference analysis](./s-and-a-reference-analysis.md), and [coordinate map](./s-and-a-field-map.md).
