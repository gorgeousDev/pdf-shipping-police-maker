# S&A Receipt Reference Analysis

## Inspection method

Inspected `reference/s-and-a-reference.pdf` as a PDF and as its embedded image. Read the page and image objects, decoded the PDF image placement matrix, extracted the embedded JPEG locally for visual inspection, and measured dark-ink row and column bands in the raster. The temporary inspection copy is not part of the deliverable.

## Verified document properties

| Property | Result |
|---|---|
| PDF version | 1.7 |
| Page count | 1 |
| MediaBox | `[0 0 595 842]` pt |
| Physical page size | Approximately 209.90 × 296.69 mm; preserve these exact PDF dimensions |
| Orientation | Portrait |
| Embedded page artwork | One centered, edge-to-edge-in-height image |
| Embedded image dimensions | 1691 × 3000 px |
| Image format | JPEG, DeviceRGB, 8 bits per component |
| Image placement | `x = 60.19633 pt`, `y = 0 pt`, `width = 474.60733 pt`, `height = 842 pt` |
| Native page text/font objects | None |
| PDF title | `سمير و علي` (decoded from UTF-16BE metadata) |
| PDF author | CamScanner |
| PDF producer | `intsig.com pdf producer` |
| Creation date | Not present |
| Modification date | Empty |
| Source SHA-256 | `c3cfe796e6f8d59eb6e42131d09573267cef873208858e2020e30910e5ce82bc` |
| Extracted JPEG SHA-256 | `47077e72b6a385b7d1da03034c737979ad2caf6490f74e3b238e8422c7dae99f` |

The page is A4-like but its PDF MediaBox is integer-sized rather than the previous invoice's 595.28 × 841.89 pt. The scan is narrower than the page and is vertically scaled to the full page height, leaving approximately 60.20 pt of white page margin on each side. Do not stretch it to fill the page width.

The scan has a large blank upper area: visible dark content begins at approximately raster `y = 430` of 3000 px. The printed receipt itself has soft scan edges, uneven/off-white paper, faint shadowing, and small marks. These are source-image properties, not elements to redraw or recolor.

## Visible-element inventory

### Receipt header

- Arabic business greeting/name across the upper-right area.
- A QR code at the upper-left of the printed receipt.
- Date and time; the scan visibly reads `2026-11-16` and `09:14 PM`.
- Receipt/bon number; a visual reading is `GMDZ1-000000001061`, but the exact run of zeroes needs confirmation from the owner/source system.
- Cashier name in Arabic.
- Register/till identifier, visually `Glem001`.
- Customer code, visually `6159`.
- Transaction type and customer name/identifier. The Arabic/Latin text appears to include “كول سنتر” and `19891`; the exact label/value split needs confirmation.

### Item table

The table has four visible columns, right-to-left: item name, quantity, unit price, and total. There are three item rows. The visible names appear to be a water bottle, a CASIO calculator, and a delivery service, but these transcriptions are not authoritative; use the scan as the source for any initial defaults.

Visible numeric values by row, in left-to-right order (total, unit price, quantity):

| Row | Printed total | Printed unit price | Printed quantity | Source consistency |
|---|---:|---:|---:|---|
| 1 | 916.67 | 916.67 | 1.00 | Consistent at displayed precision |
| 2 | 1201.75 | 201.75 | 1.00 | Printed price × quantity does not equal printed total |
| 3 | 52.69 | 0.88 | 60.00 | Printed price × quantity does not equal printed total |

### Totals, payment, and footer

- Total sales: `2171.11`, equal to the sum of the three printed line totals.
- Total discount: `0.00`.
- VAT: `14%`, displayed tax amount `303.96`.
- Net/payable amount: `2475.06`.
- Paid amount: `2475.06`.
- Return/exchange line: `0.00`, with a printed 30-day return/exchange statement.
- Fixed footer includes the online-store URL, contact/registration details, and Arabic sales/return text.

The printed summary also has a one-piaster arithmetic discrepancy: `2171.11 + 303.96 = 2475.07`, while the printed net and payment are `2475.06`. The scan does not establish whether source values were truncated, calculated at hidden precision, or entered independently. Do not choose a calculation/rounding rule until the owner confirms the intended behavior.

### QR code, typography, and rendering limitations

- One QR code is visible at approximately `[88, 430, 316, 800]` px in the embedded image coordinate system. It was identified visually; the browser does not support `BarcodeDetector` here and no local `zbarimg` decoder is installed, so its payload, symbology details beyond QR appearance, and relationship to receipt fields remain unverified.
- Keep the QR and all other fixed artwork unchanged unless its payload can be decoded and the owner approves a regeneration rule. If transaction fields change while the QR is retained, it may no longer correspond to those values.
- All visible text is rasterized into the JPEG. The PDF has no native text operators or font resources, so the exact Arabic/Latin typeface cannot be identified.
- Edited Arabic values can be shaped and drawn with Canvas text direction, but exact glyph appearance cannot be promised. Compare Arabic shaping and alignment in the browser/PDF before release.
- Rectangular replacement masks may be visible against the scan's off-white, shadowed paper. Measure each value's mask separately, sample its local background, and keep edits out of fixed labels, rules, the QR code, and neighboring columns.

## Source-reading confidence

High confidence: page count, MediaBox, image size/placement, the table structure, printed totals, tax rate, date, and time.

Medium confidence: register/customer identifiers and the three item names, due to scan blur and Arabic text.

Low confidence/unresolved: exact receipt-number zero count, the transaction/customer label split, the second and third row price/total relationships, the source calculation/rounding rule, and QR payload. These must not be silently normalized.
