# Tax Invoice Reference Analysis

## Source

- File: `reference/tax-invoice-ref.pdf`
- SHA-256: `17fcfaa79b37a2133b3ab1a3fb8642b0a07a0a6f5ad2c71bb4994c1db3be272d`
- Metadata title: `5PBDBSDW3WYDC86WDB3W3N7M10_I`
- Creator / producer: IronPdf 2020.6.0.0
- One portrait page, MediaBox 596 × 842 pt (A4-sized, slightly wider than 595.28 pt); rotation 0.
- PDF 1.4, 62,818 bytes. Permission flags report printing allowed and copying, changes, and annotations disallowed; the file is RC4 encrypted with no form fields. The empty-password read/render path worked with Poppler. Browser PDF-library editing has not been verified.
- Embedded fonts: DejaVuSans CID TrueType and DejaVuSans-Bold CID TrueType (embedded, Unicode maps present).
- One 375 × 375 RGB image XObject, placed as the QR code. Most text, boxes, rules, and fills are native vector/text content. `pdftotext -layout` extracts the values, though Arabic extraction is visually reordered/fragmented.
- Render inspected at 120 dpi and 288 dpi using Poppler. The high-resolution render is 2384 × 3368 px (4 px/pt).

## Visual inventory

1. Top header: Arabic invoice title, invoice status, submission timestamp, issue timestamp; short QR instruction at upper left.
2. QR image at upper left, aligned with seller details.
3. Seller panel: section bar, seller name, registration number, tax activity code, address, and locality/country.
4. Reference row: electronic invoice identifier, provisional export invoice number, sales order reference, and purchase order reference.
5. Buyer panel: section bar, name, registration number, address, and locality/country.
6. Three-row items table: item name/category, item code, description, unit/quantity, unit price, and sales amount. The first description spans several lines. A light gray diagonal watermark crosses the table.
7. Five summary values: sales total, discount total, item discount total, VAT, additional invoice discount, and grand total (six displayed amount rows including total).
8. Footer: internal number, file creation date, seller signature/name, and fixed ETA legal text.

## Coordinate map (page points, origin at top-left)

Text bounds below come from Poppler's `pdftotext -bbox-layout` output (PDF points); Arabic extraction orders glyphs oddly, but the geometric bounds are usable. These are source text bounds, not yet padded cover/text-layout boxes. Page size is 596 × 842 pt.

| Region | Approximate bounds (x0, y0, x1, y1) pt | Editable content candidates |
|---|---:|---|
| Header title | (481.0, 18.0, 515.5, 30.6) | Fixed label |
| Header status | (482.8, 35.0, 515.9, 41.3) | Arabic status value editable; fixed label |
| Submission date/time | (345.9, 48.2, 515.9, 54.5) | Separate label and date/time text within one line |
| Issue date/time | (325.6, 61.5, 516.0, 67.7) | Separate label and date/time text within one line |
| QR image | Approximately (82, 102, 161, 181) | Keep fixed; 375 × 375 source image, payload not decoded |
| Seller name | (449.2, 128.0, 510.6, 133.6) | Arabic value and fixed label share the line |
| Seller registration | (440.8, 138.8, 511.4, 144.4) | Arabic value and fixed label share the line |
| Seller tax activity code | (211.5, 138.8, 253.9, 144.4) | Code value and fixed label share the line |
| Seller code value | (211.5, 149.6, 223.7, 155.2) | `4761` |
| Seller address | (349.6, 160.4, 511.7, 166.0) | Arabic address line |
| Seller locality | (470.2, 171.2, 511.7, 176.8) | Arabic/Latin locality |
| Electronic invoice ID | (380.2, 218.1, 516.1, 223.7) | ID shares line with fixed Arabic label |
| Provisional export invoice number | (191.6, 218.1, 265.0, 223.7) | Label present; no value visually present |
| Purchase order reference | (469.0, 228.9, 515.6, 234.5) | Label present; no value visually present |
| Sales order reference | (213.9, 228.9, 265.0, 234.5) | Label present; no value visually present |
| Buyer name | (425.8, 264.9, 515.6, 270.5) | Arabic value and fixed label share the line |
| Buyer registration | (445.0, 275.7, 515.6, 281.3) | Arabic value and fixed label share the line |
| Buyer address | (432.7, 297.3, 515.7, 302.9) | Arabic address line |
| Buyer locality | (489.4, 308.1, 515.7, 313.7) | Latin locality values |
| Item header | (111.3–515.9, 330.9–347.3) | Six fixed columns; header text remains fixed |
| Item row 1 | Text spans y=364.5–391.7, plus code and values around y=380.7 | Three-line mixed Arabic/Latin description, item code, quantity/unit, unit price, sale amount |
| Item row 2 | Text spans y=414.9–431.3 | Description, item code, quantity/unit, unit price, sale amount |
| Item row 3 | Text spans y=443.7–454.7 | Description, item code, quantity/unit, unit price, sale amount |
| Summary values | x=128.7–158.9; y=472.5, 490.6, 508.6, 526.6, 544.6, 562.6 (each line spans 5.6 pt) | Six independently displayed amount values |
| Internal number | (440.2, 601.6, 516.0, 607.2) | Value plus fixed Arabic label |
| File creation date | (80.1, 628.0, 217.3, 633.6) | Value plus fixed Arabic label and timezone |
| Seller signature | (463.6, 626.8, 515.9, 632.4) | Arabic seller name shares line with fixed label |
| Legal notice | (140.4, 645.9, 454.1, 650.1) | Fixed legal wording |

The table/grid/background zone bounds are visible in the 288 dpi render; exact cell edges and per-value masks should be measured from that render before implementation. Do not cover entire approximate sections. Arabic text may contain split runs and needs explicit RTL rendering/alignment.

## Values observed

- Electronic invoice identifier: `5PBDBSDW3WYDC86WDB3W3N7M10` (also appears in the metadata title with `_I`).
- Seller registration: `731227697#`; tax activity code: `4761`.
- Buyer registration: `783939507#`.
- Three item codes: `EG-731227697-608`, `EG-731227697-104`, `EG-731227697-409`.
- Internal number: `GLETH-000000090`.
- Header issue/submission dates show 17/11/2026; footer file date shows 22/11/2026.
- Six summary amounts are present. Their source values must be transcribed exactly and treated independently unless a calculation rule is explicitly established; no tax formula is inferred here.

## Unresolved details and confidence

- Layout regions, page geometry, font names, page count, and image dimensions are high confidence from PDF metadata, Poppler inspection, and visual rendering.
- The QR payload has not been decoded. Preserve the QR image unchanged and display that edits to adjacent invoice identifiers do not update it. The printed instruction says to scan the QR for more information, so this limitation is visible to invoice recipients.
- Source glyph bounds for visible text values are captured above. Exact safe cover bounds, baselines, and default text transcription for all Arabic fields remain to be mapped from pixel inspection before coding.
- The browser's existing pdf-lib path successfully loaded and edited this source with `ignoreEncryption: true`; the same option was needed when reopening the output. Unchanged export still uses the original source bytes.
- The PDF embeds DejaVu Sans; the browser preview uses the locally available DejaVu Sans family. Arabic input direction was exercised in the browser. The exported file was not separately rendered with Poppler in this verification session.

## Proposed rendering and export

- Preserve original PDF bytes for an unchanged export.
- Use a full-resolution Poppler render for the browser preview background, while keeping the source PDF itself as the edited export base so vector text, rules, and the QR remain sharp.
- Composite only measured editable value masks and replacement text. Keep labels, lines, table geometry, watermark, QR, and legal notice fixed.
- Keep the invoice model in its own module and add a separate document mode so it cannot alter the current shipping label or existing invoice mode.
- The browser PDF library successfully opens the restricted source with `ignoreEncryption: true`; edited export keeps source vector content and adds a transparent, field-only PNG overlay.
- Use embedded DejaVu Sans where extraction permits; verify Arabic shaping and RTL placement against the reference. Document differences if the font cannot be reused reliably.
