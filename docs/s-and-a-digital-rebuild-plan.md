# S&A Receipt — Fully Digital Rebuild Plan

**Status: implemented.** See [implementation and verification report](./s-and-a-implementation-plan.md) for the rendered-PDF check and remaining limitations.

## Goal

Replace the scan-backed receipt with a digitally drawn receipt while preserving its measured composition, fixed page geometry, text hierarchy, and printed font sizes. Editable data stays in the receipt model. No scanned receipt background or patch masks are used in preview or export.

## Reference facts

- `reference/s-and-a-reference.pdf` is one portrait page, MediaBox `[0 0 595 842]` pt.
- The visible receipt is a centered 1691 × 3000 px JPEG placed at `x=60.19633 pt`, `y=0 pt`, width `474.60733 pt`, height `842 pt`.
- It has no native text operators and no embedded fonts. Exact typeface identification is impossible from the PDF; font matching must be visual and documented as approximate.
- The reference and existing coordinate measurements are recorded in `s-and-a-reference-analysis.md` and `s-and-a-field-map.md`. The page uses a large blank top margin, QR at upper left, Arabic heading and metadata, four-column three-row table, totals/payment area, and fixed footer.
- The QR is part of the reference image. Its payload has not been decoded. A digital redraw must preserve its observed module pattern and be decode-checked before release; no payload may be invented.

## Proposed rendering

1. Retain the existing vanilla JavaScript app and the receipt data model. Do not change other document modes.
2. Recreate the page from a blank 595 × 842 pt PDF using vector rules, separators, text, and QR modules. Preserve the reference's visible spacing and content hierarchy; omit scanner shadows, paper texture, and scan artifacts because the output is digital.
3. Use the existing local Arabic font assets as visual candidates, measure each reference text band's glyph height against the source image, and store explicit fixed point sizes, weights, anchors, directions, and alignments in the receipt layout data. Do not auto-shrink text. Keep each field's point size fixed; wrap only inside its measured row/field. If a value cannot fit at that size, show a field-specific overflow error and disable export.
4. Shape Arabic text with fontkit and embed text with the available PDF font pipeline. Keep the editable source values in the app model; the exported text remains selectable.
5. Trace the QR's observed dark pixels into vector runs from the reference. Do not change its pattern to match edited receipt data. No local QR decoder was available, so the payload and machine-readability remain unverified.
6. Preview and PDF export must use the same layout data and vector drawing functions so that coordinates, sizes, line breaks, and shaping match.

## Scope and constraints

- Preserve the exact 595 × 842 pt page and the source's centered receipt bounds; do not scale to Letter/A4 or fill the side margins.
- Keep every field in the existing centralized receipt data model. Do not recalculate independent quantities, prices, totals, VAT, or payment amounts.
- Export a digital page for both default and edited receipt values; the original scan is never used as the export background.
- Match the reference's measured text sizes, not the previous overlay sizes. Exact source font identity cannot be recovered; choose the closest visual match from available Arabic fonts and report the difference.
- Do not introduce frameworks or unrelated dependencies. If existing fontkit cannot correctly shape Arabic or provide vector glyph paths, pause and present the smallest dependency-free/approved alternative before changing the architecture.

## Acceptance criteria

1. Receipt export is fully digital: no scan image, raster receipt background, or field-cover rectangles.
2. One page at exactly 595 × 842 pt; visual receipt bounds and page margins align to the source map.
3. Fixed vector artwork (rules, separators, QR trace) has been measured against the reference and remains fixed when data changes.
4. Text uses explicit, stable point sizes matched to the measured source hierarchy; editing one value never changes unrelated sizes.
5. Arabic shaping, glyph joining, mixed Arabic/Latin order, and alignment are checked in both browser preview and rendered PDF.
6. Long values wrap only where the reference field supports multiple lines; otherwise validation blocks export without shrinking the font or moving other content.
7. The QR pattern is traced from the reference and is never recomputed from receipt fields. Machine decoding remains outstanding because no local decoder was available.
8. Rendered-PDF visual comparison is performed against the source at matching dimensions; measurable differences and the approximate typeface match are documented.

## Implementation note

This digitally redrawn version supersedes the prior scan-overlay receipt renderer. The font family is approximate because the reference contains no font resources, and the traced QR has not been machine-decoded.
