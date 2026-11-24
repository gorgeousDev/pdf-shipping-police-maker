# Invoice Reference Analysis

## Inspection method

Inspected `reference/invoice-reference.pdf` directly. Read the PDF page and image objects, extracted each page's embedded JPEG for visual inspection, and checked the file hash and document metadata. The PDF contains two page-sized raster images; no text or fonts are embedded as selectable page content.

## Verified document properties

| Property | Result |
|---|---|
| PDF version | 1.3 |
| Page count | 2 |
| MediaBox on both pages | `[0 0 595.28 841.89]` pt |
| Physical page size | 210 × 297 mm (A4) |
| Orientation | Portrait |
| Page artwork | One edge-to-edge image per page |
| Embedded image dimensions | 2381 × 3367 px per page |
| Image format | JPEG, DeviceRGB, 8 bits per component |
| Native page text/font objects | None |
| Creator / producer metadata | SAP / SAP PDF Generator |
| Title | Tax Invoice — Carrefour Egypt |
| Visible invoice number | 88908524 |
| Visible order number | 818020008225759 |
| Source SHA-256 | `21a7b40837a696ff93c4763d75e9e97d645285a207d79768c05b0e4e17e2322e` |

The page image object is placed almost edge-to-edge at approximately four raster pixels per PDF point. Since the artwork is raster-only, exact font names, text operators, and semantic field boundaries cannot be recovered from the PDF.

## Visible-element inventory

### Page 1

- Carrefour logo and bilingual company/tax-registration header.
- Company address and contact information.
- Bilingual tax-invoice heading, order number, invoice number, invoice date, and expected delivery date.
- Customer and store information blocks, including names, addresses, tax ID, phone, hotline, and website.
- Bilingual invoice-summary notice.
- Item table with descriptions, ordered and delivered quantities, prices including/excluding VAT, VAT rate and amount, substitution discount, and total including VAT.
- Six visible rows: four products, delivery charge, and service fee.
- Thank-you/refund text, page number, and a Code 39 barcode with human-readable digits `88908524`.

### Page 2

- Repeated company and invoice heading.
- Total amount including VAT and amount in words.
- VAT summary table with rate, amount excluding VAT, and VAT amount.
- Payment type and amount.
- MyClub card number (masked), customer name, and earned points.
- Bilingual product-substitution terms.
- Page number, footer, and a repeated Code 39 barcode.

All listed values and artwork are part of the page images. There are no independent editable invoice fields in the source PDF. The visible company/store branding, headings, explanatory notices, and legal/substitution text can therefore remain fixed artwork; transaction values need measured replacement regions.

## Barcode and typography

Both page barcodes were sampled from the embedded raster and run-width decoded as Code 39. Each decodes to `88908524`, matching the human-readable digits and the invoice number; the start/stop characters are Code 39 framing, not part of the payload. The measured bar-ink bounds are approximately `[1801, 3142, 2292, 3245]` px on each page. The invoice-number barcode should only be regenerated using Code 39 after verifying the output against the source pattern and decoded payload.

The PDF contains no font resources for page content because the visible text is baked into the JPEG artwork. Exact typeface identity cannot be established from this source.

## Rendering implication

With no invoice edits, the highest-fidelity output is the supplied PDF's original bytes, unchanged. For edited output, preserve the original raster as fixed artwork, cover only measured transaction-value regions, and draw replacements in place. The edited page will remain raster-based and retain both A4 page boxes, but replacement text cannot be guaranteed to match the unknown source typeface exactly.