# AGENTS.md — Shipping Label Generator

## Project mission

Build a high-fidelity, browser-based shipping-label editor and PDF generator from the supplied reference:

- Reference file: `reference/avalon-jt.pdf`
- Stack: Vanilla HTML, CSS, and JavaScript unless the approved plan establishes a concrete reason otherwise.
- Primary outcome: users can edit shipment data, preview the label, and export a PDF that matches the reference as closely as technically possible.

Visual fidelity is a release requirement, not a cosmetic preference.

## Non-negotiable rules

1. Treat the supplied PDF as the source of truth for the label's appearance and physical page size.
2. Do not claim or promise 100% fidelity before measurement and comparison establish it. Report any limitation honestly.
3. Never guess a field's value, barcode symbology, barcode payload, font, or measurement. Inspect and document uncertain details.
4. Preserve the reference page dimensions and aspect ratio. Do not silently substitute A4, Letter, or a standard label size.
5. Keep all editable shipment values in one clearly defined data model. Avoid hardcoding shipment-specific values into rendering logic.
6. Keep fixed artwork and editable content separate where this improves fidelity and maintainability.
7. Do not stretch, crop, recolor, redraw, or otherwise alter fixed reference artwork without an approved reason.
8. Do not alter the barcode's payload or symbology. Verify both against the reference where technically possible.
9. Text changes must not move unrelated elements. Define explicit overflow behavior for long values.
10. Preserve Arabic shaping, glyph rendering, text direction, and alignment wherever applicable.
11. Do not introduce a framework, backend, build system, dependency, or abstraction without a demonstrated need.
12. Do not add unrelated features or refactor unrelated code.

## Workflow and approval gates

### Before implementation

- Inspect the PDF itself and all relevant project files.
- Record page dimensions, image dimensions, orientation, and available metadata.
- Inventory every visible field and fixed visual element.
- Locate and decode each barcode if possible; record the tool and confidence of the result.
- Identify fonts and rendering uncertainties. Do not infer an exact font from appearance alone.
- Produce a coordinate map and a reference-analysis report.
- Propose the rendering and PDF-export strategy.
- Write an implementation plan with acceptance criteria.

**Stop for user approval before writing application code.**

### During implementation

- Work in small, coherent phases that follow the approved plan.
- Make the smallest set of changes that achieves the current phase.
- Inspect only files relevant to the current task.
- Avoid repeated full-repository scans and large terminal dumps.
- Do not spawn subagents by default. Use them only when a genuinely independent task justifies their overhead and the user approves or the project instructions explicitly allow it.
- Do not silently change product behavior, field semantics, barcode data, or page geometry.
- If a new discovery invalidates an approved assumption, stop and report it before proceeding.

### Verification

Use targeted verification only. Do not create or run a broad test suite without a concrete reason.

Required checks before release:

- Exported PDF page dimensions match the reference dimensions.
- Exported page count is correct.
- Fixed artwork aligns with the reference.
- Editable fields render at their measured positions.
- Barcode payload and symbology are correct, and the generated barcode is machine-readable.
- Arabic text renders correctly where present.
- Long values follow the approved overflow rules.
- PDF output has no unintended margins, clipping, scaling, or extra page.

Prefer a rendered-PDF visual comparison against the reference over superficial assertions. Record any remaining measurable differences.

## Communication

- Use concise, plain language.
- State the current phase, the result, and the next action.
- Ask one focused question only when blocked by a product decision or missing source information.
- Distinguish measured facts from assumptions and unresolved questions.
- Never report a check as passed unless it was actually run.

## Definition of done

The project is complete only when all acceptance criteria in `PLAN.md` are satisfied, the generated PDF has been compared with the reference, barcode behavior has been verified, and known limitations are documented.
