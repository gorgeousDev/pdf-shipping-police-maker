# Invoice Reference Coordinate Map

**Source:** `reference/invoice-reference.pdf`  
**Coordinate origin:** top-left of each extracted page image; x increases right and y increases down.

Both pages have identical geometry and use one full-page raster image:

| Page | Raster bounds (px) | PDF MediaBox (pt) | Physical size |
|---|---:|---:|---:|
| 1 | `[0, 0, 2381, 3367]` | `[0, 0, 595.28, 841.89]` | 210 × 297 mm |
| 2 | `[0, 0, 2381, 3367]` | `[0, 0, 595.28, 841.89]` | 210 × 297 mm |

The embedded image is placed edge-to-edge, at approximately 4 px per point (288 dpi). For reference only, raster coordinates convert approximately as:

- `x_pt = x_px × 595.28 / 2381`
- `y_pt = y_px × 841.89 / 3367`

## Measured content regions

The source provides no native text or field objects. The vertical ranges below are raster pixel ranges in which dark-ink rows were detected; they locate content bands, not final cover boxes. Each editable value still needs its own measured mask and text-layout box before application code is written.

| Page | Region / content | Raster coordinate band (px) |
|---|---|---:|
| 1 | Company header and invoice identifiers/dates | `[0, 45, 2381, 539]` |
| 1 | Customer and store headings | `[0, 668, 2381, 777]` |
| 1 | Customer and store details | `[0, 844, 2381, 1085]` |
| 1 | Invoice summary notice | `[0, 1181, 2381, 1212]` |
| 1 | Item table headings | `[0, 1243, 2381, 1567]` |
| 1 | Six line-item rows | `[0, 1600, 2381, 2818]` |
| 1 | Thank-you/footer and page number | `[0, 2906, 2381, 3097]` |
| 2 | Repeated company header and invoice identifiers/dates | `[0, 45, 2381, 539]` |
| 2 | Grand total and amount-in-words | `[0, 609, 2381, 756]` |
| 2 | VAT summary, payment, and loyalty information | `[0, 844, 2381, 1326]` |
| 2 | Substitution terms and footer | `[0, 2716, 2381, 3096]` |
| 1 and 2 | Code 39 barcode bars | `[1801, 3142, 2292, 3245]` |

Each source barcode encodes the 8-character invoice number `88908524` in a 491 px bar region, yielding approximately 3.09 px per narrow module including Code 39 start/stop characters and inter-character gaps. The editable invoice number is therefore limited to 8 Code 39 characters so regenerated bars retain at least the source module width.

The map uses top-left raster coordinates and exclusive upper bounds. The table bands include whitespace between item rows; they are not replacement-mask dimensions. Invoice number, order number, dates, customer values, the six table rows, totals, payment, and loyalty values must each be measured individually before implementation. Keep the company/store artwork, fixed labels, explanatory text, and substitution terms outside those masks.

## Planned editable fields

- Header: order number, invoice number, invoice date, expected delivery date.
- Customer block: bilingual customer name/address, tax ID, and phone.
- Item table: six fixed rows; each row's description, ordered quantity, delivered quantity, VAT-inclusive unit price, and substitution discount are inputs. VAT-exclusive values, VAT amounts, and line totals are derived.
- Page 2: grand total and English amount-in-words are derived; payment type, customer/loyalty details, and earned points are inputs. Payment amount follows the derived grand total.
- Invoice barcode: the same invoice-number payload appears on both pages and is regenerated as Code 39 when the invoice number changes.

## Editable ink and column coordinates

These are source-ink/content bands, not final cover rectangles. All coordinates are raster pixels with exclusive upper bounds.

| Page 1 field group | Source coordinate region (px) |
|---|---:|
| Order number value | `[404, 364, 684, 397]` |
| Invoice number value | `[404, 410, 553, 443]` |
| Invoice date value | `[404, 456, 601, 494]` |
| Expected delivery date (empty source value; available row) | `[404, 501, 601, 539]` |
| Customer name | `[51, 844, 217, 873]` |
| Customer Latin address | `[51, 892, 713, 925]` |
| Customer Arabic address | `[52, 939, 618, 1020]` |
| Customer tax ID | `[52, 1035, 262, 1059]` |
| Customer phone | `[52, 1057, 262, 1085]` |
| Six-row item table | `[52, 1600, 2329, 2818]` |
| Description column | `[64, 1600, 468, 2818]` |
| Ordered quantity | `[539, 1600, 621, 2818]` |
| Delivered quantity | `[686, 1600, 770, 2818]` |
| Unit price including VAT | `[868, 1600, 998, 2818]` |
| Unit price excluding VAT (derived display) | `[1096, 1600, 1226, 2818]` |
| Total price excluding VAT (derived display) | `[1305, 1600, 1453, 2818]` |
| VAT rate | `[1506, 1600, 1590, 2818]` |
| VAT amount (derived display) | `[1651, 1600, 1795, 2818]` |
| Substitution discount | `[1933, 1600, 2000, 2818]` |
| Total price including VAT (derived display) | `[2172, 1600, 2320, 2818]` |

The six row-text bands observed in the raster are:

| Row | Content | Ink band (px) |
|---|---|---:|
| 1 | Product | `[52, 1600, 2317, 1663]` |
| 2 | Product | `[52, 1827, 2317, 1889]` |
| 3 | Product | `[52, 2054, 2314, 2084]` |
| 4 | Product | `[52, 2280, 2314, 2343]` |
| 5 | Delivery charge | `[52, 2507, 2314, 2592]` |
| 6 | Service fee | `[52, 2734, 2329, 2818]` |

| Page 2 field group | Source coordinate region (px) |
|---|---:|
| Grand total including VAT value | `[2067, 609, 2328, 649]` |
| Amount in words | `[376, 717, 2004, 756]` |
| VAT summary | `[0, 844, 2330, 1086]` |
| VAT amount subtotal (derived) | `[2147, 939, 2318, 976]` |
| Net amount subtotal (derived) | `[1572, 939, 1919, 976]` |
| VAT amount total (derived) | `[2168, 1004, 2318, 1030]` |
| Net amount total (derived) | `[1750, 1004, 1919, 1030]` |
| Payment and loyalty details | `[0, 1181, 2330, 1364]` |
| Payment type value | `[450, 1194, 697, 1226]` |
| Payment amount (derived) | `[450, 1248, 697, 1282]` |
| MyClub card number | `[1633, 1194, 1859, 1226]` |
| Customer loyalty name | `[1635, 1248, 1914, 1282]` |
| Earned points | `[1634, 1301, 1717, 1326]` |
| Invoice number barcode | `[1801, 3142, 2292, 3245]` |

These content bands were measured by scanning dark-ink rows and column spans in the extracted page images. Header identifiers occupy separate lines at y=364–539; customer/store data is below the section headings at y=844–1085. The row ink bands include the visible text only; row separators and whitespace remain fixed artwork. For the table, an editable cell's conservative ink mask is the intersection of its measured column range and row ink band. For header, customer, payment, and loyalty values, use each individual value range above, not the enclosing section. Text-layout padding must remain within its adjacent whitespace and must not cross fixed labels or separators. Keep input descriptions within each row's fixed height; wrap to two lines, then shrink to a measured minimum size and clip without moving another row. Address and other long text similarly stay within their measured boxes; Arabic text is RTL.

The inspected flat background colors are RGB `(242, 242, 242)` for the page 1 header/customer bands, white for the item table and page 2 payment section, and approximately `(241, 245, 246)` for the page 2 amount-in-words strip. The blue grand-total text's dominant source color is approximately `(9, 102, 179)`. These sampled colors guide masks and replacement text; unchanged fields are not redrawn.

The approved calculation proposal uses delivered quantity × VAT-inclusive unit price, subtracts the row discount from the VAT-inclusive amount, derives the net amount at 14% VAT, rounds monetary values to two decimals, and totals the six rows. Confirm this exact rounding sequence against implementation comparisons before release.

## Preservation rules

- With no invoice edits, export the supplied PDF bytes unchanged.
- For edited output, preserve each original page image and cover only measured editable value regions.
- Preserve the original A4 page boxes and page order.