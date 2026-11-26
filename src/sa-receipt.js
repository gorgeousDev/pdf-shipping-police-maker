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
});

const VAT_RATE = 0.14;
const MONEY_DECIMALS = 2;
const QR_BOUNDS = Object.freeze([88, 430, 316, 800]);
const TABLE_START_Y = 1358;
const TABLE_END_Y = 1638;
const TABLE_TOP_RULE_Y = 1198;
const TABLE_HEADING_RULE_Y = 1350;
const TABLE_LINE_HEIGHT = 52;
const TABLE_COLUMNS = Object.freeze([765, 260, 280, 285]);
const TABLE_COLUMN_TOTAL = TABLE_COLUMNS.reduce((sum, width) => sum + width, 0);
const RECEIPT_LAYOUT = Object.freeze({
  company: { x: 1675, y: 580, width: 1275, size: 60 },
  dateLabel: { text: "التاريخ :", x: 1510, y: 681, width: 430, size: 58 },
  timeLabel: { text: "الوقت :", x: 790, y: 681, width: 320, size: 58 },
  receiptLabel: { text: "رقم البون :", x: 850, y: 767, width: 420, size: 58 },
  cashierLabel: { text: "اسم الكاشير :", x: 1450, y: 857, width: 480, size: 58 },
  registerLabel: { text: "رقم الخزينة :", x: 1300, y: 947, width: 430, size: 58 },
  customerCodeLabel: { text: "كود العميل :", x: 560, y: 1035, width: 440, size: 58 },
  transactionLabel: { text: "نوع المعاملة : (اسم العميل)", x: 1675, y: 1127, width: 850, size: 58 },
  headings: [
    { text: "اسم الصنف", column: 0 },
    { text: "الكمية", column: 1 },
    { text: "السعر", column: 2 },
    { text: "الإجمالي", column: 3 },
  ],
  totals: [
    { path: "salesTotal", label: "إجمالي المبيعات :", y: 1720, labelWidth: 465, valueX: 1210, valueWidth: 360 },
    { path: "discountTotal", label: "إجمالي الخصم :", y: 1810, labelWidth: 415, valueX: 1260, valueWidth: 220 },
    { path: "vatAmount", label: "ضريبة القيمة المضافة 14% :", y: 1900, labelWidth: 800, valueX: 946, valueWidth: 320 },
    { path: "netTotal", label: "الصافي", y: 1990, labelWidth: 195, valueX: 1460, valueWidth: 360 },
  ],
  paid: { label: "المدفوع", labelX: 1310, valueX: 1675, y: 2160 },
  returnLine: { text: "استبدال وارجاع البضاعة خلال 30 يوم من خلال الفرع", y: 2290 },
  footer: [
    { text: "Now online store www.samirandaly.com", x: 80, y: 2534, width: 1100, direction: "ltr", family: "latin", weight: "400", size: 52 },
    { text: "731-227-697     س.ت : 122281     ب.ض :", x: 1675, y: 2620, width: 1400, direction: "rtl", weight: "400", size: 51 },
    { text: "في حالة الاسترجاع والاستبدال يتم من خلال الفرع المشتراة منه", x: 1675, y: 2728, width: 1675, direction: "rtl", weight: "700", size: 51 },
    { text: "نسبة الخصم : 0.00", x: 1675, y: 2810, width: 700, direction: "rtl", weight: "400", size: 50 },
    { text: "بون البيع", x: 1675, y: 2890, width: 400, direction: "rtl", weight: "400", size: 50 },
  ],
});

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const DIGIT_TRANSLATION = new Map([...ARABIC_DIGITS].map((digit, index) => [digit, String(index)]));
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
const SVG_NS = "http://www.w3.org/2000/svg";

let qrVectorRuns = [];

function roundMoney(value) {
  const factor = 10 ** MONEY_DECIMALS;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatMoney(value) {
  return roundMoney(Number(value) || 0).toFixed(MONEY_DECIMALS);
}

function toWesternDigits(value) {
  return String(value).replace(/[٠-٩]/gu, (digit) => DIGIT_TRANSLATION.get(digit));
}

function parseInvoiceAmount(value, label) {
  const normalized = toWesternDigits(value).replace(/\s+/gu, "");
  const lastComma = normalized.lastIndexOf(",");
  const numberText = lastComma < 0
    ? normalized.replace(/,/gu, "")
    : `${normalized.slice(0, lastComma).replace(/,/gu, "")}.${normalized.slice(lastComma + 1)}`;
  const result = Number(numberText);
  if (!Number.isFinite(result) || result < 0) {
    throw new Error(`Could not read the electronic tax invoice ${label}.`);
  }
  return result;
}

function getLocalIssueDateTime(issueDate) {
  const match = String(issueDate).match(
    /القاهرة\s+(AM|PM)\s+([0-9٠-٩]{2}:[0-9٠-٩]{2}:[0-9٠-٩]{2})\s+([0-9٠-٩]{4}\/[0-9٠-٩]{2}\/[0-9٠-٩]{2})/u
  );
  if (!match) {
    throw new Error("Could not read the Cairo-local issue date and time from the electronic tax invoice.");
  }
  const time = toWesternDigits(match[2]).slice(0, 5);
  const date = toWesternDigits(match[3]).replace(/\//gu, "-");
  return { date, time: `${time} ${match[1]}` };
}

function buildReceiptData(invoice) {
  const { date, time } = getLocalIssueDateTime(invoice.issueDate);
  const items = invoice.items.map((item, index) => {
    const quantityText = String(item.quantityUnit).split(/\r?\n/u, 1)[0].replace(/^\/\s*/u, "");
    return {
      description: item.description,
      quantity: parseInvoiceAmount(quantityText, `row ${index + 1} quantity`),
      unitPrice: parseInvoiceAmount(item.unitPrice, `row ${index + 1} unit price`),
    };
  });
  const discountTotal = [
    invoice.summary.discountTotal,
    invoice.summary.itemDiscountTotal,
    invoice.summary.additionalInvoiceDiscount,
  ].reduce((sum, amount, index) => sum + parseInvoiceAmount(amount, `discount ${index + 1}`), 0);

  const receiptItems = items.map((item) => ({
    description: item.description,
    quantity: formatMoney(item.quantity),
    unitPrice: formatMoney(item.unitPrice),
    total: formatMoney(item.quantity * item.unitPrice),
  }));
  const salesTotal = receiptItems.reduce((sum, item) => sum + Number(item.total), 0);
  const taxableTotal = salesTotal - roundMoney(discountTotal);
  const vatAmount = roundMoney(taxableTotal * VAT_RATE);
  const netTotal = roundMoney(taxableTotal + vatAmount);

  return {
    sellerName: invoice.seller.name,
    date,
    time,
    receiptNumber: invoice.footer.internalNumber,
    cashier: "حسام محمد حسام محمد",
    registerNumber: "",
    customerCode: "",
    transactionCustomer: invoice.buyer.name,
    items: receiptItems,
    salesTotal: formatMoney(salesTotal),
    discountTotal: formatMoney(discountTotal),
    vatAmount: formatMoney(vatAmount),
    netTotal: formatMoney(netTotal),
    paidAmount: formatMoney(netTotal),
    returnAmount: "0.00",
  };
}

function sourceXPercent(x) {
  return (SA_RECEIPT_PAGE.sourceXPt + x * SA_RECEIPT_PAGE.sourceScalePt)
    / SA_RECEIPT_PAGE.widthPt * 100;
}

function sourceYPercent(y) {
  return y / SA_RECEIPT_PAGE.sourceHeightPx * 100;
}

function sourceWidthPercent(width) {
  return width * SA_RECEIPT_PAGE.sourceScalePt / SA_RECEIPT_PAGE.widthPt * 100;
}

function sourceCssUnit(value) {
  return `${(value * SA_RECEIPT_PAGE.sourceScalePt * 100 / SA_RECEIPT_PAGE.widthPt).toFixed(5)}cqw`;
}

function sourceHeightPercent(height) {
  return height / SA_RECEIPT_PAGE.sourceHeightPx * 100;
}

function placeElement(element, { x, y, width, size, align = "left" }) {
  const leftX = align === "right" ? x - width : x;
  element.style.left = `${sourceXPercent(leftX)}%`;
  element.style.width = `${sourceWidthPercent(width)}%`;
  element.style.top = `${sourceYPercent(y)}%`;
  element.style.fontSize = sourceCssUnit(size);
  element.style.lineHeight = sourceCssUnit(size);
  element.style.textAlign = align;
  element.style.transform = "translateY(-50%)";
}

function addText(page, value, options = {}) {
  const element = document.createElement(options.tag || "span");
  element.className = `sa-text${options.className ? ` ${options.className}` : ""}`;
  element.textContent = String(value ?? "");
  element.dir = options.direction || "rtl";
  if (element.dir === "rtl" || element.dir === "auto") element.lang = "ar";
  element.style.fontWeight = options.weight || "400";
  if (options.family === "latin") element.classList.add("sa-latin");
  if (options.multiline) element.classList.add("sa-multiline");
  placeElement(element, options);
  if (options.overflowLabel) {
    element.dataset.saOverflowLabel = options.overflowLabel;
  }
  page.append(element);
  return element;
}

function addRule(page, y, solid = false) {
  const rule = document.createElement("div");
  rule.className = `sa-rule${solid ? " sa-rule-solid" : ""}`;
  rule.setAttribute("aria-hidden", "true");
  rule.style.left = `${sourceXPercent(85)}%`;
  rule.style.width = `${sourceWidthPercent(1590)}%`;
  rule.style.top = `${sourceYPercent(y)}%`;
  rule.style.borderTopWidth = sourceCssUnit(solid ? 4 : 5);
  page.append(rule);
  return rule;
}

function addQrSvg(page) {
  const [left, top, right, bottom] = QR_BOUNDS;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("sa-qr-svg");
  svg.setAttribute("viewBox", `${left} ${top} ${right - left} ${bottom - top}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "QR pattern copied from the S&A reference; payload not verified");
  svg.style.left = `${sourceXPercent(left)}%`;
  svg.style.top = `${sourceYPercent(top)}%`;
  svg.style.width = `${sourceWidthPercent(right - left)}%`;
  svg.style.height = `${sourceHeightPercent(bottom - top)}%`;

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("fill", "#111111");
  path.setAttribute("shape-rendering", "crispEdges");
  path.setAttribute("d", qrVectorRuns.map(([x, y, width]) => `M${x} ${y}h${width}v1h-${width}z`).join(""));
  svg.append(path);
  page.append(svg);
}

function createItemsTable(page, data) {
  const table = document.createElement("table");
  table.className = "sa-items-table";
  table.setAttribute("aria-label", "Receipt items");
  table.style.left = `${sourceXPercent(85)}%`;
  table.style.width = `${sourceWidthPercent(TABLE_COLUMN_TOTAL)}%`;
  table.style.top = `${sourceYPercent(1198)}%`;
  table.style.setProperty("--sa-header-height", sourceCssUnit(160));
  table.style.setProperty("--sa-header-padding", sourceCssUnit(48));
  table.style.setProperty("--sa-cell-min-height", sourceCssUnit(64));
  table.style.setProperty("--sa-cell-padding", sourceCssUnit(3));
  table.style.setProperty("--sa-table-font-size", sourceCssUnit(58));
  table.style.setProperty("--sa-table-line-height", sourceCssUnit(TABLE_LINE_HEIGHT));
  table.style.setProperty("--sa-rule-width", sourceCssUnit(5));

  const colgroup = document.createElement("colgroup");
  for (const width of TABLE_COLUMNS) {
    const col = document.createElement("col");
    col.style.width = `${width / TABLE_COLUMN_TOTAL * 100}%`;
    colgroup.append(col);
  }
  table.append(colgroup);

  const head = document.createElement("thead");
  const headingRow = document.createElement("tr");
  for (const heading of RECEIPT_LAYOUT.headings) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = heading.text;
    cell.dir = "rtl";
    cell.lang = "ar";
    cell.style.fontSize = sourceCssUnit(56);
    cell.style.lineHeight = sourceCssUnit(56);
    headingRow.append(cell);
  }
  head.append(headingRow);
  table.append(head);

  const body = document.createElement("tbody");
  data.items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = "sa-item-row";

    const descriptionCell = document.createElement("td");
    const description = document.createElement("div");
    description.className = "sa-cell-content sa-item-description";
    description.textContent = item.description;
    description.dir = "auto";
    description.lang = "ar";
    description.dataset.saItemDescription = "";
    descriptionCell.append(description);
    row.append(descriptionCell);

    const numberCells = [
      { value: item.quantity, label: `Row ${index + 1} quantity` },
      { value: item.unitPrice, label: `Row ${index + 1} unit price` },
      { value: item.total, label: `Row ${index + 1} line total` },
    ];
    for (const cellData of numberCells) {
      const cell = document.createElement("td");
      const value = document.createElement("div");
      value.className = "sa-cell-content sa-latin sa-item-number";
      value.textContent = cellData.value;
      value.dir = "ltr";
      value.dataset.saOverflowLabel = cellData.label;
      cell.append(value);
      row.append(cell);
    }
    body.append(row);
  });
  table.append(body);
  page.append(table);
  return table;
}

function renderReceiptContent(page, data) {
  page.replaceChildren();
  page.classList.add("sa-page");
  page.lang = "ar";
  page.dir = "rtl";
  page.setAttribute("aria-label", "S&A electronic tax receipt preview");

  addQrSvg(page);
  addText(page, `شركة ${data.sellerName} ترحب بكم`, {
    className: "sa-company",
    x: RECEIPT_LAYOUT.company.x,
    y: RECEIPT_LAYOUT.company.y,
    width: RECEIPT_LAYOUT.company.width,
    size: RECEIPT_LAYOUT.company.size,
    align: "right",
    weight: "700",
    overflowLabel: "Seller name",
  });

  const headerLabels = [
    ["dateLabel", RECEIPT_LAYOUT.dateLabel],
    ["timeLabel", RECEIPT_LAYOUT.timeLabel],
    ["receiptLabel", RECEIPT_LAYOUT.receiptLabel],
    ["registerLabel", RECEIPT_LAYOUT.registerLabel],
    ["customerCodeLabel", RECEIPT_LAYOUT.customerCodeLabel],
    ["transactionLabel", RECEIPT_LAYOUT.transactionLabel],
  ];
  for (const [key, layout] of headerLabels) {
    addText(page, layout.text, {
      className: "sa-label",
      x: layout.x,
      y: layout.y,
      width: layout.width,
      size: layout.size,
      align: "right",
      weight: "400",
    });
  }

  const cashierRow = document.createElement("div");
  cashierRow.className = "sa-text sa-cashier-row";
  cashierRow.dir = "rtl";
  placeElement(cashierRow, {
    x: RECEIPT_LAYOUT.cashierLabel.x,
    y: RECEIPT_LAYOUT.cashierLabel.y,
    width: RECEIPT_LAYOUT.cashierLabel.width + 580 + 16,
    size: RECEIPT_LAYOUT.cashierLabel.size,
    align: "right",
  });
  cashierRow.style.gap = sourceCssUnit(16);

  const cashierLabel = document.createElement("span");
  cashierLabel.textContent = RECEIPT_LAYOUT.cashierLabel.text;
  cashierLabel.dir = "rtl";
  cashierLabel.lang = "ar";
  cashierLabel.style.fontSize = sourceCssUnit(RECEIPT_LAYOUT.cashierLabel.size);
  cashierLabel.style.lineHeight = sourceCssUnit(RECEIPT_LAYOUT.cashierLabel.size);

  const cashierValue = document.createElement("span");
  cashierValue.className = "sa-cashier-value";
  cashierValue.textContent = data.cashier;
  cashierValue.dir = "rtl";
  cashierValue.lang = "ar";
  cashierValue.style.fontSize = sourceCssUnit(52);
  cashierValue.style.lineHeight = sourceCssUnit(52);

  cashierRow.append(cashierLabel, cashierValue);
  page.append(cashierRow);

  const [clock, period] = String(data.time).trim().split(/\s+/u);
  addText(page, data.date, {
    className: "sa-value sa-latin",
    x: 900,
    y: 681,
    width: 570,
    size: 50,
    align: "left",
    direction: "ltr",
    family: "latin",
    overflowLabel: "Date",
  });
  addText(page, clock, {
    className: "sa-value sa-latin",
    x: 420,
    y: 681,
    width: 320,
    size: 50,
    align: "left",
    direction: "ltr",
    family: "latin",
    overflowLabel: "Time",
  });
  addText(page, period, {
    className: "sa-value sa-latin",
    x: 1675,
    y: 681,
    width: 120,
    size: 50,
    align: "right",
    direction: "ltr",
    family: "latin",
    overflowLabel: "Time period",
  });
  addText(page, data.receiptNumber, {
    className: "sa-value sa-latin",
    x: 1675,
    y: 767,
    width: 800,
    size: 50,
    align: "right",
    direction: "ltr",
    family: "latin",
    overflowLabel: "Receipt number",
  });
  addText(page, data.registerNumber, {
    className: "sa-value sa-latin",
    x: 1675,
    y: 947,
    width: 370,
    size: 50,
    align: "right",
    direction: "ltr",
    family: "latin",
    overflowLabel: "Register / till number",
  });
  addText(page, data.customerCode, {
    className: "sa-value sa-latin",
    x: 560,
    y: 1035,
    width: 300,
    size: 50,
    align: "right",
    direction: "ltr",
    family: "latin",
    overflowLabel: "Customer code",
  });
  addText(page, data.transactionCustomer, {
    className: "sa-value",
    x: 825,
    y: 1127,
    width: 800,
    size: 50,
    align: "right",
    overflowLabel: "Customer / transaction text",
  });

  addRule(page, TABLE_TOP_RULE_Y);
  const table = createItemsTable(page, data);
  addRule(page, TABLE_HEADING_RULE_Y);
  addRule(page, TABLE_END_Y).classList.add("sa-table-bottom-rule");

  for (const total of RECEIPT_LAYOUT.totals) {
    addText(page, data[total.path], {
      className: "sa-value sa-latin sa-total-value",
      x: total.valueX,
      y: total.y,
      width: total.valueWidth,
      size: 60,
      align: "right",
      direction: "ltr",
      family: "latin",
      overflowLabel: MONEY_LABELS[total.path],
    });
    addText(page, total.label, {
      className: "sa-label sa-total-label",
      x: 1675,
      y: total.y,
      width: total.labelWidth,
      size: 50,
      align: "right",
      weight: "700",
    });
  }

  const paid = RECEIPT_LAYOUT.paid;
  addRule(page, 2085);
  addText(page, data.paidAmount, {
    className: "sa-value sa-latin sa-total-value",
    x: paid.valueX,
    y: paid.y,
    width: 370,
    size: 60,
    align: "right",
    direction: "ltr",
    family: "latin",
    overflowLabel: "Paid amount",
  });
  addText(page, paid.label, {
    className: "sa-label",
    x: paid.labelX,
    y: paid.y,
    width: 280,
    size: 50,
    align: "right",
    weight: "700",
  });
  addRule(page, 2244);
  const returnRow = document.createElement("div");
  returnRow.className = "sa-text sa-return-row";
  returnRow.dir = "ltr";
  placeElement(returnRow, { x: 1675, y: RECEIPT_LAYOUT.returnLine.y, width: 1590, size: 52, align: "right" });
  returnRow.style.gap = sourceCssUnit(28);

  const returnPolicy = document.createElement("span");
  returnPolicy.className = "sa-return-policy";
  returnPolicy.textContent = RECEIPT_LAYOUT.returnLine.text;
  returnPolicy.dir = "rtl";
  returnPolicy.lang = "ar";
  returnPolicy.style.fontSize = sourceCssUnit(52);
  returnPolicy.style.lineHeight = sourceCssUnit(52);
  returnPolicy.style.fontWeight = "700";

  const returnAmount = document.createElement("span");
  returnAmount.className = "sa-latin";
  returnAmount.textContent = data.returnAmount;
  returnAmount.dir = "ltr";
  returnAmount.style.fontSize = sourceCssUnit(50);
  returnAmount.style.lineHeight = sourceCssUnit(50);

  returnRow.append(returnPolicy, returnAmount);
  page.append(returnRow);
  addRule(page, 2424, true);
  for (const item of RECEIPT_LAYOUT.footer) {
    addText(page, item.text, {
      className: `sa-footer-text${item.family === "latin" ? " sa-latin" : ""}`,
      x: item.x,
      y: item.y,
      width: item.width,
      size: item.size,
      align: item.direction === "ltr" ? "left" : "right",
      direction: item.direction,
      weight: item.weight,
      family: item.family,
    });
  }
  return table;
}

function measureReceiptLayout(page, table) {
  const pageBounds = page.getBoundingClientRect();
  const rowHeight = [...table.querySelectorAll(".sa-item-row")].reduce((sum, row) => {
    return sum + row.getBoundingClientRect().height / pageBounds.height * SA_RECEIPT_PAGE.sourceHeightPx;
  }, 0);
  return { rowHeight, availableTableHeight: TABLE_END_Y - TABLE_START_Y };
}

export function renderSaReceiptPage(page, data) {
  const table = renderReceiptContent(page, data);
  return measureReceiptLayout(page, table);
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
      const dark = x < width
        && pixels[index] < 115
        && pixels[index + 1] < 115
        && pixels[index + 2] < 115;
      if (dark && runStart < 0) runStart = x;
      if (!dark && runStart >= 0) {
        runs.push([left + runStart, top + y, x - runStart]);
        runStart = -1;
      }
    }
  }
  if (runs.length === 0) {
    throw new Error("The S&A reference QR pattern could not be traced.");
  }
  qrVectorRuns = runs;
  return runs.length;
}

export function createSaReceiptData(invoice) {
  if (!invoice?.seller?.name || !invoice?.buyer?.name || !invoice?.items?.length) {
    throw new Error("The electronic tax invoice does not contain the receipt's required seller, buyer, and item data.");
  }
  return buildReceiptData(invoice);
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

export function validateSaReceipt(data) {
  const moneyPaths = [
    ...data.items.flatMap((_, index) => [
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
  for (const path of moneyPaths) {
    const value = String(getSaReceiptValue(data, path)).trim();
    if (!DECIMAL_PATTERN.test(value)) {
      const itemMatch = path.match(/^items\.(\d+)\.(quantity|unitPrice|total)$/u);
      const label = itemMatch
        ? `Row ${Number(itemMatch[1]) + 1} ${MONEY_LABELS[itemMatch[2]]}`
        : MONEY_LABELS[path];
      return { errors: [`${label} must be a non-negative number with up to two decimal places.`] };
    }
  }
  return { errors: [] };
}

export function validateSaReceiptLayout(page, data) {
  const errors = [...validateSaReceipt(data).errors];
  if (errors.length > 0) return { errors };

  const table = page.querySelector(".sa-items-table");
  const pageBounds = page.getBoundingClientRect();
  const rowHeight = [...table.querySelectorAll(".sa-item-row")].reduce((sum, row) => {
    return sum + row.getBoundingClientRect().height / pageBounds.height * SA_RECEIPT_PAGE.sourceHeightPx;
  }, 0);
  if (rowHeight > TABLE_END_Y - TABLE_START_Y + 1) {
    errors.push("Item descriptions exceed the fixed table area; shorten them to preserve the reference layout.");
  }

  for (const element of page.querySelectorAll("[data-sa-overflow-label]")) {
    if (element.textContent.trim() && element.scrollWidth > element.clientWidth + 1) {
      errors.push(`${element.dataset.saOverflowLabel} does not fit at the reference font size.`);
    }
  }

  const lastFooter = page.querySelector(".sa-footer-text:last-child");
  if (lastFooter && lastFooter.getBoundingClientRect().bottom > pageBounds.bottom + 0.5) {
    errors.push("Receipt footer text extends beyond the page.");
  }
  return { errors };
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
  appendControl(details, { label: "Seller / company name", path: "sellerName", value: data.sellerName, direction: "rtl", maxLength: 80 });
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

  const items = createFieldset(container, "Receipt items", "invoice-section-sa-items");
  const note = document.createElement("p");
  note.className = "invoice-calculation-note";
  note.textContent = "Item details come from the electronic tax invoice. Receipt amounts are displayed to two decimals; each value remains independently editable.";
  items.append(note);

  data.items.forEach((item, index) => {
    const row = createFieldset(items, `Row ${index + 1}`, "invoice-item-row");
    appendControl(row, { label: "Item description", path: `items.${index}.description`, value: item.description, direction: "rtl", maxLength: 160 });
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
