# Fresh Rebuild — Implementation and Test Report

## Implemented

- Rebuilt the editor and preview from the supplied PDF raster, with a centralized replacement model.
- Kept unedited export byte-for-byte identical to the source PDF.
- Separated measured white-mask bounds from safe text-layout boxes. All masks are drawn before replacement content, so later masks cannot erase earlier text. The edited PDF embeds the same full-page Canvas composite shown in the preview.
- Arabic input uses `dir="rtl"` and Arabic language metadata. Canvas drawing sets RTL direction while keeping the lines physically left-aligned.
- Recipient address lines 1 and 2 use 33 px bold DejaVu Sans, the closest installed Arabic-capable face in a pixel comparison against the source phrase. Baselines are calibrated to y=775 and y=814 px.
- Added an editable label ID. The source reads `JEG000547344825` (JEG, not JEQ); replacing the ID redraws its printed value and both Code 128 barcodes.
- Added a right-aligned editable footer date/time field at the measured source position.

## Verification

| Check | Result |
|---|---|
| Browser app and reference load | Passed |
| Source raster and initial Canvas | 895 × 1537; 0 differing color channels |
| Unedited PDF export | 107,275 bytes; SHA-256 exactly matches source: `f5c6c1afa1ebb6032d5083e90a8770578c40c88a4d70e5f337fc89fbe167c8d7` |
| Source top barcode | Decodes as Code 128 Set A to `JEG000547344825`; checksum 44 |
| Source right-side barcode | Decodes as Code 128 Set B with Code C numeric compression to `JEG000547344825`; checksum 89 |
| Generated test ID `JEQ123456789012` | Both regenerated codes decode to the entered ID; top checksum 79, side checksum 89 |
| Edited PDF | 199,101 bytes; 1 page at 215 × 369 pt |
| Edited Canvas vs. source raster | 122,075 changed pixels, all within selected replacement/mask/layout regions; 0 outside |
| Requested replacement label | Order number `63718392384743764`; label ID `JEG000547339720`; recipient Arabic lines; timestamp `2026-05-29 12:23:46` |
| Arabic replacements | All six address controls report RTL direction and left alignment. Rendered Arabic is shaped, starts near the measured left edge, and stays within the available line regions. |
| Recipient address line 2 typography | Matching “العصافرة قبلي” against the original raster gave 0.853 foreground-pixel intersection-over-union with DejaVu Sans Bold 33 px at baseline 814 px; it was the best-fit installed candidate. |
| Recipient address line 1 typography | Rendered in the same DejaVu Sans Bold 33 px style at baseline 775 px; visual inspection confirmed consistent weight and left alignment with line 2. |
| Invalid label ID | Lowercase input reports an error, disables export, and leaves original ID/barcodes visible |
| Visual diff | Generated a full-resolution red-highlight overlay at 895 × 1537 for the test replacements |

The visual-diff image and edited preview are saved in the session artifacts. The sender block in the supplied reference contains **three** visible Arabic address lines; no fourth sender-address line is present to map or replace.

## Remaining limitations

- The source contains raster artwork only, with no embedded font. DejaVu Sans Bold is the closest locally available match measured for recipient Arabic, but the unknown original typeface cannot be reproduced or guaranteed on devices that do not have DejaVu Sans installed.
- The label ID accepts 1–15 uppercase letters/digits so it fits the measured barcode region and Code 128 Set A.
- Edited export is a full-page raster composite at the original 895 × 1537 source resolution; page dimensions and appearance are preserved, but edited text is not native PDF text.
