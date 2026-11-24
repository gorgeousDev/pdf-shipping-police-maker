# Source Pixel Field Map

**Source:** `reference/avalon-jt.pdf`, independently extracted 895 × 1537 raster.  
**Coordinates:** pixel bounds `[x0, y0, x1, y1]`, top-left origin; upper bounds are exclusive. PDF-point bounds are derived using x × 215/895 and y × 369/1537.  
**Important:** these are visible-ink bounds, not design-cell bounds. The app keeps white mask bounds separate from text layout boxes so replacement glyphs are not clipped to the original ink. Text boxes stay within the surrounding line area and do not cross fixed labels or dividers.

| Content | Raster ink bounds (px) | Approx. bounds (pt) | Behavior |
|---|---:|---:|---|
| Order number value | `[84,134,402,155]` | `[20.19,32.17,96.57,37.21]` | Replace; “Order No.” remains fixed |
| Top barcode bars | `[41,176,855,270]` | `[9.85,42.25,205.39,64.82]` | Code 128 Set A; regenerated from editable label ID |
| Human-readable ID below barcode | `[287,310,608,337]` | `[68.94,74.42,146.06,80.91]` | Replace with editable label ID |
| COD amount | `[411,397,574,426]` | `[98.75,95.31,137.85,102.27]` | Replace on the “Cods” row; 29 px text at baseline y=416 px |
| Service/route code | `[19,498,668,573]` | `[4.56,119.56,160.47,137.56]` | Replace |
| Right barcode bars | `[704,499,849,1084]` | `[169.12,119.80,203.95,260.24]` | Code 128 Set B with numeric compression; regenerated from editable label ID |
| Recipient name | `[87,646,211,675]` | `[20.91,155.09,50.68,162.05]` | Replace; “To:” remains fixed |
| Recipient phone | `[476,648,677,669]` | `[114.31,155.57,162.63,160.63]` | Replace |
| Recipient Arabic line 1 | `[5,749,554,783]` | `[1.20,179.82,133.08,187.98]` | Replace, RTL and left-aligned |
| Recipient Arabic line 2 | `[6,789,428,821]` | `[1.44,189.42,102.87,196.62]` | Replace, RTL and left-aligned |
| Recipient Arabic line 3 | `[6,895,465,930]` | `[1.44,214.87,111.70,223.27]` | Replace, RTL and left-aligned |
| Sender depot | `[102,982,444,1007]` | `[24.51,235.76,106.68,241.76]` | Replace; “FROM:” remains fixed |
| Sender code | `[496,983,584,1004]` | `[119.10,236.00,140.29,241.04]` | Replace |
| Sender Arabic line 1 | `[5,1033,576,1064]` | `[1.20,247.99,138.37,255.44]` | Replace, RTL and left-aligned |
| Sender Arabic line 2 | `[6,1067,129,1096]` | `[1.44,256.16,30.99,263.13]` | Replace, RTL and left-aligned |
| Sender Arabic line 3 | `[5,1131,302,1152]` | `[1.20,271.53,72.55,276.57]` | Replace, RTL and left-aligned |
| “REMARKS” label | `[11,1207,130,1225]` | `[2.64,289.77,31.23,294.10]` | Fixed |
| Remarks area | `[0,1225,895,1438]` | `[0,294.10,215,345.23]` | Blank in source; text may be added |
| Footer phone number/icon | y approximately `1475–1498` | y approximately `354.12–359.64` | Fixed |
| Footer date and time | `[551,1475,820,1496]` | `[132.37,354.84,197.09,359.16]` | Replace; right aligned |

The major horizontal rules occur at raster rows 167–170, 354–357, 446–449, 613–616, 958–961, 1188–1191, and 1438–1441. The main vertical rule at x=688–691 separates the route/recipient area from the barcode column.

## Explicitly fixed elements

COD/Standard badge, FOD/Cods/Insur labels, “To:” and “FROM:” labels, all separators, remarks heading, phone icon, and phone number. The printed label ID and both barcodes are replaced together.

The source shows `JEG000547344825` (JEG, not JEQ). Pixel-run decoding verified that the top Code 128 Set A barcode and the right-side Code 128 Set B barcode with Code C numeric compression both encode this exact value. Their source checksums are 44 and 89, respectively. The editable ID accepts 1–15 uppercase alphanumeric characters; the top code remains Set A and the side code uses B/C numeric compression.

The COD replacement shares the printed “Cods” baseline at y=416 px and uses 34 px regular Arial, which best matched the source “Cods” glyph bounds in a browser-font comparison. Its white cover extends right to x=584 px, leaving a measured 36 px clear gap before “Insur” starts at approximately x=620 px. The original amount's ink ends at x=574 px.

The label ID uses a centered 38 px regular replacement at baseline y=337 px. Browser-font measurements place its text bounds close to the source ID's 321 × 27 px ink bounds. Text layout boxes are wider/taller than the source-ink masks where adjacent artwork permits, preventing replacement glyphs from being clipped by the white mask bounds.

The recipient address lines 1 and 2 use 33 px bold DejaVu Sans. This locally available Arabic-capable face produced the closest pixel-shape match against the original printed phrase “العصافرة قبلي” among the installed browser fonts. Their drawing baselines are calibrated to the source raster at y=775 and y=814 px; the original font itself cannot be recovered from this image-only PDF.

## Replacement typography calibration

The reference has no embedded font. The configured sizes below were calibrated against the source's visible value bounds using the browser's Arial-compatible face. Replacement text remains an approximation, not an extracted font match.

| Field | Replacement style |
|---|---|
| Order number | 34 px, regular, baseline 155 px |
| COD amount | 34 px, regular, baseline 416 px; same size and baseline as “Cods” |
| Service/route code | 103 px, regular, baseline 572 px |
| Recipient name | 41 px, regular, baseline 674 px |
| Recipient phone | 33 px, regular, baseline 669 px |
| Recipient Arabic lines | 33 / 33 / 31 px, bold; DejaVu Sans for lines 1–2; baselines 775 / 814 / 929 px |
| Sender depot | 34 px, regular, baseline 1007 px; cover begins at x=99 px to preserve the colon |
| Sender code | 32 px, regular, baseline 1004 px |
| Sender Arabic lines | 28 / 28 / 20 px, regular, measured individual baselines |
| Label ID | 38 px, regular, centered, baseline 337 px |
| Footer date and time | 28 px, regular, right-aligned, baseline 1496 px |
