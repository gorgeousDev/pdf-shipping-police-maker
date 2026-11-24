# Electronic Tax Invoice — Implementation and Testing Report

## Implemented

- Added a separate Electronic tax invoice mode with a centralized data model for header, seller, references, buyer, three item rows, totals, and footer values.
- Kept fixed labels, table geometry, page art, legal footer, and QR from the reference raster. Default line sales amounts are calculated from quantity × unit price; the sales total, 14% VAT, and grand total are derived. Controls remain independently editable after initialization.
- Added a 2384 × 3368 px (4 px/pt) reference preview from a 288 dpi Poppler render.
- Exports flatten the reference raster and transparent field overlay into one 2384 × 3368 px page image, then embed it in a fresh PDF at the exact 596 × 842 pt page size. This avoids the source PDF's malformed streams after pdf-lib rewrites it.
- Added output checks for one page, exact 596 × 842 pt page size, and non-transparent overlay pixels outside active field masks.
- Added explicit UI text that the QR payload is unverified and the code will not change with edited values.
- Numeric-only amount fields shape typed Western digits as Arabic-Indic digits at render time. Mixed text, dates, quantities with units, IDs, and codes keep typed digits.
- All item-table values use one fixed 4.8 pt canvas font size, calibrated against the reference's 5.59 pt PDF glyph bounds in a rendered comparison. They no longer shrink independently; long values clip within their fixed boxes, while item descriptions wrap at word boundaries. Seller/buyer/footer text fields shrink within their configured min/max sizes, and their masks were widened into blank panel space because the browser Arabic fallback is wider than the embedded source font.
- Submission and issue timestamps apply LRI/PDI isolates at render time so the visual order matches the reference's time-then-date layout.
- The user requested watermark removal. The preview and all exported PDFs remove the diagonal stamp band, redraw affected table fields from the data model, and restore the table rules so borders remain continuous.

## Checks run

- `pdfinfo`: one portrait page, 596 × 842 pt, no rotation; the source is encrypted and has no AcroForm fields.
- `pdffonts`: embedded DejaVuSans and DejaVuSans-Bold fonts.
- `pdfimages -list`: one embedded 375 × 375 RGB image, used for the QR.
- Poppler rendered the source at 288 dpi to 2384 × 3368 px; the render was visually inspected and copied as the preview background.
- `node --check src/app.js` and `node --check src/tax-invoice.js`: passed.
- Exported invoice reopened and rendered with Poppler: one page, exact 596 × 842 pt, no compression or catalog errors. Final rendered page was visually inspected at 200 dpi.
- Targeted Node assertions: `123,456.78` displays as `١٢٣,٤٥٦.٧٨` in a numeric-only amount field; `12 EA` stays unchanged as mixed content; `EG-120` remains unchanged in an item-code field.
- Browser: new mode and all field controls loaded; corrected header dates, table values, and summary values appeared in the preview; the generated PDF bytes reopened with one 596 × 842 pt page.
- Browser overlay verification scanned every output-canvas pixel and found no non-transparent pixels outside the changed fields' measured masks.
- Measured every single-line field at its minimum font size with the browser's canvas metrics. After widening the seller/buyer/footer masks, no field required more width than its box.
- The Shipping label mode and its original controls remained available after switching back.
- `git diff --check`: passed for tracked files; trailing-whitespace checks passed for the untracked source and documentation files.

## Data-correction verification

- Corrected header submission and issue timestamps, item descriptions, quantities, unit prices, line sales, sales total, 14% VAT, and grand total are present in the exported page image.
- Seller and buyer names, registrations, addresses, localities, reference electronic ID, footer internal number, and footer signature were visually inspected in the exported page image. Complete words and `#` signs are visible after widening the affected masks.
- The exported PDF is one 596 × 842 pt page containing one 2384 × 3368 px page image. Header, seller, buyer, references, footer, item table, and summary crops were inspected.
- Remaining limit: the embedded source face and the browser Arabic fallback do not share identical metrics, so some widened fields render smaller than the source to keep complete text.

## Remaining limits

- QR payload decoding was not available. The source QR is preserved, so edits to values associated with it can make the QR content stale.
- The source PDF uses permission encryption; the reference PDF is loaded with pdf-lib's `ignoreEncryption` option during analysis. Export itself reconstructs a new one-page raster PDF.
- Edited exports are rasterized at 288 dpi to avoid reserializing the permission-protected source PDF. The form remains editable in the browser; PDF text itself is flattened into page artwork.
- Field layouts use source PDF text bounds and the raster analysis. Exact visual measurements may need refinement for unusual fonts or very long content.
