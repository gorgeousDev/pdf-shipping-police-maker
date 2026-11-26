import { code128Runs, encodeCode128A, encodeCode128BWithNumericCompression } from "./barcode.js";
import {
  INVOICE_DEFAULT_DATA,
  INVOICE_PAGE,
  calculateInvoice,
  createInvoiceControls,
  createInvoiceData,
  invoiceHasChanges,
  renderInvoicePage,
  setInvoiceValue,
  validateInvoice,
} from "./invoice.js";
import {
  SA_RECEIPT_PAGE,
  createSaReceiptControls,
  createSaReceiptData,
  renderSaReceiptPage,
  setSaReceiptQrVector,
  setSaReceiptValue,
  validateSaReceiptLayout,
} from "./sa-receipt.js?v=40";
import {
  createTaxInvoiceControls,
  createTaxInvoiceData,
  renderTaxInvoiceTable,
  renderTaxInvoiceOverlay,
  renderTaxInvoicePage,
  setTaxInvoiceValue,
  taxInvoiceHasChanges,
  verifyTaxInvoiceOverlay,
  TAX_INVOICE_PAGE,
} from "./tax-invoice.js?v=25";

const PAGE = { widthPt: 215, heightPt: 369, widthPx: 895, heightPx: 1537 };
const TAX_INVOICE_EXPORT_BORDER_WIDTH_PT = 0.15;
const FIELD_DEFINITIONS = [
  {
    id: "orderNo",
    label: "Order number",
    kind: "single",
    cover: [84, 134, 402, 155],
    fontSize: 34,
    minFontSize: 12,
    baseline: 155,
    align: "left",
    textBox: [84, 125, 402, 161],
  },
  {
    id: "policeId",
    label: "Label ID (updates both barcodes)",
    kind: "barcode",
    defaultValue: "JEG000547344825",
    maxLength: 15,
    pattern: "[A-Z0-9]{1,15}",
    cover: [275, 306, 620, 340],
    textBox: [275, 306, 620, 351],
    barcodeCoverTop: [40, 175, 856, 271],
    barcodeCoverSide: [703, 498, 850, 1085],
    fontSize: 38,
    minFontSize: 12,
    baseline: 337,
    align: "center",
    weight: "400",
  },
  {
    id: "cods",
    label: "COD amount",
    kind: "single",
    cover: [411, 395, 584, 426],
    fontSize: 34,
    minFontSize: 12,
    baseline: 416,
    align: "left",
    textBox: [411, 386, 584, 434],
  },
  {
    id: "serviceCode",
    label: "Service / route code",
    kind: "single",
    cover: [19, 498, 668, 573],
    fontSize: 103,
    minFontSize: 20,
    baseline: 572,
    align: "left",
    weight: "400",
    textBox: [19, 484, 668, 590],
  },
  {
    id: "recipientName",
    label: "Recipient name",
    kind: "single",
    cover: [87, 646, 211, 675],
    fontSize: 41,
    minFontSize: 12,
    baseline: 674,
    align: "left",
    textBox: [87, 631, 211, 696],
  },
  {
    id: "recipientPhone",
    label: "Recipient phone",
    kind: "single",
    cover: [476, 648, 678, 669],
    fontSize: 33,
    minFontSize: 12,
    baseline: 669,
    align: "right",
    textBox: [476, 631, 678, 696],
  },
  {
    id: "recipientAddress1",
    label: "Recipient address — line 1",
    kind: "arabic",
    cover: [5, 749, 554, 783],
    fontSize: 33,
    minFontSize: 12,
    baseline: 775,
    align: "left",
    fontFamily: "DejaVu Sans",
    textBox: [5, 744, 554, 788],
  },
  {
    id: "recipientAddress2",
    label: "Recipient address — line 2",
    kind: "arabic",
    cover: [6, 789, 428, 821],
    fontSize: 33,
    minFontSize: 12,
    baseline: 814,
    align: "left",
    fontFamily: "DejaVu Sans",
    textBox: [5, 789, 554, 825],
  },
  {
    id: "recipientAddress3",
    label: "Recipient address — line 3",
    kind: "arabic",
    cover: [6, 895, 465, 930],
    fontSize: 31,
    minFontSize: 12,
    baseline: 929,
    align: "left",
    textBox: [5, 882, 554, 941],
  },
  {
    id: "senderDepot",
    label: "Sender depot",
    kind: "single",
    cover: [99, 982, 444, 1007],
    fontSize: 34,
    minFontSize: 12,
    baseline: 1007,
    align: "left",
    textBox: [99, 972, 444, 1017],
  },
  {
    id: "senderCode",
    label: "Sender code",
    kind: "single",
    cover: [496, 983, 584, 1004],
    fontSize: 32,
    minFontSize: 12,
    baseline: 1004,
    align: "left",
    textBox: [496, 972, 584, 1017],
  },
  {
    id: "senderAddress1",
    label: "Sender address — line 1",
    kind: "arabic",
    cover: [5, 1033, 576, 1064],
    fontSize: 28,
    minFontSize: 12,
    baseline: 1063,
    align: "left",
    weight: "400",
    textBox: [5, 1024, 576, 1070],
  },
  {
    id: "senderAddress2",
    label: "Sender address — line 2",
    kind: "arabic",
    cover: [6, 1067, 129, 1096],
    fontSize: 28,
    minFontSize: 12,
    baseline: 1095,
    align: "left",
    weight: "400",
    textBox: [5, 1070, 576, 1107],
  },
  {
    id: "senderAddress3",
    label: "Sender address — line 3",
    kind: "arabic",
    cover: [5, 1131, 302, 1152],
    fontSize: 20,
    minFontSize: 12,
    baseline: 1151,
    align: "left",
    weight: "400",
    textBox: [5, 1120, 576, 1160],
  },
  {
    id: "timestamp",
    label: "Footer date and time",
    kind: "single",
    cover: [549, 1473, 822, 1499],
    fontSize: 28,
    minFontSize: 12,
    baseline: 1496,
    align: "right",
    defaultValue: "2026-09-27 15:53:46",
    textBox: [545, 1467, 822, 1504],
  },
  {
    id: "remarks",
    label: "Remarks",
    kind: "multiline",
    box: [5, 1228, 890, 1430],
    fontSize: 24,
    lineHeight: 31,
  },
];

const canvas = document.getElementById("label-canvas");
const context = canvas.getContext("2d");
const overlayCanvas = document.createElement("canvas");
overlayCanvas.width = PAGE.widthPx;
overlayCanvas.height = PAGE.heightPx;
const overlayContext = overlayCanvas.getContext("2d");
const fieldList = document.getElementById("field-list");
const exportButton = document.getElementById("export-pdf");
const statusMessage = document.getElementById("status");
const form = document.getElementById("editor-form");
const invoiceForm = document.getElementById("invoice-form");
const invoiceFieldList = document.getElementById("invoice-field-list");
const invoiceAvailability = document.getElementById("invoice-availability");
const invoiceEditorPanel = document.getElementById("invoice-editor-panel");
const shippingEditorPanel = document.getElementById("shipping-editor-panel");
const labelPreview = document.getElementById("label-preview");
const invoicePreview = document.getElementById("invoice-preview");
const saForm = document.getElementById("sa-form");
const taxInvoiceForm = document.getElementById("tax-invoice-form");
const taxInvoiceFieldList = document.getElementById("tax-invoice-field-list");
const taxInvoiceAvailability = document.getElementById("tax-invoice-availability");
const taxInvoiceEditorPanel = document.getElementById("tax-invoice-editor-panel");
const taxInvoicePreview = document.getElementById("tax-invoice-preview");
const taxInvoiceCanvas = document.getElementById("tax-invoice-canvas");
const taxInvoiceContext = taxInvoiceCanvas.getContext("2d");
const taxInvoiceFieldsCanvas = document.getElementById("tax-invoice-fields-canvas");
const taxInvoiceFieldsContext = taxInvoiceFieldsCanvas.getContext("2d", { willReadFrequently: true });
const taxInvoiceTable = document.getElementById("tax-invoice-table-grid");
const saFieldList = document.getElementById("sa-field-list");
const saAvailability = document.getElementById("sa-availability");
const saEditorPanel = document.getElementById("sa-editor-panel");
const saPreview = document.getElementById("sa-preview");
const previewDescription = document.getElementById("preview-description");
const pageInfo = document.getElementById("page-info");
const modeControls = [...document.querySelectorAll('input[name="document-mode"]')];
const invoiceCanvases = [
  document.getElementById("invoice-canvas-1"),
  document.getElementById("invoice-canvas-2"),
];
const invoiceContexts = invoiceCanvases.map((invoiceCanvas) => invoiceCanvas.getContext("2d"));
const saPage = document.getElementById("sa-page");
const replacementData = Object.fromEntries(
  FIELD_DEFINITIONS.map(({ id, defaultValue = "" }) => [id, { enabled: false, value: defaultValue }])
);
const invoiceData = createInvoiceData();
const taxInvoiceData = createTaxInvoiceData();
const saReceiptData = createSaReceiptData(taxInvoiceData);

let originalPdfBytes;
let referenceImage;
let invoicePdfBytes;
let invoiceImages = [];
let invoiceSourceCalculations;
let saReceiptImage;
let taxInvoicePdfBytes;
let taxInvoiceImage;
let documentMode = "sa-receipt";
let invoiceLoadError;
let saReceiptLoadError;
let taxInvoiceLoadError;

function createFieldControls() {
  for (const field of FIELD_DEFINITIONS) {
    const group = document.createElement("div");
    group.className = "field-group";

    const title = document.createElement("div");
    title.className = "field-title";

    const label = document.createElement("label");
    label.htmlFor = `${field.id}-value`;
    label.textContent = field.label;

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "replace-toggle";
    toggleLabel.htmlFor = `${field.id}-replace`;

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.id = `${field.id}-replace`;
    toggle.dataset.replace = field.id;

    const toggleText = document.createElement("span");
    toggleText.textContent = "Replace";
    toggleLabel.append(toggle, toggleText);
    title.append(label, toggleLabel);
    group.append(title);

    const control = field.kind === "multiline"
      ? document.createElement("textarea")
      : document.createElement("input");
    control.id = `${field.id}-value`;
    control.className = "field-input";
    control.dataset.field = field.id;
    control.disabled = true;
    control.placeholder = field.kind === "multiline" ? "Enter replacement text" : "Enter replacement value";
    control.value = field.defaultValue || "";

    if (field.kind !== "multiline") {
      control.type = "text";
      control.maxLength = field.maxLength || 200;
    }

    if (field.pattern) {
      control.pattern = field.pattern;
      control.title = "Use 1–15 uppercase letters or digits.";
    }

    if (field.kind === "arabic") {
      control.dir = "rtl";
      control.lang = "ar";
    }

    group.append(control);
    fieldList.append(group);
  }
}

function isEdited() {
  return Object.values(replacementData).some((field) => field.enabled);
}

function isPoliceIdValid() {
  const field = replacementData.policeId;
  return !field.enabled || /^[A-Z0-9]{1,15}$/.test(field.value);
}

function getReplacement(fieldId) {
  return replacementData[fieldId].value;
}

function syncReplacementData() {
  for (const field of FIELD_DEFINITIONS) {
    replacementData[field.id] = {
      enabled: fieldList.querySelector(`[data-replace="${field.id}"]`).checked,
      value: fieldList.querySelector(`[data-field="${field.id}"]`).value,
    };
  }
}

function setStatus(message, state = "ready") {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

function updateControls() {
  if (documentMode === "invoice") {
    updateInvoiceControls();
    return;
  }
  if (documentMode === "sa-receipt") {
    updateSaReceiptControls();
    return;
  }
  if (documentMode === "tax-invoice-ref") {
    updateTaxInvoiceControls();
    return;
  }

  syncReplacementData();
  for (const toggle of fieldList.querySelectorAll("[data-replace]")) {
    const control = fieldList.querySelector(`[data-field="${toggle.dataset.replace}"]`);
    control.disabled = !toggle.checked;
  }

  const edited = isEdited();
  const policeIdValid = isPoliceIdValid();
  exportButton.textContent = edited ? "Export edited PDF" : "Export exact reference PDF";
  exportButton.disabled = !policeIdValid;
  if (!policeIdValid) {
    setStatus("The label ID must contain 1–15 uppercase letters or digits.", "error");
  } else {
    setStatus(
      edited
        ? "Selected fields will be replaced. If the label ID is selected, both barcodes are regenerated."
        : "No replacements selected. Export will be the original PDF file."
    );
  }
  renderPreview();
}

function syncInvoiceDataFromControls() {
  for (const control of invoiceFieldList.querySelectorAll("[data-invoice-path]")) {
    setInvoiceValue(invoiceData, control.dataset.invoicePath, control.value);
  }
}

function renderInvoicePreview(calculations) {
  if (invoiceImages.length !== 2 || !invoiceSourceCalculations) return;

  invoiceContexts.forEach((invoiceContext, index) => {
    if (!calculations) {
      invoiceContext.clearRect(0, 0, INVOICE_PAGE.widthPx, INVOICE_PAGE.heightPx);
      invoiceContext.drawImage(invoiceImages[index], 0, 0, INVOICE_PAGE.widthPx, INVOICE_PAGE.heightPx);
      return;
    }

    renderInvoicePage(
      invoiceContext,
      invoiceImages[index],
      invoiceData,
      calculations,
      invoiceSourceCalculations,
      index + 1
    );
  });
}

function updateInvoiceControls() {
  syncInvoiceDataFromControls();
  const validation = validateInvoice(invoiceData);
  const edited = invoiceHasChanges(invoiceData);
  renderInvoicePreview(validation.calculations);

  exportButton.textContent = edited ? "Export edited tax invoice PDF" : "Export exact tax invoice PDF";
  exportButton.disabled = !invoicePdfBytes || validation.errors.length > 0;
  if (validation.errors.length > 0) {
    setStatus(validation.errors[0], "error");
  } else {
    setStatus(
      edited
        ? "Invoice edits and calculated totals are shown on both pages."
        : "No invoice edits. Export will be the original two-page PDF."
    );
  }
}

function syncSaReceiptDataFromControls() {
  for (const control of saFieldList.querySelectorAll("[data-sa-path]")) {
    setSaReceiptValue(saReceiptData, control.dataset.saPath, control.value);
  }
}

function syncTaxInvoiceDataFromControls() {
  for (const control of taxInvoiceFieldList.querySelectorAll("[data-tax-invoice-path]")) {
    setTaxInvoiceValue(taxInvoiceData, control.dataset.taxInvoicePath, control.value);
  }
}

function renderSaReceiptPreview() {
  if (!saReceiptImage) return;
  renderSaReceiptPage(saPage, saReceiptData);
}

function renderTaxInvoicePreview() {
  if (!taxInvoiceImage) return;
  renderTaxInvoicePage(taxInvoiceContext, taxInvoiceImage, taxInvoiceData);
  renderTaxInvoiceOverlay(taxInvoiceFieldsContext, taxInvoiceData);
  renderTaxInvoiceTable(taxInvoiceTable, taxInvoiceData);
}

function updateSaReceiptControls() {
  syncSaReceiptDataFromControls();
  renderSaReceiptPreview();
  const validation = validateSaReceiptLayout(saPage, saReceiptData);

  exportButton.textContent = "Print / Save S&A receipt as PDF";
  exportButton.disabled = !saReceiptImage || validation.errors.length > 0;
  if (validation.errors.length > 0) {
    setStatus(validation.errors[0], "error");
  } else {
    setStatus("HTML receipt preview. Choose Print / Save as PDF to open the browser print dialog.");
  }
}

function updateTaxInvoiceControls() {
  syncTaxInvoiceDataFromControls();
  const edited = taxInvoiceHasChanges(taxInvoiceData);
  renderTaxInvoicePreview();
  exportButton.textContent = edited ? "Export styled electronic tax invoice" : "Export electronic tax invoice";
  exportButton.disabled = !taxInvoicePdfBytes;
  setStatus(edited
    ? "Invoice values are overlaid in fixed positions; the reference artwork and QR remain unchanged."
    : "Reference artwork and invoice values are ready for export. The QR code remains unchanged.");
}

function setDocumentMode(mode) {
  documentMode = mode;
  const invoiceMode = mode === "invoice";
  const saReceiptMode = mode === "sa-receipt";
  const taxInvoiceMode = mode === "tax-invoice-ref";
  const shippingMode = !invoiceMode && !saReceiptMode && !taxInvoiceMode;
  shippingEditorPanel.hidden = !shippingMode;
  invoiceEditorPanel.hidden = !invoiceMode;
  saEditorPanel.hidden = !saReceiptMode;
  taxInvoiceEditorPanel.hidden = !taxInvoiceMode;
  labelPreview.hidden = !shippingMode;
  invoicePreview.hidden = !invoiceMode;
  saPreview.hidden = !saReceiptMode;
  taxInvoicePreview.hidden = !taxInvoiceMode;
  previewDescription.textContent = taxInvoiceMode
    ? "The reference artwork and QR are retained; the table uses CSS cell borders, and the watermark sits behind its content."
    : invoiceMode
      ? "The supplied A4 artwork is preserved; edited values are overlaid in place."
      : saReceiptMode
      ? "A semantic HTML receipt follows the reference's measured layout and text sizes; no full-page image is used."
      : "Original artwork stays fixed; checked fields are replacements.";
  pageInfo.textContent = taxInvoiceMode
    ? "Reference page: 596 × 842 pt · one portrait A4-sized page"
    : invoiceMode
      ? "Reference: 2 portrait A4 pages · 595.28 × 841.89 pt each"
      : saReceiptMode
      ? "HTML receipt: 1 portrait page · 595 × 842 pt · browser print-to-PDF"
      : "Reference page: 215 × 369 pt · 75.847 × 130.175 mm";
  document.querySelector(".eyebrow").textContent = taxInvoiceMode
    ? "Electronic tax invoice"
    : invoiceMode
      ? "Carrefour Egypt tax invoice"
      : saReceiptMode
      ? "S&A receipt"
      : "J&T shipping label";
  updateControls();
}

function fontFor(field, size = field.fontSize) {
  const weight = field.weight || (field.kind === "arabic" ? "700" : "400");
  const family = field.fontFamily ? `"${field.fontFamily}"` : "Arial";
  return `${weight} ${size}px ${family}, sans-serif`;
}

function drawSingleLine(field, value, targetContext) {
  const [textX0, textY0, textX1, textY1] = field.textBox || field.cover;
  const width = textX1 - textX0;

  if (!value) return;

  targetContext.save();
  targetContext.beginPath();
  targetContext.rect(textX0, textY0, width, textY1 - textY0);
  targetContext.clip();
  targetContext.direction = field.kind === "arabic" ? "rtl" : "ltr";
  targetContext.textAlign = field.align;
  targetContext.textBaseline = "alphabetic";
  targetContext.fillStyle = "#000";

  let fontSize = field.fontSize;
  const availableAscent = field.baseline - textY0;
  const availableDescent = textY1 - field.baseline;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    targetContext.font = fontFor(field, fontSize);
    const metrics = targetContext.measureText(value);
    let scale = Math.min(1, width / metrics.width);
    if (metrics.actualBoundingBoxAscent > availableAscent) {
      scale = Math.min(scale, availableAscent / metrics.actualBoundingBoxAscent);
    }
    if (metrics.actualBoundingBoxDescent > availableDescent) {
      scale = Math.min(scale, availableDescent / metrics.actualBoundingBoxDescent);
    }
    if (scale >= 1 || fontSize <= field.minFontSize) break;
    fontSize = Math.max(field.minFontSize, fontSize * scale);
  }
  targetContext.font = fontFor(field, fontSize);

  const textX = field.align === "right"
    ? textX1
    : field.align === "center"
      ? (textX0 + textX1) / 2
      : textX0;
  targetContext.fillText(value, textX, field.baseline);
  targetContext.restore();
}

function drawBarcode(targetContext, symbols, start, extent, thickness, vertical, referenceModuleSize) {
  const runs = code128Runs(symbols);
  const totalModules = runs.reduce((sum, run) => sum + run.width, 0);
  const moduleSize = Math.min(referenceModuleSize, extent / totalModules);
  let offset = 0;

  targetContext.fillStyle = "#000";
  for (const run of runs) {
    const startPx = Math.round(offset * moduleSize);
    offset += run.width;
    const endPx = Math.round(offset * moduleSize);
    if (!run.bar) continue;

    if (vertical) {
      targetContext.fillRect(start[0], start[1] + startPx, thickness, endPx - startPx);
    } else {
      targetContext.fillRect(start[0] + startPx, start[1], endPx - startPx, thickness);
    }
  }
}

function coverPoliceId(field, targetContext) {
  targetContext.fillStyle = "#fff";
  for (const [x0, y0, x1, y1] of [
    field.barcodeCoverTop,
    field.barcodeCoverSide,
    field.cover,
  ]) {
    targetContext.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
}

function drawPoliceId(field, value, targetContext) {
  if (!/^[A-Z0-9]{1,15}$/.test(value)) return;

  drawBarcode(targetContext, encodeCode128A(value), [41, 176], 814, 94, false, 814 / 200);
  drawBarcode(targetContext, encodeCode128BWithNumericCompression(value), [704, 499], 585, 145, true, 585 / 145);
  drawSingleLine(field, value, targetContext);
}

function wrapRemarks(text, maxWidth, targetContext) {
  const lines = [];
  for (const paragraph of text.split(/\r?\n/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }

    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (targetContext.measureText(candidate).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
}

function drawRemarks(field, value, targetContext) {
  const [x0, y0, x1, y1] = field.box;
  if (!value) return;

  targetContext.save();
  targetContext.beginPath();
  targetContext.rect(x0, y0, x1 - x0, y1 - y0);
  targetContext.clip();
  targetContext.direction = "ltr";
  targetContext.textAlign = "left";
  targetContext.textBaseline = "alphabetic";
  targetContext.fillStyle = "#000";
  targetContext.font = fontFor(field);

  const lines = wrapRemarks(value, x1 - x0, targetContext);
  let baseline = 1255;
  for (const line of lines) {
    if (baseline > y1) break;
    targetContext.fillText(line, x0, baseline);
    baseline += field.lineHeight;
  }
  targetContext.restore();
}

function renderReplacementLayer(targetContext, drawCovers) {
  targetContext.clearRect(0, 0, PAGE.widthPx, PAGE.heightPx);
  const activeFields = FIELD_DEFINITIONS.filter((field) => (
    replacementData[field.id].enabled
    && (field.kind !== "barcode" || /^[A-Z0-9]{1,15}$/.test(replacementData[field.id].value))
  ));
  if (drawCovers) {
    targetContext.fillStyle = "#fff";
    for (const field of activeFields) {
      if (field.kind === "barcode") {
        coverPoliceId(field, targetContext);
      } else if (field.cover) {
        const [x0, y0, x1, y1] = field.cover;
        targetContext.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    }
  }

  for (const field of activeFields) {
    const value = getReplacement(field.id);
    if (field.kind === "barcode") drawPoliceId(field, value, targetContext);
    else if (field.kind === "multiline") drawRemarks(field, value, targetContext);
    else drawSingleLine(field, value, targetContext);
  }
}

function renderPreview() {
  if (!referenceImage) return;

  renderReplacementLayer(overlayContext, true);
  context.clearRect(0, 0, PAGE.widthPx, PAGE.heightPx);
  context.drawImage(referenceImage, 0, 0, PAGE.widthPx, PAGE.heightPx);
  context.drawImage(overlayCanvas, 0, 0);
}

function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function printSaReceipt() {
  const originalTitle = document.title;
  let printFinished = false;
  const finishPrint = () => {
    if (printFinished) return;
    printFinished = true;
    document.body.classList.remove("print-sa-receipt");
    document.title = originalTitle;
    setStatus("Print dialog closed. A PDF is saved only if you chose Save as PDF.");
  };
  document.body.classList.add("print-sa-receipt");
  document.title = "S&A receipt";
  window.addEventListener("afterprint", finishPrint, { once: true });
  setStatus("Choose Save as PDF in the browser print dialog to create the 595 × 842 pt receipt.");
  try {
    window.print();
  } catch (error) {
    window.removeEventListener("afterprint", finishPrint);
    finishPrint();
    throw error;
  }
}

async function exportEditedPdf() {
  if (!window.PDFLib?.PDFDocument) {
    throw new Error("The PDF editing library did not load. Check the connection and try again.");
  }

  if (!isPoliceIdValid()) {
    throw new Error("The label ID must contain 1–15 uppercase letters or digits.");
  }

  renderPreview();
  const overlayBlob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not encode the edited label as a PNG."));
    }, "image/png");
  });
  const overlayBytes = new Uint8Array(await overlayBlob.arrayBuffer());
  const pdf = await window.PDFLib.PDFDocument.load(new Uint8Array(originalPdfBytes));
  const page = pdf.getPage(0);
  const overlay = await pdf.embedPng(overlayBytes);

  page.drawImage(overlay, {
    x: 0,
    y: 0,
    width: PAGE.widthPt,
    height: PAGE.heightPt,
  });

  return pdf.save();
}

async function exportEditedInvoicePdf() {
  if (!window.PDFLib?.PDFDocument) {
    throw new Error("The PDF editing library did not load. Check the connection and try again.");
  }
  if (!invoicePdfBytes) {
    throw new Error("The invoice reference PDF is not available.");
  }

  renderInvoicePreview(validateInvoice(invoiceData).calculations);
  const overlayBytes = await Promise.all(invoiceCanvases.map((invoiceCanvas) => new Promise((resolve, reject) => {
    invoiceCanvas.toBlob((blob) => {
      if (blob) resolve(blob.arrayBuffer());
      else reject(new Error("Could not encode an edited invoice page as PNG."));
    }, "image/png");
  })));
  const pdf = await window.PDFLib.PDFDocument.load(new Uint8Array(invoicePdfBytes));
  const pages = pdf.getPages();
  if (pages.length !== 2) {
    throw new Error(`The invoice reference has ${pages.length} pages; expected 2.`);
  }

  for (const [index, page] of pages.entries()) {
    const { width, height } = page.getSize();
    if (Math.abs(width - INVOICE_PAGE.widthPt) > 0.02 || Math.abs(height - INVOICE_PAGE.heightPt) > 0.02) {
      throw new Error(`Invoice page ${index + 1} is ${width} × ${height} pt; expected 595.28 × 841.89 pt.`);
    }

    const overlay = await pdf.embedPng(new Uint8Array(overlayBytes[index]));
    page.drawImage(overlay, {
      x: 0,
      y: 0,
      width: INVOICE_PAGE.widthPt,
      height: INVOICE_PAGE.heightPt,
    });
  }

  return pdf.save();
}

async function exportEditedTaxInvoicePdf() {
  if (!window.PDFLib?.PDFDocument) {
    throw new Error("The PDF editing library did not load. Check the connection and try again.");
  }
  if (!window.html2canvas) {
    throw new Error("The HTML rendering library did not load. Check the connection and try again.");
  }
  if (!taxInvoicePdfBytes || !taxInvoiceImage) {
    throw new Error("The tax invoice reference is not available.");
  }

  renderTaxInvoicePreview();
  verifyTaxInvoiceOverlay(taxInvoiceFieldsContext);
  const frame = taxInvoicePreview.querySelector(".tax-invoice-frame");
  const frameBounds = frame.getBoundingClientRect();
  const captureFrame = frame.cloneNode(true);
  const sourceCanvases = frame.querySelectorAll("canvas");
  const captureCanvases = captureFrame.querySelectorAll("canvas");
  if (sourceCanvases.length !== captureCanvases.length) {
    throw new Error("The tax invoice preview layers could not be copied for export.");
  }
  captureCanvases.forEach((canvas, index) => {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("The tax invoice preview canvas could not be prepared for export.");
    }
    context.drawImage(sourceCanvases[index], 0, 0);
  });
  Object.assign(captureFrame.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: `${TAX_INVOICE_PAGE.widthPx}px`,
    maxWidth: "none",
    margin: "0",
    boxShadow: "none",
  });
  captureFrame.classList.add("tax-invoice-export-capture");
  document.body.append(captureFrame);
  let pageCanvas;
  try {
    const captureBounds = captureFrame.getBoundingClientRect();
    if (
      Math.abs(captureBounds.width - TAX_INVOICE_PAGE.widthPx) > 0.05
      || Math.abs(captureBounds.height - TAX_INVOICE_PAGE.heightPx) > 0.05
    ) {
      throw new Error(`Scaled preview is ${captureBounds.width} × ${captureBounds.height} px; expected 2384 × 3368 px.`);
    }
    pageCanvas = await window.html2canvas(captureFrame, {
      backgroundColor: "#ffffff",
      logging: false,
      scale: 1,
      width: TAX_INVOICE_PAGE.widthPx,
      height: TAX_INVOICE_PAGE.heightPx,
    });
  } finally {
    captureFrame.remove();
  }
  if (pageCanvas.width !== TAX_INVOICE_PAGE.widthPx || pageCanvas.height !== TAX_INVOICE_PAGE.heightPx) {
    throw new Error(`Export preview image is ${pageCanvas.width} × ${pageCanvas.height} px; expected 2384 × 3368 px.`);
  }
  const pageBlob = await new Promise((resolve, reject) => {
    pageCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not encode the completed invoice page as a PNG."));
    }, "image/png");
  });
  const pageBytes = new Uint8Array(await pageBlob.arrayBuffer());
  let sourcePdf;
  try {
    sourcePdf = await window.PDFLib.PDFDocument.load(
      new Uint8Array(taxInvoicePdfBytes),
      { ignoreEncryption: true }
    );
  } catch (error) {
    throw new Error(`The restricted source PDF could not be opened for edits: ${error.message}`);
  }

  const pages = sourcePdf.getPages();
  if (pages.length !== 1) {
    throw new Error(`The invoice reference has ${pages.length} pages; expected 1.`);
  }
  const { width, height } = pages[0].getSize();
  if (Math.abs(width - TAX_INVOICE_PAGE.widthPt) > 0.05 || Math.abs(height - TAX_INVOICE_PAGE.heightPt) > 0.05) {
    throw new Error(`Invoice page is ${width} × ${height} pt; expected 596 × 842 pt.`);
  }

  const outputPdf = await window.PDFLib.PDFDocument.create();
  const outputPage = outputPdf.addPage([width, height]);
  const completedPage = await outputPdf.embedPng(pageBytes);
  outputPage.drawImage(completedPage, {
    x: 0,
    y: 0,
    width,
    height,
  });
  drawTaxInvoicePdfBorders(outputPage, frame, frameBounds);
  const outputBytes = await outputPdf.save();
  const checkPdf = await window.PDFLib.PDFDocument.load(outputBytes, { ignoreEncryption: true });
  const checkPages = checkPdf.getPages();
  const outputSize = checkPages[0]?.getSize();
  if (
    checkPages.length !== 1
    || Math.abs(outputSize.width - TAX_INVOICE_PAGE.widthPt) > 0.05
    || Math.abs(outputSize.height - TAX_INVOICE_PAGE.heightPt) > 0.05
  ) {
    throw new Error("The edited invoice failed its one-page 596 × 842 pt output check.");
  }
  return outputBytes;
}

function drawTaxInvoicePdfBorders(outputPage, frame, frameBounds) {
  const borderColor = getComputedStyle(frame).getPropertyValue("--tax-invoice-grid-color").trim();
  const colorMatch = /^#([0-9a-f]{6})$/i.exec(borderColor);
  if (!colorMatch) {
    throw new Error(`Unsupported tax invoice border color: ${borderColor}`);
  }

  const hex = colorMatch[1];
  const color = window.PDFLib.rgb(
    Number.parseInt(hex.slice(0, 2), 16) / 255,
    Number.parseInt(hex.slice(2, 4), 16) / 255,
    Number.parseInt(hex.slice(4, 6), 16) / 255
  );
  const pointsPerPixel = TAX_INVOICE_PAGE.widthPt / frameBounds.width;
  const drawnSegments = new Set();
  const toPoint = (x, y) => ({
    x: x * pointsPerPixel,
    y: TAX_INVOICE_PAGE.heightPt - y * pointsPerPixel,
  });
  const drawLine = (x1, y1, x2, y2) => {
    const start = toPoint(x1, y1);
    const end = toPoint(x2, y2);
    const forward = [start.x, start.y, end.x, end.y].map((value) => value.toFixed(3)).join(",");
    const reverse = [end.x, end.y, start.x, start.y].map((value) => value.toFixed(3)).join(",");
    const key = forward < reverse ? forward : reverse;
    if (drawnSegments.has(key)) return;
    drawnSegments.add(key);
    outputPage.drawLine({ start, end, thickness: TAX_INVOICE_EXPORT_BORDER_WIDTH_PT, color });
  };
  const relativeBounds = (element) => {
    const bounds = element.getBoundingClientRect();
    return {
      left: bounds.left - frameBounds.left,
      top: bounds.top - frameBounds.top,
      right: bounds.right - frameBounds.left,
      bottom: bounds.bottom - frameBounds.top,
    };
  };
  const addEdges = (bounds, edges) => {
    if (edges.includes("top")) drawLine(bounds.left, bounds.top, bounds.right, bounds.top);
    if (edges.includes("right")) drawLine(bounds.right, bounds.top, bounds.right, bounds.bottom);
    if (edges.includes("bottom")) drawLine(bounds.left, bounds.bottom, bounds.right, bounds.bottom);
    if (edges.includes("left")) drawLine(bounds.left, bounds.top, bounds.left, bounds.bottom);
  };
  const references = frame.querySelector(".tax-invoice-references-border");
  const buyerHeading = frame.querySelector(".tax-invoice-buyer-heading-border");
  const table = frame.querySelector("#tax-invoice-table-grid");
  if (!references || !buyerHeading || !table) {
    throw new Error("Tax invoice border elements are missing from the export preview.");
  }

  const headerCells = table.querySelectorAll("thead th");
  const firstHeaderCell = headerCells[0];
  const lastHeaderCell = headerCells[headerCells.length - 1];
  const finalRow = table.querySelector("tbody tr:last-child");
  if (!firstHeaderCell || !lastHeaderCell || !finalRow) {
    throw new Error("Tax invoice table rows are missing from the export preview.");
  }

  const finalCells = finalRow.querySelectorAll("td:not(.tax-invoice-grid-empty)");
  const lastVisibleCell = finalCells[finalCells.length - 1];
  if (!lastVisibleCell) {
    throw new Error("The final tax invoice table row has no bordered cells.");
  }

  const referencesBounds = relativeBounds(references);
  const buyerBounds = relativeBounds(buyerHeading);
  const tableBounds = relativeBounds(table);
  const firstHeaderBounds = relativeBounds(firstHeaderCell);
  const lastHeaderBounds = relativeBounds(lastHeaderCell);
  const lastCellBounds = relativeBounds(lastVisibleCell);
  addEdges(referencesBounds, ["top", "right"]);
  addEdges(buyerBounds, ["top", "right", "bottom", "left"]);
  drawLine(buyerBounds.right, buyerBounds.bottom, lastHeaderBounds.right, firstHeaderBounds.top);

  addEdges({
    left: firstHeaderBounds.left,
    right: lastHeaderBounds.right,
    top: firstHeaderBounds.top,
    bottom: lastCellBounds.bottom,
  }, ["top", "right", "bottom", "left"]);
  for (const cell of table.querySelectorAll("th, td:not(.tax-invoice-grid-empty)")) {
    addEdges(relativeBounds(cell), ["top", "right", "bottom", "left"]);
  }
  if (tableBounds.right < lastHeaderBounds.right || tableBounds.bottom < lastCellBounds.bottom) {
    throw new Error("Tax invoice table border geometry is invalid.");
  }
}

async function handleExport() {
  exportButton.disabled = true;
  const activeForm = documentMode === "invoice"
    ? invoiceForm
    : documentMode === "sa-receipt"
      ? saForm
      : documentMode === "tax-invoice-ref"
        ? taxInvoiceForm
        : null;
  activeForm?.querySelectorAll("input, textarea").forEach((control) => {
    control.disabled = true;
  });
  try {
    if (documentMode === "tax-invoice-ref") {
      setStatus("Building the styled invoice PDF…");
      const editedBytes = await exportEditedTaxInvoicePdf();
      downloadPdf(editedBytes, "tax-invoice-styled.pdf");
      setStatus("Styled invoice exported with invoice data, QR, the rebuilt HTML table, and the CSS watermark.");
    } else if (documentMode === "invoice") {
      const validation = validateInvoice(invoiceData);
      if (validation.errors.length > 0) {
        throw new Error(validation.errors[0]);
      }

      if (invoiceHasChanges(invoiceData)) {
        setStatus("Building the edited two-page tax invoice…");
        const editedBytes = await exportEditedInvoicePdf();
        downloadPdf(editedBytes, "carrefour-tax-invoice-edited.pdf");
        setStatus("Edited two-page tax invoice exported with recalculated totals and barcodes.");
      } else {
        downloadPdf(invoicePdfBytes.slice(0), "carrefour-tax-invoice.pdf");
        setStatus("Original two-page tax invoice exported unchanged.");
      }
    } else if (documentMode === "sa-receipt") {
      const validation = validateSaReceiptLayout(saPage, saReceiptData);
      if (validation.errors.length > 0) {
        throw new Error(validation.errors[0]);
      }
      printSaReceipt();
    } else if (isEdited()) {
      setStatus("Building the edited PDF…");
      const editedBytes = await exportEditedPdf();
      downloadPdf(editedBytes, "shipping-label-edited.pdf");
      setStatus("Edited PDF exported with selected fields and updated barcodes where requested.");
    } else {
      downloadPdf(originalPdfBytes.slice(0), "shipping-label.pdf");
      setStatus("Original reference PDF exported unchanged.");
    }
  } catch (error) {
    console.error("PDF export failed:", error);
    setStatus(error instanceof Error ? error.message : "PDF export failed.", "error");
  } finally {
    invoiceForm.querySelectorAll("input, textarea").forEach((control) => {
      control.disabled = false;
    });
    saForm.querySelectorAll("input, textarea").forEach((control) => {
      control.disabled = false;
    });
    taxInvoiceForm.querySelectorAll("input, textarea").forEach((control) => {
      control.disabled = false;
    });
    exportButton.disabled = documentMode === "tax-invoice-ref"
      ? !taxInvoicePdfBytes
      : documentMode === "invoice"
        ? !invoicePdfBytes || validateInvoice(invoiceData).errors.length > 0
        : documentMode === "sa-receipt"
        ? !saReceiptImage || validateSaReceiptLayout(saPage, saReceiptData).errors.length > 0
        : !originalPdfBytes || !isPoliceIdValid();
  }
}

async function loadReference() {
  const [pdfResponse, image] = await Promise.all([
    fetch("reference/avalon-jt.pdf"),
    new Promise((resolve, reject) => {
      const loadedImage = new Image();
      loadedImage.onload = () => resolve(loadedImage);
      loadedImage.onerror = () => reject(new Error("Could not load the extracted reference artwork."));
      loadedImage.src = "assets/reference-raster.png";
    }),
  ]);

  if (!pdfResponse.ok) {
    throw new Error(`Could not load the reference PDF (${pdfResponse.status}).`);
  }

  originalPdfBytes = await pdfResponse.arrayBuffer();
  referenceImage = image;
  if (image.naturalWidth !== PAGE.widthPx || image.naturalHeight !== PAGE.heightPx) {
    throw new Error(`Reference raster dimensions are ${image.naturalWidth} × ${image.naturalHeight}; expected 895 × 1537.`);
  }
}

function loadImage(path, label) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${label}.`));
    image.src = path;
  });
}

async function loadInvoiceReference() {
  const [pdfResponse, pageOne, pageTwo] = await Promise.all([
    fetch("reference/invoice-reference.pdf"),
    loadImage("assets/invoice-page-1.jpg", "invoice page 1 artwork"),
    loadImage("assets/invoice-page-2.jpg", "invoice page 2 artwork"),
  ]);
  if (!pdfResponse.ok) {
    throw new Error(`Could not load the invoice reference PDF (${pdfResponse.status}).`);
  }

  const images = [pageOne, pageTwo];
  for (const [index, image] of images.entries()) {
    if (image.naturalWidth !== INVOICE_PAGE.widthPx || image.naturalHeight !== INVOICE_PAGE.heightPx) {
      throw new Error(
        `Invoice page ${index + 1} artwork is ${image.naturalWidth} × ${image.naturalHeight}; expected 2381 × 3367.`
      );
    }
  }

  const sourceCalculations = calculateInvoice(INVOICE_DEFAULT_DATA);
  if (sourceCalculations.errors.length > 0) {
    throw new Error(`Invoice source values are invalid: ${sourceCalculations.errors[0]}`);
  }

  invoicePdfBytes = await pdfResponse.arrayBuffer();
  invoiceImages = images;
  invoiceSourceCalculations = sourceCalculations;
}

async function loadTaxInvoiceReference() {
  const [pdfResponse, image, regularFontResponse, boldFontResponse] = await Promise.all([
    fetch("reference/tax-invoice-ref.pdf"),
    loadImage("assets/tax-invoice-ref.png", "electronic tax invoice artwork"),
    fetch("assets/DejaVuSans.ttf"),
    fetch("assets/DejaVuSans-Bold.ttf"),
  ]);
  if (!pdfResponse.ok) {
    throw new Error(`Could not load the electronic tax invoice PDF (${pdfResponse.status}).`);
  }
  if (!regularFontResponse.ok || !boldFontResponse.ok) {
    const failedResponse = !regularFontResponse.ok ? regularFontResponse : boldFontResponse;
    throw new Error(`Could not load the electronic tax invoice font (${failedResponse.status}).`);
  }
  if (image.naturalWidth !== TAX_INVOICE_PAGE.widthPx || image.naturalHeight !== TAX_INVOICE_PAGE.heightPx) {
    throw new Error(
      `Electronic tax invoice artwork is ${image.naturalWidth} × ${image.naturalHeight}; expected 2384 × 3368.`
    );
  }
  const regularFont = new Uint8Array(await regularFontResponse.arrayBuffer());
  const boldFont = new Uint8Array(await boldFontResponse.arrayBuffer());
  const regularFace = new FontFace("Electronic Invoice DejaVu Sans", regularFont, { weight: "400" });
  const boldFace = new FontFace("Electronic Invoice DejaVu Sans", boldFont, { weight: "700" });
  await Promise.all([regularFace.load(), boldFace.load()]);
  document.fonts.add(regularFace);
  document.fonts.add(boldFace);
  taxInvoicePdfBytes = await pdfResponse.arrayBuffer();
  taxInvoiceImage = image;
}

async function loadSaReceiptAssets() {
  if (!window.PDFLib?.PDFDocument) {
    throw new Error("The PDF editing library did not load. Check the connection and try again.");
  }
  const [pdfResponse, image] = await Promise.all([
    fetch("reference/s-and-a-reference.pdf"),
    loadImage("assets/s-and-a-reference.jpg", "S&A receipt scan"),
  ]);
  if (!pdfResponse.ok) {
    throw new Error(`Could not load the S&A receipt PDF (${pdfResponse.status}).`);
  }
  if (image.naturalWidth !== SA_RECEIPT_PAGE.imageWidthPx || image.naturalHeight !== SA_RECEIPT_PAGE.imageHeightPx) {
    throw new Error(
      `S&A receipt scan is ${image.naturalWidth} × ${image.naturalHeight}; expected 1691 × 3000.`
    );
  }
  const referenceBytes = await pdfResponse.arrayBuffer();
  const referencePdf = await window.PDFLib.PDFDocument.load(new Uint8Array(referenceBytes));
  const pages = referencePdf.getPages();
  const pageSize = pages[0]?.getSize();
  if (
    pages.length !== 1
    || Math.abs(pageSize.width - SA_RECEIPT_PAGE.widthPt) > 0.02
    || Math.abs(pageSize.height - SA_RECEIPT_PAGE.heightPt) > 0.02
  ) {
    throw new Error("The S&A receipt reference must remain one page at 595 × 842 pt.");
  }
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = SA_RECEIPT_PAGE.imageWidthPx;
  sourceCanvas.height = SA_RECEIPT_PAGE.imageHeightPx;
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceContext) {
    throw new Error("The S&A reference QR could not be read in this browser.");
  }
  sourceContext.drawImage(image, 0, 0);
  saReceiptImage = image;
  setSaReceiptQrVector(sourceContext);
}

async function start() {
  createFieldControls();
  createInvoiceControls(invoiceFieldList, invoiceData);
  createSaReceiptControls(saFieldList, saReceiptData);
  createTaxInvoiceControls(taxInvoiceFieldList, taxInvoiceData);
  const invoiceLoad = loadInvoiceReference().then(
    () => ({ ok: true }),
    (error) => ({ ok: false, error })
  );
  const saReceiptLoad = loadSaReceiptAssets().then(
    () => ({ ok: true }),
    (error) => ({ ok: false, error })
  );
  const taxInvoiceLoad = loadTaxInvoiceReference().then(
    () => ({ ok: true }),
    (error) => ({ ok: false, error })
  );
  await loadReference();
  const invoiceResult = await invoiceLoad;
  if (!invoiceResult.ok) {
    invoiceLoadError = invoiceResult.error;
    const invoiceMode = modeControls.find((control) => control.value === "invoice");
    invoiceMode.disabled = true;
    invoiceAvailability.hidden = false;
    invoiceAvailability.textContent = `Tax invoice unavailable: ${
      invoiceLoadError instanceof Error ? invoiceLoadError.message : "unknown loading error"
    }`;
  }
  const saReceiptResult = await saReceiptLoad;
  if (!saReceiptResult.ok) {
    saReceiptLoadError = saReceiptResult.error;
    const saReceiptMode = modeControls.find((control) => control.value === "sa-receipt");
    saReceiptMode.disabled = true;
    saAvailability.hidden = false;
    saAvailability.textContent = `S&A receipt unavailable: ${
      saReceiptLoadError instanceof Error ? saReceiptLoadError.message : "unknown loading error"
    }`;
  }
  const taxInvoiceResult = await taxInvoiceLoad;
  if (!taxInvoiceResult.ok) {
    taxInvoiceLoadError = taxInvoiceResult.error;
    const taxInvoiceMode = modeControls.find((control) => control.value === "tax-invoice-ref");
    taxInvoiceMode.disabled = true;
    taxInvoiceAvailability.hidden = false;
    taxInvoiceAvailability.textContent = `Electronic tax invoice unavailable: ${
      taxInvoiceLoadError instanceof Error ? taxInvoiceLoadError.message : "unknown loading error"
    }`;
  }
  renderPreview();
  updateControls();
}

fieldList.addEventListener("change", updateControls);
fieldList.addEventListener("input", updateControls);
invoiceForm.addEventListener("input", updateControls);
invoiceForm.addEventListener("submit", (event) => event.preventDefault());
saForm.addEventListener("input", updateControls);
saForm.addEventListener("submit", (event) => event.preventDefault());
taxInvoiceForm.addEventListener("input", updateControls);
taxInvoiceForm.addEventListener("submit", (event) => event.preventDefault());
for (const modeControl of modeControls) {
  modeControl.addEventListener("change", () => {
    if (modeControl.checked) setDocumentMode(modeControl.value);
  });
}
exportButton.addEventListener("click", handleExport);
form.addEventListener("submit", (event) => event.preventDefault());

start().then(() => setDocumentMode("sa-receipt")).catch((error) => {
  console.error("Application initialization failed:", error);
  exportButton.disabled = true;
  setStatus(error instanceof Error ? error.message : "Application initialization failed.", "error");
});
