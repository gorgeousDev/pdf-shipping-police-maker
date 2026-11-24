# Reference PDF Analysis

## Method

Inspected `reference/avalon-jt.pdf` directly: parsed its page and image objects with Python's standard library, decompressed and reversed the image's PNG predictor, viewed the extracted image, and scanned the original pixels in the browser. No prior application code or prior extracted artwork was used.

## Verified document structure

| Property | Result |
|---|---|
| Page count | 1 |
| Page box | `[0 0 215 369]` pt |
| Physical size | 75.8472 × 130.175 mm |
| Orientation | Portrait |
| Page content | One image XObject drawn edge-to-edge |
| Image size | 895 × 1537 px |
| Image format | DeviceRGB, 8 bits per component |
| Image compression | FlateDecode with PNG predictor 14 |
| Native text/font objects | None |
| PDF producer | jsPDF 4.2.1 |
| Creator | J&T shipping label builder |
| Source SHA-256 | `f5c6c1afa1ebb6032d5083e90a8770578c40c88a4d70e5f337fc89fbe167c8d7` |

The page content stream is:

```text
q
215. 0 0 369. 0. 0. cm
/I0 Do
Q
```

Consequently, all text, rules, symbols, and both barcodes are raster pixels. The image is the authoritative appearance; the PDF itself is the safest exact-output path.

## Visible-element inventory

From top to bottom:

- COD badge and “Standard” heading.
- Order number label and printed number.
- Top horizontal barcode with human-readable string `JEG000547344825`.
- Payment/service row: FOD, Cods amount, and Insur.
- Large service/route code `20 B02-02 006`.
- Right-side vertical barcode.
- Recipient label, name, phone, and three Arabic address lines.
- Sender label, depot, code, and three visible Arabic address lines.
- Remarks label and blank writing area.
- Horizontal separators, phone icon, phone number, and timestamp footer.

Both barcodes encode the same label ID, `JEG000547344825`.

## Barcode findings and limitations

- Both barcode pixel regions were located and measured in [field_map.md](./field_map.md).
- The top barcode has visible human-readable text `JEG000547344825`.
- Pixel-run decoding identified Code 128 Set A for the top barcode and Code 128 Set B followed by Code C numeric compression for the right-side barcode.
- Both payloads decode to `JEG000547344825`; checksums are 44 (top) and 89 (right-side). The source is JEG, not JEQ.
- The editable ID regenerates both barcodes using those same Code 128 code-set strategies.

## Typography and Arabic

The reference has no embedded fonts or selectable text. Exact font family, font size, and text values cannot be extracted from PDF text operators. Arabic content is visibly present but raster-only. Replacement text is shaped by the browser's Canvas text renderer with explicit RTL direction and physical left alignment; exact font identity and glyph-for-glyph equivalence remain unknown.

## Coordinate conventions

The source raster uses top-left origin, x increasing right, y increasing down. Raster coordinates map to PDF points by `x × 215 / 895` and `y × 369 / 1537`. Field coordinates below are visible-ink bounds measured from source pixels, not inferred cover margins.
