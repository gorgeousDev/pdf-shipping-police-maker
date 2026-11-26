# S&A Receipt — Semantic HTML Rebuild Plan

**Status: implemented; print-layout and exported-PDF visual checks are complete, with known differences documented.**

## Goal

Replace the current Canvas-based S&A preview with a complete HTML/CSS/vanilla-JavaScript receipt. Use the supplied receipt PDF only as the measured visual reference; do not use the full-page scan as a background or output image. Populate matching receipt fields from the electronic tax invoice.

## Verified reference facts

- `reference/s-and-a-reference.pdf` is PDF 1.7 with one portrait page and a `[0 0 595 842]` pt MediaBox.
- The page contains a centered 1691 × 3000 px JPEG at `x=60.19633 pt`, `y=0 pt`, width `474.60733 pt`, and height `842 pt`.
- The reference image shows the original blank upper margin above the QR. The full embedded-image coordinate system is used to retain that margin on the original 595 × 842 pt page.
- The reference has no native text or embedded fonts. Exact typeface identification is therefore unavailable; any local Arabic/Latin font choice is an approximation.
- The layout has a large blank upper margin, QR at upper left, Arabic heading and receipt metadata, a three-row four-column item table, totals/payment, and a fixed footer. Measurements are in [the reference analysis](./s-and-a-reference-analysis.md) and [the coordinate map](./s-and-a-field-map.md).
- The QR payload has not been decoded. The proposal preserves its observed pattern as a standalone inline SVG, not as a page image; it may not correspond to the electronic tax invoice.

## Implemented approach

1. Keep the existing vanilla JavaScript app and S&A editor. The preview is semantic DOM: a receipt page, header/details, HTML item table, totals, payment section, and footer. CSS defines measured placement, typography, dashed rules, and responsive preview scaling.
2. The print stylesheet requests the reference's exact 595 × 842 pt page size and zero margins. Do not introduce a framework, backend, or dependency. The full-page scan is not used in the preview or exported output.
3. Use the electronic tax invoice's current default data as the S&A initial source: seller name, issue date/local time, internal number, buyer name, item descriptions/quantities/unit prices, and amounts. Preserve two-decimal display and the 14% VAT presentation. S&A values remain independently editable after initialization; editing one document mode does not live-update the other.
4. Do not invent values for fields absent from the tax invoice. Per approval, customer-code, cashier, and register/till values start blank.
5. Preserve Arabic direction and shaping with `lang="ar"`, `dir="rtl"`, and bidi isolation for mixed Arabic/Latin values. Use the requested Helvetica-first system font stack; Arial is the fallback where Helvetica is unavailable.
6. Preserve the source QR pattern as a standalone inline SVG traced from the scan. Do not claim its payload matches the electronic invoice; machine readability remains unverified.
7. Generate PDF output from the HTML DOM with browser print-to-PDF and print styles that remove application UI. The export opens the browser's print/save dialog rather than downloading a PDF-Lib-generated file.
8. Keep descriptions at fixed sizes and allow wrapping within table cells. If the rows exceed the fixed table body, show a validation error rather than shrinking text, truncating data, or moving unrelated elements.

## Approved data and export decisions

- **PDF export:** browser print-to-PDF from the HTML DOM.
- **Customer code, cashier, and register/till:** leave blank because the tax invoice has no corresponding approved value.
- **Font:** request Helvetica for the S&A receipt, with Arial and sans-serif fallbacks when it is unavailable.

## Acceptance criteria

1. The S&A preview is built from HTML elements and CSS; there is no full-page raster image or Canvas receipt renderer.
2. The source geometry remains 595 × 842 pt in CSS. The generated Chromium PDF is one portrait page; its measured MediaBox is 594.95996 × 841.91998 pt (0.04004 pt narrower and 0.08002 pt shorter).
3. Initial values come from the approved electronic-invoice mapping. No values are guessed; customer code, cashier, and register/till start blank.
4. The page uses fixed text sizes and explicit overflow behavior. Editing one field does not move unrelated content; overlong values block export with a clear error.
5. Arabic shaping and mixed-direction text render with the requested Helvetica-first system font stack. The layout is measured against the full-page reference image; the latest current-output screenshot is diagnostic only. Font availability varies by platform.
6. The Chrome-generated PDF has one page and no raster image XObjects. Its MediaBox differs from the requested size by less than 0.1 pt per dimension; confirm final print behavior in the target browser.
7. Visual comparison corrected the RTL item-table order, regularized the header/table-heading weights, and matched dashed payment/return rules while retaining the solid footer separator. The fixed table body fits the initial invoice descriptions; longer edits block export instead of shifting other receipt content.
8. The QR remains a standalone vector trace. Its unknown payload and unverified machine-readability are disclosed.

## Implementation context

The S&A mode now uses semantic HTML/CSS and browser print-to-PDF. The reference scan is used only to trace the standalone QR vector. Verification results and known limitations are documented in the [implementation report](./s-and-a-implementation-plan.md).
