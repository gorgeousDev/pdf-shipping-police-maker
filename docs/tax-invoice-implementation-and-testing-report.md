# Electronic Tax Invoice — Implementation and Testing Report

## Implemented

- Added a separate Electronic tax invoice mode with a centralized data model for header, seller, references, buyer, three item rows, totals, and footer values.
- Kept fixed labels, page art, legal footer, and QR from the reference raster. The complete table region is rebuilt as an HTML table, including its headers, item data, and totals; the CSS watermark sits behind table content. Cell borders are restored, with the right edge aligned to the gray header's measured end and summary's blank cells remaining borderless. Default line sales amounts are calculated from quantity × unit price; the sales total, 14% VAT, and grand total are derived. Controls remain independently editable after initialization.
- Added a 2384 × 3368 px (4 px/pt) reference preview from a 288 dpi Poppler render.
- Exports capture a scaled clone of the composed preview at 2384 × 3368 px, then embed that PNG in a fresh PDF at the exact 596 × 842 pt page size. The existing preview canvases are copied into the clone, and HTML/CSS layers are captured at their final page size.
- Added output checks for one page, exact 596 × 842 pt page size, and non-transparent overlay pixels outside active field masks.
- Added explicit UI text that the QR payload is unverified and the code will not change with edited values.
- Numeric-only amount fields shape typed Western digits as Arabic-Indic digits at render time. Mixed text, dates, quantities with units, IDs, and codes keep typed digits.
- HTML table headers and values use the reference DejaVu Sans face at a fixed 4.8 pt-equivalent size; headers are bold and right-aligned, long values clip within their fixed cells, and item descriptions retain their measured line breaks. Seller/buyer/footer text fields use measured source boxes and configured size limits.
- Currency units in table headers and totals are isolated with RTL direction so their parentheses keep the correct order in the PDF capture.
- Submission and issue timestamps apply LRI/PDI isolates at render time so the visual order matches the reference's time-then-date layout.
- The reference artwork outside the table and QR are retained; the table raster and watermark are cleared and replaced by the HTML table and CSS text.

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

## Styling-only comparison update — 2026-11-25

- Compared the provided result PDF with the reference raster and confirmed the invoice values were already present in the editor's data model. No invoice data or calculations were changed in this styling update.
- The result's editable text used platform fallback fonts. The renderer now loads the DejaVu Sans regular and bold files (version 2.37, with its license in `assets/DEJAVU-FONTS-LICENSE.txt`) and applies measured field font sizes and horizontal scaling.
- The first styling export preserved the reference's original table watermark. The borderless-table update below later removes it completely because editable field masks had made it partial.
- The corrected export, `output/pdf/tax-invoice-styled.pdf`, was reopened with pdf-lib and verified as one page at 596 × 842 pt. The PDF viewer also showed page 1 of 1. Its source page image remains 2384 × 3368 px.
- Browser overlay validation passed: no non-transparent overlay pixels occurred outside the measured editable masks. Preview measurements versus source-mask measurements include seller name 167 × 20 vs. 167 × 20 px, buyer name 295 × 20 vs. 294 × 20 px, seller address 628 × 20 vs. 649 × 20 px, electronic invoice ID 366 × 15 vs. 356 × 14 px, item code 182 × 14 vs. 184 × 14 px, and seller signature 119 × 20 vs. 119 × 20 px.
- Remaining visual differences are small but measurable for a few fields; the embedded font's exact build was not independently recovered, and the exported PDF remains rasterized.

## Borderless-table update — 2026-11-25

- Removed all measured table gridlines from the preview and export, including item-column dividers, row separators, summary rules, and the left outer edge. The gray header fill is retained as a continuous, borderless band.
- The source watermark was interrupted by editable field masks and removed at this stage; it was later restored as clean text in the watermark correction below.
- Browser pixel scan: all 9 horizontal rule rows and all 6 vertical rule columns contain zero non-white pixels; the header separators and bottom edge match the header fill RGB `(196, 196, 196)`.
- Browser preview was visually inspected after the update. The exported PDF was reopened with pdf-lib and verified as one page at 596 × 842 pt (142,558 bytes).

## Footer text overlap correction — 2026-11-25

- Kept both footer values unchanged. Tightened the internal-number cover before its colon, and expanded the signature cover to clear the duplicate underlying `اس` while preserving the original full signature text and fixed labels.
- Visually checked both footer lines in the browser preview: the internal number and colon/label match the reference, and `اس اند ايه للتجاره` appears once. Re-exported and verified one 596 × 842 pt page.

## Watermark correction — 2026-11-26

- The watermark is a positioned HTML word styled with CSS in the reference DejaVu Sans face and light gray. The original watermark is cleared from the base image; editable field backgrounds render below the CSS word, and transparent editable text renders above it.
- PDF export captures the styled invoice preview so the CSS watermark and foreground text are included; the existing PDF page size and raster output are retained.
- The entire raster table region is cleared and rebuilt as an HTML table, including headers, item data, and totals. CSS borders are restored on table cells; the right edge aligns with the measured gray fill end. Summary blank cells remain unbordered. No invoice data was edited.
- Browser preview was inspected at port 5500 after restoring table borders. No PDF was exported or verified after this update, and automated tests were not run.
- Added thin gray CSS outlines around the reference block and buyer heading to match the supplied marked-up example.

## Export border adjustment — 2026-11-26

- Kept preview borders at `0.25px` and draw export borders as `0.15pt` PDF vector strokes in the same `#595959` color. Rasterized HTML borders are hidden during export to avoid device-pixel snapping.
- Browser measurements confirmed the CSS-only export width adjustment did not visibly reduce the rendered borders. The full export path then generated and validated a one-page 596 × 842 pt PDF in memory, with the download suppressed; its updated vector strokes were not visually rasterized.
