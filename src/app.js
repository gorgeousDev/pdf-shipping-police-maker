import { code128Runs, encodeCode128A, encodeCode128BWithNumericCompression } from "./barcode.js";

const PAGE = { widthPt: 215, heightPt: 369, widthPx: 895, heightPx: 1537 };
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
const replacementData = Object.fromEntries(
  FIELD_DEFINITIONS.map(({ id, defaultValue = "" }) => [id, { enabled: false, value: defaultValue }])
);

let originalPdfBytes;
let referenceImage;

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

async function handleExport() {
  exportButton.disabled = true;
  try {
    if (isEdited()) {
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
    exportButton.disabled = !isPoliceIdValid();
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

async function start() {
  createFieldControls();
  await loadReference();
  renderPreview();
  exportButton.disabled = false;
  updateControls();
}

fieldList.addEventListener("change", updateControls);
fieldList.addEventListener("input", updateControls);
exportButton.addEventListener("click", handleExport);
form.addEventListener("submit", (event) => event.preventDefault());

start().catch((error) => {
  console.error("Application initialization failed:", error);
  exportButton.disabled = true;
  setStatus(error instanceof Error ? error.message : "Application initialization failed.", "error");
});
