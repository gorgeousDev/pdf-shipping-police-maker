# S&A Receipt Coordinate Map

**Source:** `reference/s-and-a-reference.pdf`  
**Image coordinate origin:** top-left of the 1691 × 3000 embedded JPEG; x increases right and y increases down. Upper bounds are exclusive.

The separately supplied full-page comparison image, `reference/s-and-a-reference-1.png`, is 1653 × 2339 px (aspect ratio 0.7067), consistent with the 595 × 842 pt page. It is used read-only for visual alignment; the PDF remains authoritative for page geometry.

## Page and image geometry

| Page | Embedded image bounds (px) | PDF MediaBox (pt) | Image placement (pt) |
|---|---:|---:|---:|
| 1 | `[0, 0, 1691, 3000]` | `[0, 0, 595, 842]` | `[60.19633, 0, 534.80366, 842]` |

The image is centered horizontally and fills the page height. Convert a raster coordinate to PDF points using:

- `x_pt = 60.19633 + x_px × 474.60733 / 1691`
- `y_pt = y_px × 842 / 3000`

Keep the original page box and image placement. Do not scale the scan to the full page width.

## Measured content bands

Bands below were located by thresholding dark raster pixels and visually checking the scan. They identify content regions; they are not final field-cover rectangles. For field text, use a small mask around the value only, not the entire row/section.

| Content | Approximate image region (px) | Notes |
|---|---:|---|
| QR code | `[88, 430, 316, 800]` | Upper-left; preserve unless decoded and explicitly approved |
| Company greeting | `[400, 530, 1675, 630]` | Arabic business heading |
| Date and time | `[400, 630, 1675, 720]` | Date and time share one printed line |
| Receipt/bon number | `[400, 720, 1675, 810]` | Exact zero count requires source confirmation |
| Cashier name | `[400, 810, 1675, 900]` | Arabic |
| Register/till number | `[400, 900, 1675, 990]` | |
| Customer code | `[80, 990, 1370, 1075]` | Value and Arabic label share a line |
| Transaction type/customer name | `[80, 1075, 1675, 1175]` | Exact label/value split needs review |
| Rule above item table | `[85, 1198, 1675, 1211]` | Fixed artwork |
| Item-table headings | `[85, 1240, 1675, 1320]` | Right-to-left columns |
| Rule below item headings | `[85, 1342, 1675, 1358]` | Fixed artwork |
| Item row 1 | `[85, 1385, 1675, 1462]` | |
| Item row 2 | `[85, 1460, 1675, 1535]` | Printed price/total conflict |
| Item row 3 | `[85, 1530, 1675, 1610]` | Printed price/total conflict |
| Rule below item table | `[85, 1638, 1675, 1661]` | Fixed artwork |
| Sales total | `[900, 1680, 1675, 1760]` | Label and value; cover value only |
| Discount total | `[1050, 1760, 1675, 1850]` | |
| VAT rate and amount | `[620, 1850, 1675, 1945]` | The rate label and amount need separate masks |
| Net/payable total | `[1175, 1940, 1675, 2030]` | |
| Rule above payment | `[80, 2067, 1675, 2099]` | Fixed artwork |
| Paid amount | `[1200, 2100, 1675, 2200]` | |
| Rule above returns line | `[80, 2228, 1675, 2259]` | Fixed artwork |
| Return/exchange amount and policy | `[80, 2260, 1675, 2380]` | Keep policy text fixed; amount is a candidate editable value |
| Footer separator | `[80, 2410, 1675, 2442]` | Fixed artwork |
| Contact and footer text | `[80, 2470, 1675, 2890]` | Includes fixed URL/contact and Arabic terms |

Within those rows, the current measured value-only masks are sales total `[925, 1680, 1210, 1760]`, discount `[1095, 1760, 1260, 1850]`, VAT amount `[620, 1850, 875, 1945]`, net/payable `[1175, 1940, 1480, 2030]`, paid amount `[1380, 2100, 1675, 2200]`, and return/exchange amount `[1520, 2260, 1675, 2380]`. These value masks exclude the printed Arabic labels and separators; verify them visually if their renderer changes.

The source scan's blank upper margin is approximately `[0, 0, 1691, 430]` and is preserved. The image attached with the latest instructions is a current-output screenshot: it is used only to confirm current data values and diagnose rendering problems, not as the layout source. The visual authority remains `reference/s-and-a-reference-1.png` and its source PDF.

## Table columns

Approximate horizontal cell ranges, measured from the visible headings and row ink:

| Column | Image x-range (px) | Alignment |
|---|---:|---|
| Printed line total | `[85, 370]` | Right-aligned / numeric |
| Printed unit price | `[380, 650]` | Right-aligned / numeric |
| Quantity | `[690, 910]` | Right-aligned / numeric |
| Item description | `[1120, 1675]` | Right-aligned Arabic; mixed Latin where present |

These ranges are intentionally conservative and overlap slightly because the scan is blurred. The implementation uses each range as a separate editable cell mask, with row-specific vertical bounds; it does not cover whole rows. The three-row count and fixed dashed rules are preserved.

## Implemented editable fields and masks

- Receipt header values: date, time, receipt number, cashier, register/till number, customer code, transaction type, and customer name/identifier.
- Three item descriptions, quantities, unit prices, and line totals.
- Summary values: sales total, discount, VAT amount (the printed 14% rate remains fixed), net/payable amount, paid amount, and return/exchange amount.
- Per user decision, the default quantities, unit prices, line totals, and receipt summary amounts are derived from the corrected source data. After initialization the controls remain independently editable; changing one does not recalculate another.
- The company greeting, QR code, item headings, separators, return-policy wording, URL/contact information, and fixed footer text remain unchanged artwork.

## Digital layout coordinates

The digital renderer uses the embedded JPEG's pixel coordinates as a layout grid and preserves the reference's centered image placement. For source coordinate `(x, y)`:

- `x_pt = 60.19633 + x × 474.60733 / 1691`
- `y_pt = y × 842 / 3000`

The scan itself is not embedded. The vector page redraws headings, labels, separators, line items, totals, and footer text; the QR alone is traced as vector rectangles.

The long invoice-derived descriptions required a modest reflow while preserving the receipt's content hierarchy and fixed font-size classes:

| Element | Digital source-image coordinate / size |
|---|---|
| Company greeting | right anchor `[1675, 580]`, 60 px |
| Date and time row | `y=681`; date starts at `x=900`, time at `x=420`, period at right anchor `x=1675` |
| Receipt number | right anchor `[1675, 767]`, 50 px |
| Cashier / till / customer code | `y=857`, `947`, `1035` |
| Transaction and customer row | `y=1127` |
| Table top rule / heading rule | `y=1198`, `y=1350` |
| Table body | starts at `y=1358`, fixed end at `y=1638`; available height 280 source px |
| Digital table columns (visual order, right to left) | description `[910,1675]` (765 px), quantity `[650,910]` (260 px), unit price `[370,650]` (280 px), line total `[85,370]` (285 px) |
| Summary / payment / return | totals at `y=1720`, `1810`, `1900`, `1990`; paid at `2160`; return row at `2350` |
| Footer | separator `y=2424`; website and following lines at `2534`, `2620`, `2728`, `2810`, `2890` |

Layout font sizes are expressed in the embedded image's source-coordinate units. The company heading is 60 px; header/value text is generally 50–58 px; table text is 56–58 px. The source font is unknown, so these are measured-size approximations rendered with Helvetica first and Arial fallback.

The three item descriptions wrap without changing font size. All summary, payment, return, and footer anchors remain fixed. Export is blocked if the three rendered rows exceed the 280 px table body or if a value exceeds its fixed text box; long values are not truncated or silently moved.

When item text needs more lines, the table rows expand while fixed-size item text remains unchanged. If the expanded rows exceed the fixed table body, export is blocked and all other fields stay anchored. The four columns and three item rows remain; column edges follow the reference's measured RTL order, and current invoice values remain visible in the rendered output.

Table headings and descriptions follow RTL order, with the item description at the right and numeric columns continuing leftward as quantity, unit price, and line total. Numeric/date values use isolated LTR runs. The header labels and table headings use regular weight; summary labels and selected footer text retain emphasis. Dashed rules separate the table, payment, and return sections; the footer separator is solid.

The QR region `[88,430,316,800]` is used only to trace black pixel runs into vector rectangles. The generated page contains no raster image, but the QR payload and machine readability have not been verified because no local decoder was available.

The source font is not embedded in the reference. The S&A renderer requests Helvetica first, followed by Arial and sans-serif. No Helvetica-named font is installed in the current Windows Fonts directory, so the generated PDF uses Arial (`ArialMT` and `Arial-BoldMT`); exact source font identity and glyph shapes remain unverified. Mixed Arabic/Latin runs retain their RTL/LTR direction handling.
