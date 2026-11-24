export const SA_RECEIPT_PAGE = Object.freeze({
  widthPt: 595,
  heightPt: 842,
  sourceWidthPx: 1691,
  sourceHeightPx: 3000,
  imageWidthPx: 1691,
  imageHeightPx: 3000,
  sourceXPt: 60.19633,
  sourceWidthPt: 474.60733,
  sourceScalePt: 474.60733 / 1691,
  previewScale: 2,
  previewWidth: 1190,
  previewHeight: 1684,
});

const SA_RECEIPT_VAT_RATE = 0.14;
const SA_RECEIPT_MONEY_DECIMALS = 2;

function roundSaMoney(value) {
  const factor = 10 ** SA_RECEIPT_MONEY_DECIMALS;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatSaMoney(value) {
  return roundSaMoney(Number(value) || 0).toFixed(SA_RECEIPT_MONEY_DECIMALS);
}

function buildSaReceiptData(source) {
  const items = source.items.map((item) => ({
    description: item.description,
    quantity: formatSaMoney(item.quantity),
    unitPrice: formatSaMoney(item.unitPrice),
    total: formatSaMoney(item.quantity * item.unitPrice),
  }));
  const salesTotal = items.reduce((sum, item) => sum + Number(item.total), 0);
  const discountTotal = roundSaMoney(source.discountTotal ?? 0);
  const taxableTotal = salesTotal - discountTotal;
  const vatAmount = roundSaMoney(taxableTotal * SA_RECEIPT_VAT_RATE);
  const netTotal = roundSaMoney(taxableTotal + vatAmount);
  return {
    date: source.date,
    time: source.time,
    receiptNumber: source.receiptNumber,
    cashier: source.cashier,
    registerNumber: source.registerNumber,
    customerCode: source.customerCode,
    transactionCustomer: source.transactionCustomer,
    items,
    salesTotal: formatSaMoney(salesTotal),
    discountTotal: formatSaMoney(discountTotal),
    vatAmount: formatSaMoney(vatAmount),
    netTotal: formatSaMoney(netTotal),
    paidAmount: formatSaMoney(netTotal),
    returnAmount: "0.00",
  };
}

const SA_RECEIPT_SOURCE_DATA = {
  date: "2026-09-27",
  time: "02:00 AM",
  receiptNumber: "GLETH-000000090",
  cashier: "حسام محمد حسام محمد",
  registerNumber: "Glem001",
  customerCode: "6159",
  transactionCustomer: "زياد هشام فوزى محمود الشافعى -",
  items: [
    { description: "زجاجة مياه حراري ستانلس سمارت فيت Smart Fit Pink 1000ml", quantity: 15, unitPrice: 200 },
    { description: "CASIO آلة حاسبة FX-991 ES PLUS", quantity: 150, unitPrice: 1201.754 },
    { description: "خدمة توصيل 19891", quantity: 60, unitPrice: 0.8781 },
  ],
  discountTotal: 0,
};

export const SA_RECEIPT_DEFAULT_DATA = Object.freeze(buildSaReceiptData(SA_RECEIPT_SOURCE_DATA));

const MONEY_PATHS = [
  ...SA_RECEIPT_DEFAULT_DATA.items.flatMap((_, index) => [
    `items.${index}.quantity`,
    `items.${index}.unitPrice`,
    `items.${index}.total`,
  ]),
  "salesTotal",
  "discountTotal",
  "vatAmount",
  "netTotal",
  "paidAmount",
  "returnAmount",
];
const DECIMAL_PATTERN = /^\d+(?:\.\d{1,2})?$/;
const MONEY_LABELS = {
  salesTotal: "Sales total",
  discountTotal: "Discount total",
  vatAmount: "VAT amount",
  netTotal: "Net / payable total",
  paidAmount: "Paid amount",
  returnAmount: "Return / exchange amount",
  quantity: "Quantity",
  unitPrice: "Unit price",
  total: "Line total",
};

const INK = "#111111";
const FONT_ARABIC = '"SA Arabic", "DejaVu Sans Condensed", Arial, sans-serif';
const FONT_LATIN = '"SA Latin", "DejaVu Sans Condensed", Arial, sans-serif';
const FONT_TABLE_NUMBER = '"SA Latin Narrow", "Liberation Sans Narrow", Arial, sans-serif';
const QR_BOUNDS = Object.freeze([88, 430, 316, 800]);
const TABLE_START_Y = 1277;
const TABLE_END_Y = 1635;
const TABLE_TEXT_SIZE = 58;
const TABLE_NUMBER_SIZE = 71;
const TABLE_LINE_HEIGHT = 52;
const TABLE_COLUMNS = Object.freeze({
  total: [85, 370],
  unitPrice: [380, 650],
  quantity: [690, 910],
  description: [1120, 1675],
});
const RECEIPT_LAYOUT = Object.freeze({
  company: { text: "شركة اس اند ايه للتجارة ترحب بكم", x: 1675, y: 497, size: 60, align: "right", direction: "rtl", weight: "700" },
  dateLabel: { text: "التاريخ :", x: 1510, y: 573, size: 58, align: "right", direction: "rtl", weight: "700" },
  timeLabel: { text: "الوقت :", x: 790, y: 573, size: 58, align: "right", direction: "rtl", weight: "700" },
  receiptLabel: { text: "رقم البون :", x: 850, y: 670, size: 58, align: "right", direction: "rtl", weight: "700" },
  cashierLabel: { text: "اسم الكاشير :", x: 1450, y: 755, size: 58, align: "right", direction: "rtl", weight: "700" },
  registerLabel: { text: "رقم الخزينة :", x: 1300, y: 845, size: 58, align: "right", direction: "rtl", weight: "700" },
  customerCodeLabel: { text: "كود العميل :", x: 560, y: 938, size: 58, align: "right", direction: "rtl", weight: "700" },
  transactionLabel: { text: "نوع المعاملة : (اسم العميل)", x: 1675, y: 1042, size: 58, align: "right", direction: "rtl", weight: "700" },
  headings: [
    { text: "الإجمالي", x: 360, y: 1225, size: 56, align: "right", direction: "rtl", weight: "700" },
    { text: "السعر", x: 640, y: 1225, size: 56, align: "right", direction: "rtl", weight: "700" },
    { text: "الكمية", x: 900, y: 1225, size: 56, align: "right", direction: "rtl", weight: "700" },
    { text: "اسم الصنف", x: 1665, y: 1225, size: 56, align: "right", direction: "rtl", weight: "700" },
  ],
  totals: [
    { path: "salesTotal", label: "إجمالي المبيعات :", labelX: 1675, y: 1720, labelSize: 60, size: 74, weight: "700" },
    { path: "discountTotal", label: "إجمالي الخصم :", labelX: 1675, y: 1810, labelSize: 60, size: 74, weight: "700" },
    { path: "vatAmount", label: "ضريبة القيمة المضافة 14% :", labelX: 1675, y: 1900, labelSize: 60, size: 74, weight: "700" },
    { path: "netTotal", label: "الصافي", labelX: 1675, y: 1990, labelSize: 62, size: 74, weight: "700" },
  ],
  paid: { label: "المدفوع", labelX: 1675, y: 2160, size: 60, valueSize: 74, valueWeight: "700" },
  returnLine: { text: "استبدال وارجاع البضاعة خلال 30 يوم من خلال الفرع", x: 80, y: 2350, size: 52, align: "left", direction: "rtl", weight: "700" },
  footer: [
    { text: "Now online store www.samirandaly.com", x: 80, y: 2534, size: 52, align: "left", family: "latin", weight: "400" },
    { text: "731-227-697     س.ت : 122281     ب.ض :", x: 1675, y: 2620, size: 51, align: "right", direction: "rtl", weight: "400" },
    { text: "في حالة الاسترجاع والاستبدال يتم من خلال الفرع المشتراة منه", x: 1675, y: 2728, size: 51, align: "right", direction: "rtl", weight: "700" },
    { text: "نسبة الخصم : 0.00", x: 1675, y: 2810, size: 50, align: "right", direction: "rtl", weight: "400" },
    { text: "بون البيع", x: 1675, y: 2890, size: 50, align: "right", direction: "rtl", weight: "400" },
  ],
});

let qrVectorRuns = [];

function normalizedText(value) {
  return String(value ?? "").trim();
}

function getValue(data, path) {
  return path.split(".").reduce((value, key) => value?.[key], data);
}

function wrapText(context, value, maxWidth, font, size, direction) {
  const lines = [];
  for (const paragraph of String(value ?? "").split(/\r?\n/u)) {
    const words = paragraph.split(/\s+/u).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let line = words[0];
    for (const word of words.slice(1)) {
      const candidate = `${line} ${word}`;
      context.font = `${font.weight} ${size}px ${font.family}`;
      context.direction = direction;
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

function line(context, x1, y, x2, width, dash = [8, 6]) {
  context.save();
  context.beginPath();
  context.setLineDash(dash);
  context.lineWidth = width;
  context.strokeStyle = INK;
  context.moveTo(x1, y);
  context.lineTo(x2, y);
  context.stroke();
  context.restore();
}

function drawText(context, text, { x, y, size, align = "left", direction = "ltr", weight = "400", family = "arabic" }) {
  context.save();
  context.font = `${weight} ${size}px ${family === "latin" ? FONT_LATIN : FONT_ARABIC}`;
  context.direction = direction;
  context.textAlign = align;
  context.textBaseline = "middle";
  context.fillStyle = INK;
  context.fillText(normalizedText(text), x, y);
  context.restore();
}

function drawRule(context, y, dashed = true) {
  line(context, 85, y, 1675, dashed ? 5 : 4, dashed ? [8, 5] : []);
}

function fieldText(data, path, options) {
  return { ...options, text: getValue(data, path) };
}

function drawQrVector(context) {
  context.save();
  context.fillStyle = INK;
  for (const [x, y, width] of qrVectorRuns) context.fillRect(x, y, width, 1);
  context.restore();
}

function receiptRows(context, data) {
  const columnWidth = TABLE_COLUMNS.description[1] - TABLE_COLUMNS.description[0] - 10;
  const descriptionFont = { family: FONT_ARABIC, weight: "400" };
  const rows = data.items.map((item) => ({
    item,
    lines: wrapText(context, item.description, columnWidth, descriptionFont, TABLE_SIZE, "rtl"),
  }));
  const heights = rows.map(({ lines }) => Math.max(76, lines.length * TABLE_LINE_HEIGHT + 6));
  return { rows, heights, height: heights.reduce((sum, height) => sum + height, 0) };
}

function drawValue(context, text, x, y, size, align = "right", weight = "400", family = "latin", direction = "ltr") {
  drawText(context, text, { x, y, size, align, direction, weight, family });
}

function drawDigitalReceipt(context, data) {
  const rows = receiptRows(context, data);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, SA_RECEIPT_PAGE.previewWidth, SA_RECEIPT_PAGE.previewHeight);
  context.save();
  const previewImageWidth = SA_RECEIPT_PAGE.sourceWidthPt * SA_RECEIPT_PAGE.previewScale;
  const previewImageHeight = SA_RECEIPT_PAGE.sourceHeightPx
    * SA_RECEIPT_PAGE.sourceWidthPt / SA_RECEIPT_PAGE.sourceWidthPx * SA_RECEIPT_PAGE.previewScale;
  const pageLeft = (SA_RECEIPT_PAGE.widthPt - SA_RECEIPT_PAGE.sourceWidthPt) * SA_RECEIPT_PAGE.previewScale / 2;
  context.translate(pageLeft, 0);
  context.scale(previewImageWidth / SA_RECEIPT_PAGE.sourceWidthPx, previewImageHeight / SA_RECEIPT_PAGE.sourceHeightPx);

  drawQrVector(context);
  for (const item of [RECEIPT_LAYOUT.company, RECEIPT_LAYOUT.dateLabel, RECEIPT_LAYOUT.timeLabel,
    RECEIPT_LAYOUT.receiptLabel, RECEIPT_LAYOUT.cashierLabel, RECEIPT_LAYOUT.registerLabel,
    RECEIPT_LAYOUT.customerCodeLabel, RECEIPT_LAYOUT.transactionLabel]) {
    drawText(context, item.text, item);
  }
  drawValue(context, data.date, 900, 573, 50, "left", "400", "latin");
  const [clock, period] = normalizedText(data.time).split(/\s+/u);
  drawValue(context, clock, 420, 573, 50, "left", "400", "latin");
  drawValue(context, period, 1675, 573, 50, "right", "400", "latin");
  drawValue(context, data.receiptNumber, 1675, 670, 50, "right", "400", "latin");
  drawValue(context, data.cashier, 1030, 755, 52, "right", "400", "arabic", "rtl");
  drawValue(context, data.registerNumber, 1675, 845, 50, "right", "400", "latin");
  drawValue(context, data.customerCode, 80, 938, 50, "left", "400", "latin");
  drawValue(context, data.transactionCustomer, 825, 1042, 50, "right", "400", "arabic", "rtl");

  drawRule(context, 1100);
  for (const heading of RECEIPT_LAYOUT.headings) drawText(context, heading.text, heading);
  drawRule(context, 1245);

  let rowY = TABLE_START_Y;
  rows.rows.forEach(({ item, lines }, index) => {
    const rowHeight = rows.heights[index];
    const centerY = rowY + rowHeight / 2;
    const totalX = TABLE_COLUMNS.total[1] - 10;
    const unitX = TABLE_COLUMNS.unitPrice[1] - 10;
    const quantityX = TABLE_COLUMNS.quantity[1] - 10;
    drawValue(context, item.total, totalX, centerY, TABLE_SIZE, "right", "400", "latin");
    drawValue(context, item.unitPrice, unitX, centerY, TABLE_SIZE, "right", "400", "latin");
    drawValue(context, item.quantity, quantityX, centerY, TABLE_SIZE, "right", "400", "latin");
    const firstY = centerY - ((lines.length - 1) * TABLE_LINE_HEIGHT) / 2;
    lines.forEach((text, lineIndex) => drawText(context, text, {
      x: TABLE_COLUMNS.description[1] - 10,
      y: firstY + lineIndex * TABLE_LINE_HEIGHT,
      size: TABLE_SIZE,
      align: "right",
      direction: "rtl",
      weight: "400",
    }));
    rowY += rowHeight;
  });
  const lowerShift = Math.max(0, rows.height - (TABLE_END_Y - TABLE_START_Y));
  drawRule(context, TABLE_START_Y + rows.height + 9);

  for (const total of RECEIPT_LAYOUT.totals) {
    drawValue(context, data[total.path], total.valueX, total.y + lowerShift, total.size, "right", total.weight || "400", "latin");
    drawText(context, total.label, {
      text: total.label, x: total.labelX, y: total.y + lowerShift, size: total.labelSize,
      align: "right", direction: "rtl", weight: "700",
    });
  }
  drawRule(context, 2085 + lowerShift);
  drawText(context, RECEIPT_LAYOUT.paid.label, {
    text: RECEIPT_LAYOUT.paid.label, x: RECEIPT_LAYOUT.paid.labelX, y: RECEIPT_LAYOUT.paid.y + lowerShift,
    size: RECEIPT_LAYOUT.paid.size, align: "right", direction: "rtl", weight: "700",
  });
  drawValue(context, data.paidAmount, RECEIPT_LAYOUT.paid.valueX, RECEIPT_LAYOUT.paid.y + lowerShift, 52, "right", "400", "latin");
  drawRule(context, 2244 + lowerShift);
  drawValue(context, data.returnAmount, 1675, 2350 + lowerShift, 50, "right", "400", "latin");
  drawText(context, RECEIPT_LAYOUT.returnLine.text, { ...RECEIPT_LAYOUT.returnLine, y: RECEIPT_LAYOUT.returnLine.y + lowerShift });
  drawRule(context, 2424 + lowerShift, false);
  for (const item of RECEIPT_LAYOUT.footer) drawText(context, item.text, { ...item, y: item.y + lowerShift });
  context.restore();
  return rows;
}

export function setSaReceiptQrVector(sourceContext) {
  const [left, top, right, bottom] = QR_BOUNDS;
  const width = right - left;
  const height = bottom - top;
  const pixels = sourceContext.getImageData(left, top, width, height).data;
  const runs = [];
  for (let y = 0; y < height; y++) {
    let runStart = -1;
    for (let x = 0; x <= width; x++) {
      const index = (y * width + x) * 4;
      const dark = x < width && pixels[index] < 115 && pixels[index + 1] < 115 && pixels[index + 2] < 115;
      if (dark && runStart < 0) runStart = x;
      if (!dark && runStart >= 0) {
        runs.push([left + runStart, top + y, x - runStart]);
        runStart = -1;
      }
    }
  }
  qrVectorRuns = runs;
  return runs.length;
}

export function validateSaReceiptLayout(context, data) {
  const errors = [...validateSaReceipt(data).errors];
  const rows = receiptRows(context, data);
  const lowerShift = Math.max(0, rows.height - (TABLE_END_Y - TABLE_START_Y));
  const lastFooter = RECEIPT_LAYOUT.footer.at(-1);
  if (lastFooter.y + lowerShift + lastFooter.size * 0.8 > SA_RECEIPT_PAGE.sourceHeightPx) {
    errors.push("Item descriptions push the receipt footer beyond the page at the reference font size.");
  }
  context.font = `400 52px ${FONT_ARABIC}`;
  const customerWidth = context.measureText(data.transactionCustomer).width;
  if (customerWidth > 745) errors.push("Customer / transaction text does not fit at the reference font size.");
  return { errors, rows };
}

export function renderSaReceiptPage(context, data) {
  context.clearRect(0, 0, SA_RECEIPT_PAGE.previewWidth, SA_RECEIPT_PAGE.previewHeight);
  return drawDigitalReceipt(context, data);
}

export function renderSaReceiptPdfPage(page, fonts, data) {
  const { regular, bold, latinRegular, latinBold } = fonts;
  const scale = SA_RECEIPT_PAGE.sourceScalePt;
  const pageLeft = SA_RECEIPT_PAGE.sourceXPt;
  const toX = (x) => pageLeft + x * scale;
  const toY = (y) => SA_RECEIPT_PAGE.heightPt - y * scale;
  const black = window.PDFLib.rgb(0.07, 0.07, 0.07);
  const rows = receiptRows(document.createElement("canvas").getContext("2d"), data);
  const lowerShift = Math.max(0, rows.height - (TABLE_END_Y - TABLE_START_Y));
  const text = (value, x, y, sizePx, options = {}) => {
    const valueText = normalizedText(value);
    const size = sizePx * scale;
    const yPt = toY(y) - size * 0.35;
    const chooseFont = (valueRun, forceFamily = options.family) => {
      const isArabic = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u.test(valueRun);
      const family = forceFamily || (isArabic ? "arabic" : "latin");
      return family === "latin"
        ? (options.weight === "700" ? latinBold : latinRegular)
        : (options.weight === "700" ? bold : regular);
    };
    const drawRun = (valueRun, xPt, font) => page.drawText(valueRun, { x: xPt, y: yPt, size, font, color: black });

    if (options.direction === "rtl") {
      const runs = valueText.match(/[\p{Script=Arabic}\u0750-\u077f\u08a0-\u08ff]+|[A-Za-z0-9]+%?|[^\p{Script=Arabic}A-Za-z0-9]+/gu) || [valueText];
      const visualRuns = [...runs].reverse();
      const widths = visualRuns.map((run) => chooseFont(run).widthOfTextAtSize(run, size));
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      let right = options.align === "left" ? toX(x) + totalWidth : toX(x);
      for (let index = 0; index < visualRuns.length; index++) {
        const run = visualRuns[index];
        const width = widths[index];
        if (!/^\s+$/u.test(run)) drawRun(run, right - width, chooseFont(run));
        right -= width;
      }
      return;
    }

    const font = chooseFont(valueText);
    const width = font.widthOfTextAtSize(valueText, size);
    const xPt = toX(x) - (options.align === "right" ? width : options.align === "center" ? width / 2 : 0);
    drawRun(valueText, xPt, font);
  };
  const drawPdfRule = (y, dashed = true) => {
    const x1 = toX(85);
    const x2 = toX(1675);
    const lineWidth = (dashed ? 5 : 4) * scale;
    if (!dashed) {
      page.drawLine({ start: { x: x1, y: toY(y) }, end: { x: x2, y: toY(y) }, thickness: lineWidth, color: black });
      return;
    }
    const dash = 8 * scale;
    const gap = 5 * scale;
    for (let x = x1; x < x2; x += dash + gap) {
      page.drawLine({ start: { x, y: toY(y) }, end: { x: Math.min(x + dash, x2), y: toY(y) }, thickness: lineWidth, color: black });
    }
  };

  page.drawRectangle({ x: 0, y: 0, width: SA_RECEIPT_PAGE.widthPt, height: SA_RECEIPT_PAGE.heightPt, color: window.PDFLib.rgb(1, 1, 1) });
  for (const [x, y, width] of qrVectorRuns) {
    page.drawRectangle({ x: toX(x), y: toY(y + 1), width: width * scale, height: scale, color: black });
  }
  const staticLabels = [RECEIPT_LAYOUT.company, RECEIPT_LAYOUT.dateLabel, RECEIPT_LAYOUT.timeLabel,
    RECEIPT_LAYOUT.receiptLabel, RECEIPT_LAYOUT.cashierLabel, RECEIPT_LAYOUT.registerLabel,
    RECEIPT_LAYOUT.customerCodeLabel, RECEIPT_LAYOUT.transactionLabel, ...RECEIPT_LAYOUT.headings];
  for (const item of staticLabels) text(item.text, item.x, item.y, item.size, {
    align: item.align, direction: item.direction, weight: item.weight, family: item.family,
  });
  text(data.date, 900, 573, 50, { align: "left", family: "latin" });
  const [clock, period] = normalizedText(data.time).split(/\s+/u);
  text(clock, 420, 573, 50, { family: "latin" });
  text(period, 1675, 573, 50, { align: "right", family: "latin" });
  text(data.receiptNumber, 1675, 670, 50, { align: "right", family: "latin" });
  text(data.cashier, 1030, 755, 52, { align: "right", direction: "rtl" });
  text(data.registerNumber, 1675, 845, 50, { align: "right", family: "latin" });
  text(data.customerCode, 80, 938, 50, { family: "latin" });
  text(data.transactionCustomer, 825, 1042, 50, { align: "right", direction: "rtl" });
  drawPdfRule(1100);
  drawPdfRule(1245);
  let rowY = TABLE_START_Y;
  rows.rows.forEach(({ item, lines }, index) => {
    const rowHeight = rows.heights[index];
    const centerY = rowY + rowHeight / 2;
    text(item.total, TABLE_COLUMNS.total[1] - 10, centerY, TABLE_SIZE, { align: "right", family: "latin" });
    text(item.unitPrice, TABLE_COLUMNS.unitPrice[1] - 10, centerY, TABLE_SIZE, { align: "right", family: "latin" });
    text(item.quantity, TABLE_COLUMNS.quantity[1] - 10, centerY, TABLE_SIZE, { align: "right", family: "latin" });
    const firstY = centerY - ((lines.length - 1) * TABLE_LINE_HEIGHT) / 2;
    lines.forEach((value, lineIndex) => text(value, TABLE_COLUMNS.description[1] - 10,
      firstY + lineIndex * TABLE_LINE_HEIGHT, TABLE_SIZE, { align: "right", direction: "rtl" }));
    rowY += rowHeight;
  });
  drawPdfRule(TABLE_START_Y + rows.height + 9);
  for (const total of RECEIPT_LAYOUT.totals) {
    text(data[total.path], total.valueX, total.y + lowerShift, total.size, { align: "right", weight: total.weight, family: "latin" });
    text(total.label, total.labelX, total.y + lowerShift, total.labelSize, { align: "right", weight: "700", direction: "rtl" });
  }
  drawPdfRule(2085 + lowerShift);
  text(RECEIPT_LAYOUT.paid.label, RECEIPT_LAYOUT.paid.labelX, RECEIPT_LAYOUT.paid.y + lowerShift, RECEIPT_LAYOUT.paid.size, { align: "right", weight: "700", direction: "rtl" });
  text(data.paidAmount, RECEIPT_LAYOUT.paid.valueX, RECEIPT_LAYOUT.paid.y + lowerShift, 52, { align: "right", family: "latin" });
  drawPdfRule(2244 + lowerShift);
  text(data.returnAmount, 1675, 2350 + lowerShift, 50, { align: "right", family: "latin" });
  text(RECEIPT_LAYOUT.returnLine.text, RECEIPT_LAYOUT.returnLine.x, RECEIPT_LAYOUT.returnLine.y + lowerShift, RECEIPT_LAYOUT.returnLine.size, { align: "left", weight: "700", direction: "rtl" });
  drawPdfRule(2424 + lowerShift, false);
  for (const item of RECEIPT_LAYOUT.footer) text(item.text, item.x, item.y + lowerShift, item.size, {
    align: item.align, weight: item.weight, family: item.family, direction: item.direction,
  });
}

export function createSaReceiptData() {
  return structuredClone(SA_RECEIPT_DEFAULT_DATA);
}

export function getSaReceiptValue(data, path) {
  return path.split(".").reduce((value, part) => value?.[part], data);
}

export function setSaReceiptValue(data, path, value) {
  const parts = path.split(".");
  const lastPart = parts.pop();
  const target = parts.reduce((current, part) => current[part], data);
  target[lastPart] = value;
}

export function saReceiptHasChanges(data) {
  return JSON.stringify(data) !== JSON.stringify(SA_RECEIPT_DEFAULT_DATA);
}

export function validateSaReceipt(data) {
  for (const path of MONEY_PATHS) {
    const value = String(getSaReceiptValue(data, path)).trim();
    if (!DECIMAL_PATTERN.test(value)) {
      const itemMatch = path.match(/^items\.(\d+)\.(quantity|unitPrice|total)$/);
      const label = itemMatch
        ? `Row ${Number(itemMatch[1]) + 1} ${MONEY_LABELS[itemMatch[2]]}`
        : MONEY_LABELS[path];
      return { errors: [`${label} must be a non-negative number with up to two decimal places.`] };
    }
  }
  return { errors: [] };
}

function appendControl(parent, { label, path, value, direction = "ltr", inputMode, maxLength = 100 }) {
  const group = document.createElement("label");
  group.className = "invoice-field";
  group.textContent = label;

  const control = document.createElement("input");
  control.className = "field-input";
  control.type = "text";
  control.dataset.saPath = path;
  control.value = value;
  control.dir = direction;
  control.autocomplete = "off";
  control.maxLength = maxLength;
  if (inputMode) control.inputMode = inputMode;
  if (direction === "rtl") control.lang = "ar";

  group.append(control);
  parent.append(group);
}

function createFieldset(parent, title, className = "") {
  const fieldset = document.createElement("fieldset");
  fieldset.className = `invoice-section ${className}`.trim();
  const legend = document.createElement("legend");
  legend.textContent = title;
  fieldset.append(legend);
  parent.append(fieldset);
  return fieldset;
}

export function createSaReceiptControls(container, data) {
  container.replaceChildren();

  const details = createFieldset(container, "Receipt details", "sa-receipt-details");
  appendControl(details, { label: "Date", path: "date", value: data.date, maxLength: 30 });
  appendControl(details, { label: "Time", path: "time", value: data.time, maxLength: 30 });
  appendControl(details, { label: "Receipt number", path: "receiptNumber", value: data.receiptNumber, maxLength: 50 });
  appendControl(details, { label: "Cashier", path: "cashier", value: data.cashier, direction: "rtl", maxLength: 80 });
  appendControl(details, { label: "Register / till number", path: "registerNumber", value: data.registerNumber, maxLength: 40 });
  appendControl(details, { label: "Customer code", path: "customerCode", value: data.customerCode, maxLength: 40 });
  appendControl(details, {
    label: "Customer / transaction text",
    path: "transactionCustomer",
    value: data.transactionCustomer,
    direction: "rtl",
    maxLength: 120,
  });

  const items = createFieldset(container, "Three receipt items", "invoice-section-sa-items");
  const note = document.createElement("p");
  note.className = "invoice-calculation-note";
  note.textContent = "Quantity, unit price, and line total are independent values; changing one does not recalculate another.";
  items.append(note);

  data.items.forEach((item, index) => {
    const row = createFieldset(items, `Row ${index + 1}`, "invoice-item-row");
    appendControl(row, { label: "Item description", path: `items.${index}.description`, value: item.description, direction: "rtl", maxLength: 120 });
    appendControl(row, { label: "Quantity", path: `items.${index}.quantity`, value: item.quantity, inputMode: "decimal", maxLength: 20 });
    appendControl(row, { label: "Unit price", path: `items.${index}.unitPrice`, value: item.unitPrice, inputMode: "decimal", maxLength: 20 });
    appendControl(row, { label: "Line total", path: `items.${index}.total`, value: item.total, inputMode: "decimal", maxLength: 20 });
  });

  const totals = createFieldset(container, "Receipt totals", "invoice-section-sa-totals");
  appendControl(totals, { label: "Sales total", path: "salesTotal", value: data.salesTotal, inputMode: "decimal", maxLength: 20 });
  appendControl(totals, { label: "Discount total", path: "discountTotal", value: data.discountTotal, inputMode: "decimal", maxLength: 20 });
  appendControl(totals, { label: "VAT amount (14% label stays fixed)", path: "vatAmount", value: data.vatAmount, inputMode: "decimal", maxLength: 20 });
  appendControl(totals, { label: "Net / payable total", path: "netTotal", value: data.netTotal, inputMode: "decimal", maxLength: 20 });
  appendControl(totals, { label: "Paid amount", path: "paidAmount", value: data.paidAmount, inputMode: "decimal", maxLength: 20 });
  appendControl(totals, { label: "Return / exchange amount", path: "returnAmount", value: data.returnAmount, inputMode: "decimal", maxLength: 20 });
}
