# Tax Invoice Field Map

Coordinates below are source text bounds in PDF points with a top-left origin, obtained with Poppler `pdftotext -bbox-layout`. They are not safe cover boxes. Before application code, map each value's padded cover, text box, baseline, alignment, direction, font weight, and overflow rule from the 4 px/pt render. Page geometry is 596 × 842 pt.

| Group | Field candidates | Approximate area (pt) | Rendering notes |
|---|---|---:|---|
| Header | Status; submission date/time; issue date/time | (482.8, 35.0, 515.9, 41.3); (345.9, 48.2, 515.9, 54.5); (325.6, 61.5, 516.0, 67.7) | Arabic labels fixed; timestamps include Arabic/Latin digits and timezone notation |
| Seller | Name; registration number; tax activity code; activity code value; street address; locality | (449.2, 128.0, 510.6, 133.6); (440.8, 138.8, 511.4, 144.4); (211.5, 138.8, 253.9, 144.4); (211.5, 149.6, 223.7, 155.2); (349.6, 160.4, 511.7, 166.0); (470.2, 171.2, 511.7, 176.8) | Preserve dark blue section bar and pale panel background |
| Invoice references | Electronic invoice ID; provisional export invoice no. label; sales order reference label; purchase order reference label | (380.2, 218.1, 516.1, 223.7); (191.6, 218.1, 265.0, 223.7); (213.9, 228.9, 265.0, 234.5); (469.0, 228.9, 515.6, 234.5) | Only electronic ID has a visible value; other rows appear blank. Long ID needs fit/clip rule |
| Buyer | Name; registration; address; locality | (425.8, 264.9, 515.6, 270.5); (445.0, 275.7, 515.6, 281.3); (432.7, 297.3, 515.7, 302.9); (489.4, 308.1, 515.7, 313.7) | Arabic RTL; preserve gray buyer header and punctuation |
| Item row 1 | Category/name; item code; description; unit and quantity; unit price; sales amount | Text columns: category x=490–516; code x=420–467; description x=328–383; quantity/unit x=296–315; unit price x=243–265; sales amount x=136–159; y=364–392 for description and about 381 for other values | Description wraps to the available four baselines; preserve watermark behind text and grid separators |
| Item row 2 | Same six value fields | Same text columns; y=415–431 | One fixed row |
| Item row 3 | Same six value fields | Same text columns; y=444–455 | One fixed row |
| Summary | Sales total; total discount; item discount; VAT; invoice discount; grand total | Value column x=128.7–158.9; y=472.5, 490.6, 508.6, 526.6, 544.6, 562.6 | Keep labels and row dividers fixed; default values are derived from line sales at 14% VAT |
| Footer | Internal number; file creation date; signature/name | (440.2, 601.6, 516.0, 607.2); (80.1, 628.0, 217.3, 633.6); (463.6, 626.8, 515.9, 632.4) | Legal notice remains fixed; dates and signature can be editable |

## Fixed artwork

- Invoice/status labels and Arabic field labels.
- Seller/buyer section bars and backgrounds, page separators, table grid, diagonal watermark, QR image, footer legal text.
- QR payload is unverified. Do not regenerate or alter the QR in this implementation.

## Data model proposal

Keep every value shown in the field groups in one `taxInvoiceData` model. Store numeric-looking values as strings to preserve leading zeros, Arabic digit forms, punctuation, and formatting. The default data is built from the source quantities and unit prices: each line sales amount is quantity × unit price, the sales total is their sum, VAT is 14% of the taxable total, and the grand total includes VAT less discounts. Amounts use Arabic-Indic digits with comma grouping, a decimal comma, and five decimal places. After initialization, the controls remain independently editable, as before.

Timestamp values use LRI/PDI isolates around each Arabic-Indic numeric run at render time, preserving the reference's visual time-then-date order without storing control characters in the editable data.

## Overflow proposal

Item-table values use a fixed 4.8 pt canvas font size, calibrated against the reference's 5.59 pt PDF glyph bounds with rendered comparisons; table values do not shrink to fit and clip within their measured boxes if too long. Item descriptions wrap at word boundaries within their measured box and use the four available baselines; other single-line values and multiline address fields retain the measured box and shrink only to their configured minimum before clipping. Neighboring values, rows, page geometry, and fixed labels never move.

The browser Arabic fallback is wider than the embedded source font. Seller/buyer name, registration, address, locality, reference ID, and footer signature masks were widened into blank panel space, and numeric values are right-aligned, so complete words, `#` signs, and the full reference ID render. Text shrinks within each field's configured min/max size; the substitute font remains an approximation of the embedded source face.
