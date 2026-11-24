import { encodeCode39 } from "./barcode.js";

export const INVOICE_PAGE = Object.freeze({
  widthPt: 595.28,
  heightPt: 841.89,
  widthPx: 2381,
  heightPx: 3367,
});

export const INVOICE_DEFAULT_DATA = Object.freeze({
  orderNumber: "818020008225759",
  invoiceNumber: "88908524",
  invoiceDate: "29-May-2026",
  expectedDeliveryDate: "",
  customer: {
    name: "Akkad- أكاد",
    addressLatin: "Alexandria, Alasafra Qebli, Malek Hefny St.",
    addressArabic: "الاسكندرية ش الملك حفني العصافرة قبلي",
    taxId: "782-637-078",
    phone: "01508331823",
  },
  items: [
    { description: "Philips Tower Fan 5000\nSeries CX5535/11", orderedQuantity: "15.00", deliveredQuantity: "15.00", unitPriceIncludingVat: "5,000.00", substitutionDiscount: "0.00" },
    { description: "Philips Vacuum Cleaner\nFC9350-62", orderedQuantity: "20.00", deliveredQuantity: "20.00", unitPriceIncludingVat: "4,500.00", substitutionDiscount: "0.00" },
    { description: "Kibbeh Al Saif 6L A02503", orderedQuantity: "14.00", deliveredQuantity: "14.00", unitPriceIncludingVat: "2,500.00", substitutionDiscount: "0.00" },
    { description: "Al Saif Pressure Cooker\n11L K96011", orderedQuantity: "12.00", deliveredQuantity: "12.00", unitPriceIncludingVat: "3,000.00", substitutionDiscount: "0.00" },
    { description: "Delivery Charge\nرسم توصيل", orderedQuantity: "1.00", deliveredQuantity: "1.00", unitPriceIncludingVat: "25.00", substitutionDiscount: "0.00" },
    { description: "Service Fee\nرسوم خدمة", orderedQuantity: "1.00", deliveredQuantity: "1.00", unitPriceIncludingVat: "9.90", substitutionDiscount: "0.00" },
  ],
  paymentType: "Debit Card",
  myClubCardNumber: "**********76830",
  loyaltyName: "Hussein Mahmoud",
  earnedPoints: "29.96",
});

const HEADER_LAYOUT = [
  { path: "orderNumber", pages: [1, 2], cover: [404, 364, 684, 397], box: [404, 360, 950, 401], baseline: 392, fontSize: 28, minFontSize: 14 },
  { path: "invoiceNumber", pages: [1, 2], cover: [404, 410, 553, 443], box: [404, 406, 950, 447], baseline: 438, fontSize: 28, minFontSize: 14 },
  { path: "invoiceDate", pages: [1, 2], cover: [404, 456, 601, 494], box: [404, 452, 900, 498], baseline: 488, fontSize: 28, minFontSize: 14 },
  { path: "expectedDeliveryDate", pages: [1, 2], cover: [404, 501, 601, 539], box: [404, 497, 900, 543], baseline: 533, fontSize: 28, minFontSize: 14 },
];

const CUSTOMER_LAYOUT = [
  { path: "customer.name", cover: [51, 844, 217, 873], box: [51, 840, 713, 880], baseline: 871, fontSize: 27, minFontSize: 12, direction: "auto" },
  { path: "customer.addressLatin", cover: [51, 892, 713, 925], box: [51, 888, 713, 929], baseline: 919, fontSize: 26, minFontSize: 12, direction: "ltr" },
  { path: "customer.addressArabic", cover: [52, 939, 618, 1020], box: [52, 935, 713, 1024], baseline: 1014, fontSize: 26, minFontSize: 12, direction: "rtl" },
  { path: "customer.taxId", cover: [52, 1035, 262, 1059], box: [52, 1031, 500, 1061], baseline: 1057, fontSize: 25, minFontSize: 12, direction: "ltr" },
  { path: "customer.phone", cover: [52, 1059, 262, 1085], box: [52, 1057, 500, 1089], baseline: 1082, fontSize: 25, minFontSize: 12, direction: "ltr" },
];

const ITEM_ROW_LAYOUT = [
  { top: 1600, bottom: 1663, baseline: 1628 },
  { top: 1827, bottom: 1889, baseline: 1855 },
  { top: 2054, bottom: 2084, baseline: 2082 },
  { top: 2280, bottom: 2343, baseline: 2308 },
  { top: 2507, bottom: 2592, baseline: 2535 },
  { top: 2734, bottom: 2818, baseline: 2762 },
];

const ITEM_COLUMN_LAYOUT = {
  description: { x0: 52, x1: 510, align: "left", fontSize: 28, minFontSize: 12 },
  orderedQuantity: { x0: 520, x1: 650, align: "center", fontSize: 27, minFontSize: 12 },
  deliveredQuantity: { x0: 670, x1: 790, align: "center", fontSize: 27, minFontSize: 12 },
  unitPriceIncludingVat: { x0: 845, x1: 1010, align: "center", fontSize: 27, minFontSize: 12 },
  unitPriceExcludingVat: { x0: 1070, x1: 1235, align: "center", fontSize: 27, minFontSize: 12 },
  totalPriceExcludingVat: { x0: 1280, x1: 1460, align: "center", fontSize: 27, minFontSize: 12 },
  vatRate: { x0: 1480, x1: 1600, align: "center", fontSize: 27, minFontSize: 12 },
  vatAmount: { x0: 1630, x1: 1805, align: "center", fontSize: 27, minFontSize: 12 },
  substitutionDiscount: { x0: 1918, x1: 2010, align: "center", fontSize: 27, minFontSize: 12 },
  totalPriceIncludingVat: { x0: 2150, x1: 2330, align: "center", fontSize: 27, minFontSize: 12 },
};

const PAGE_TWO_LAYOUT = [
  { key: "grandTotal", pages: [2], cover: [2067, 609, 2328, 649], box: [2000, 602, 2328, 655], baseline: 645, fontSize: 36, minFontSize: 14, weight: "700", color: "#0966b3", align: "right", background: "#ffffff" },
  { key: "amountInWords", pages: [2], cover: [376, 717, 2004, 756], box: [52, 690, 2329, 773], baseline: 747, fontSize: 29, minFontSize: 12, align: "center", background: "#f1f5f6" },
  { key: "netSubtotal", pages: [2], cover: [1572, 939, 1919, 976], box: [1545, 933, 1925, 980], baseline: 971, fontSize: 28, minFontSize: 12, align: "right", background: "#ffffff" },
  { key: "vatSubtotal", pages: [2], cover: [2147, 939, 2318, 976], box: [2100, 933, 2328, 980], baseline: 971, fontSize: 28, minFontSize: 12, align: "right", background: "#ffffff" },
  { key: "netTotal", pages: [2], cover: [1750, 1004, 1919, 1030], box: [1680, 999, 1925, 1034], baseline: 1026, fontSize: 28, minFontSize: 12, weight: "700", align: "right", background: "#ffffff" },
  { key: "vatTotal", pages: [2], cover: [2168, 1004, 2318, 1030], box: [2100, 999, 2328, 1034], baseline: 1026, fontSize: 28, minFontSize: 12, weight: "700", align: "right", background: "#ffffff" },
  { key: "paymentType", pages: [2], cover: [450, 1194, 697, 1226], box: [450, 1189, 850, 1230], baseline: 1220, fontSize: 32, minFontSize: 12, background: "#ffffff" },
  { key: "paymentAmount", pages: [2], cover: [450, 1248, 697, 1282], box: [450, 1243, 850, 1286], baseline: 1277, fontSize: 32, minFontSize: 12, background: "#ffffff" },
  { key: "myClubCardNumber", pages: [2], cover: [1633, 1194, 1859, 1226], box: [1633, 1189, 1940, 1230], baseline: 1220, fontSize: 32, minFontSize: 12, background: "#ffffff" },
  { key: "loyaltyName", pages: [2], cover: [1635, 1248, 1914, 1282], box: [1635, 1243, 1940, 1286], baseline: 1277, fontSize: 32, minFontSize: 12, background: "#ffffff" },
  { key: "earnedPoints", pages: [2], cover: [1634, 1301, 1717, 1326], box: [1634, 1296, 1900, 1330], baseline: 1321, fontSize: 32, minFontSize: 12, background: "#ffffff" },
];

const BARCODE_LAYOUT = {
  cover: [1780, 3135, 2320, 3292],
  bars: [1801, 3142, 2292, 3245],
  readableText: [1985, 3252, 2110, 3290],
};

const PAGE_ONE_BACKGROUND = "#f2f2f2";
const PAGE_TWO_PANEL_BACKGROUND = "#f1f5f6";
const CODE39_PATTERN = /^[0-9A-Z .\-$\/+%]+$/;
const INVOICE_BARCODE_MAX_CHARACTERS = 8;
const MONEY_PATTERN = /^\d+(?:\.\d{0,2})?$/;

export function createInvoiceData() {
  return structuredClone(INVOICE_DEFAULT_DATA);
}

export function getInvoiceValue(data, path) {
  return path.split(".").reduce((value, part) => value?.[part], data);
}

export function setInvoiceValue(data, path, value) {
  const parts = path.split(".");
  const finalPart = parts.pop();
  const target = parts.reduce((current, part) => current[part], data);
  target[finalPart] = value;
}

export function invoiceHasChanges(data) {
  return JSON.stringify(data) !== JSON.stringify(INVOICE_DEFAULT_DATA);
}

function parseCents(value) {
  const normalized = String(value).trim().replaceAll(",", "");
  if (!MONEY_PATTERN.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

function roundRatio(numerator, denominator) {
  return Math.floor((numerator + denominator / 2) / denominator);
}

function formatMoney(cents) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatQuantity(cents) {
  return (cents / 100).toFixed(2);
}

function numberToWords(number) {
  const ones = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function underThousand(value) {
    const words = [];
    if (value >= 100) {
      words.push(`${ones[Math.floor(value / 100)]} Hundred`);
      value %= 100;
    }
    if (value >= 20) {
      const remainder = value % 10;
      words.push(remainder > 0
        ? `${tens[Math.floor(value / 10)]}-${ones[remainder]}`
        : tens[Math.floor(value / 10)]);
      value = 0;
    } else if (value >= 10) {
      words.push(teens[value - 10]);
      value = 0;
    }
    if (value > 0) words.push(ones[value]);
    return words.join(" ");
  }

  if (number === 0) return "Zero";
  const groups = [
    [1_000_000, "Million"],
    [1_000, "Thousand"],
    [1, ""],
  ];
  let remainder = number;
  const words = [];
  for (const [divisor, suffix] of groups) {
    const group = Math.floor(remainder / divisor);
    remainder %= divisor;
    if (group > 0) {
      words.push(underThousand(group));
      if (suffix) words.push(suffix);
    }
  }
  return words.join(" ");
}

function amountInWords(cents) {
  const whole = Math.floor(cents / 100);
  const fractional = cents % 100;
  return `Total Amount Incl. VAT: EGP ${numberToWords(whole)} and ${numberToWords(fractional)} Qirsh`;
}

export function calculateInvoice(data) {
  const errors = [];
  const items = data.items.map((item, index) => {
    const rowNumber = index + 1;
    const orderedQuantity = parseCents(item.orderedQuantity);
    const deliveredQuantity = parseCents(item.deliveredQuantity);
    const unitPriceIncludingVat = parseCents(item.unitPriceIncludingVat);
    const substitutionDiscount = parseCents(item.substitutionDiscount);

    if (orderedQuantity === null || deliveredQuantity === null) {
      errors.push(`Enter valid quantities in item row ${rowNumber}.`);
    }
    if (unitPriceIncludingVat === null || substitutionDiscount === null) {
      errors.push(`Enter valid prices and discount in item row ${rowNumber}.`);
    }
    if (
      orderedQuantity === null
      || deliveredQuantity === null
      || unitPriceIncludingVat === null
      || substitutionDiscount === null
    ) {
      return null;
    }

    const grossCents = roundRatio(deliveredQuantity * unitPriceIncludingVat, 100);
    const discountedGrossCents = grossCents - substitutionDiscount;
    if (discountedGrossCents < 0) {
      errors.push(`The discount in item row ${rowNumber} cannot exceed its delivered total.`);
      return null;
    }

    const netCents = roundRatio(discountedGrossCents * 100, 114);
    const vatCents = discountedGrossCents - netCents;
    const unitPriceExcludingVat = roundRatio(unitPriceIncludingVat * 100, 114);

    return {
      unitPriceExcludingVat,
      totalPriceExcludingVat: netCents,
      vatRate: "14.00",
      vatAmount: vatCents,
      totalPriceIncludingVat: discountedGrossCents,
      orderedQuantity,
      deliveredQuantity,
    };
  });

  if (errors.length > 0 || items.some((item) => item === null)) {
    return { errors, items: null };
  }

  const netTotal = items.reduce((total, item) => total + item.totalPriceExcludingVat, 0);
  const vatTotal = items.reduce((total, item) => total + item.vatAmount, 0);
  const grandTotal = netTotal + vatTotal;
  if (![netTotal, vatTotal, grandTotal].every(Number.isSafeInteger)) {
    return { errors: ["Invoice totals exceed the supported amount."], items: null };
  }

  return {
    errors: [],
    items,
    netTotal,
    vatTotal,
    grandTotal,
    amountInWords: amountInWords(grandTotal),
  };
}

export function validateInvoice(data) {
  const errors = [];
  if (!data.invoiceNumber.trim() || !CODE39_PATTERN.test(data.invoiceNumber)) {
    errors.push("Invoice number must use Code 39 characters: A–Z, 0–9, space, or - . $ / + %.");
  }
  if (data.invoiceNumber.length > INVOICE_BARCODE_MAX_CHARACTERS) {
    errors.push(`Invoice number must be ${INVOICE_BARCODE_MAX_CHARACTERS} characters or fewer to preserve the reference barcode width.`);
  }
  if (!Number.isFinite(Number(data.earnedPoints)) || Number(data.earnedPoints) < 0) {
    errors.push("Enter a non-negative earned-points value.");
  }
  const calculations = calculateInvoice(data);
  errors.push(...calculations.errors);
  if (errors.length > 0) return { errors, calculations: null };

  try {
    encodeCode39(data.invoiceNumber);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "The invoice number cannot be encoded.");
  }
  return { errors, calculations: errors.length === 0 ? calculations : null };
}

function fitFont(context, value, box, options) {
  let size = options.fontSize;
  const minFontSize = options.minFontSize ?? 12;
  const lines = String(value).split(/\r?\n/);
  const availableHeight = box.y1 - box.y0;
  let lineHeight;

  while (true) {
    lineHeight = options.lineHeight ? Math.min(options.lineHeight, Math.ceil(size * 1.2)) : Math.ceil(size * 1.2);
    context.font = `${options.weight || "400"} ${size}px ${options.fontFamily || "Arial"}, sans-serif`;
    const fitsWidth = lines.every((line) => context.measureText(line).width <= box.x1 - box.x0);
    if (fitsWidth && lines.length * lineHeight <= availableHeight) break;
    if (size <= minFontSize) break;
    size -= 1;
  }
  context.font = `${options.weight || "400"} ${size}px ${options.fontFamily || "Arial"}, sans-serif`;
  return { size, lineHeight, lines };
}

function drawTextField(context, value, field) {
  const [coverX0, coverY0, coverX1, coverY1] = field.cover;
  const box = {
    x0: field.box[0],
    y0: field.box[1],
    x1: field.box[2],
    y1: field.box[3],
  };

  context.save();
  context.fillStyle = field.background || "#ffffff";
  context.fillRect(coverX0 - 1, coverY0 - 1, coverX1 - coverX0 + 2, coverY1 - coverY0 + 2);
  context.beginPath();
  context.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
  context.clip();
  context.textAlign = field.align || "left";
  context.textBaseline = "alphabetic";
  context.fillStyle = field.color || "#111111";

  if (value !== "") {
    const { lines, lineHeight } = fitFont(context, value, box, field);
    const firstBaseline = lines.length > 1
      ? field.baseline - ((lines.length - 1) * lineHeight) / 2
      : field.baseline;
    const x = field.align === "right"
      ? box.x1
      : field.align === "center"
        ? (box.x0 + box.x1) / 2
        : box.x0;
    lines.forEach((line, index) => {
      context.direction = field.direction === "auto"
        ? (/[\u0600-\u06ff]/.test(line) ? "rtl" : "ltr")
        : (field.direction || "ltr");
      context.fillText(line, x, firstBaseline + index * lineHeight);
    });
  }
  context.restore();
}

function originalValue(path) {
  return getInvoiceValue(INVOICE_DEFAULT_DATA, path);
}

function drawChangedField(context, data, path, layout, background = PAGE_ONE_BACKGROUND) {
  const value = getInvoiceValue(data, path);
  if (value === originalValue(path)) return;
  drawTextField(context, value, { ...layout, background });
}

function drawBarcode(context, invoiceNumber) {
  const runs = encodeCode39(invoiceNumber);
  const [coverX0, coverY0, coverX1, coverY1] = BARCODE_LAYOUT.cover;
  const [x0, y0, x1, y1] = BARCODE_LAYOUT.bars;
  context.save();
  context.fillStyle = "#ffffff";
  context.fillRect(coverX0, coverY0, coverX1 - coverX0, coverY1 - coverY0);
  context.fillStyle = "#111111";
  const totalModules = runs.reduce((sum, run) => sum + run.width, 0);
  const moduleWidth = (x1 - x0) / totalModules;
  let offset = 0;
  for (const run of runs) {
    const start = Math.round(offset * moduleWidth);
    offset += run.width;
    const end = Math.round(offset * moduleWidth);
    if (run.bar) context.fillRect(x0 + start, y0, end - start, y1 - y0);
  }
  drawTextField(context, invoiceNumber, {
    cover: BARCODE_LAYOUT.readableText,
    box: [BARCODE_LAYOUT.readableText[0], BARCODE_LAYOUT.readableText[1], BARCODE_LAYOUT.readableText[2], BARCODE_LAYOUT.readableText[3]],
    baseline: 3282,
    fontSize: 18,
    minFontSize: 10,
    align: "center",
    background: "#ffffff",
  });
  context.restore();
}

function drawHeader(context, data) {
  for (const field of HEADER_LAYOUT) {
    if (getInvoiceValue(data, field.path) === originalValue(field.path)) continue;
    drawTextField(context, getInvoiceValue(data, field.path), {
      ...field,
      background: PAGE_ONE_BACKGROUND,
    });
  }
}

function drawCustomer(context, data) {
  for (const field of CUSTOMER_LAYOUT) {
    drawChangedField(context, data, field.path, field);
  }
}

function formatItemValue(item, calculation, key) {
  switch (key) {
    case "description": return item.description;
    case "orderedQuantity": return formatQuantity(calculation.orderedQuantity);
    case "deliveredQuantity": return formatQuantity(calculation.deliveredQuantity);
    case "unitPriceIncludingVat": return item.unitPriceIncludingVat;
    case "substitutionDiscount": return item.substitutionDiscount;
    case "unitPriceExcludingVat": return formatMoney(calculation.unitPriceExcludingVat);
    case "totalPriceExcludingVat": return formatMoney(calculation.totalPriceExcludingVat);
    case "vatRate": return calculation.vatRate;
    case "vatAmount": return formatMoney(calculation.vatAmount);
    case "totalPriceIncludingVat": return formatMoney(calculation.totalPriceIncludingVat);
    default: throw new Error(`Unknown invoice item field: ${key}`);
  }
}

function originalItemValue(itemIndex, key, calculations) {
  return formatItemValue(
    INVOICE_DEFAULT_DATA.items[itemIndex],
    calculations.items[itemIndex],
    key
  );
}

function drawItems(context, data, calculations, sourceCalculations) {
  for (let rowIndex = 0; rowIndex < data.items.length; rowIndex += 1) {
    const row = ITEM_ROW_LAYOUT[rowIndex];
    const item = data.items[rowIndex];
    const calculation = calculations.items[rowIndex];
    for (const [key, column] of Object.entries(ITEM_COLUMN_LAYOUT)) {
      const value = formatItemValue(item, calculation, key);
      if (value === originalItemValue(rowIndex, key, sourceCalculations)) continue;

      const cover = [column.x0, row.top, column.x1, row.bottom];
      const isDescription = key === "description";
      drawTextField(context, value, {
        cover,
        box: [column.x0, row.top, column.x1, row.bottom],
        baseline: row.baseline,
        fontSize: column.fontSize,
        minFontSize: column.minFontSize,
        lineHeight: 30,
        align: column.align,
        background: "#ffffff",
        direction: isDescription ? "auto" : "ltr",
        weight: "400",
      });
    }
  }
}

function drawPageTwoFields(context, data, calculations, sourceCalculations) {
  const dynamicValues = {
    grandTotal: `EGP ${formatMoney(calculations.grandTotal)}`,
    amountInWords: calculations.amountInWords,
    netSubtotal: formatMoney(calculations.netTotal),
    vatSubtotal: formatMoney(calculations.vatTotal),
    netTotal: formatMoney(calculations.netTotal),
    vatTotal: formatMoney(calculations.vatTotal),
    paymentType: data.paymentType,
    paymentAmount: `EGP ${formatMoney(calculations.grandTotal)}`,
    myClubCardNumber: data.myClubCardNumber,
    loyaltyName: data.loyaltyName,
    earnedPoints: data.earnedPoints,
  };
  const originalValues = {
    grandTotal: `EGP ${formatMoney(sourceCalculations.grandTotal)}`,
    amountInWords: sourceCalculations.amountInWords,
    netSubtotal: formatMoney(sourceCalculations.netTotal),
    vatSubtotal: formatMoney(sourceCalculations.vatTotal),
    netTotal: formatMoney(sourceCalculations.netTotal),
    vatTotal: formatMoney(sourceCalculations.vatTotal),
    paymentType: INVOICE_DEFAULT_DATA.paymentType,
    paymentAmount: `EGP ${formatMoney(sourceCalculations.grandTotal)}`,
    myClubCardNumber: INVOICE_DEFAULT_DATA.myClubCardNumber,
    loyaltyName: INVOICE_DEFAULT_DATA.loyaltyName,
    earnedPoints: INVOICE_DEFAULT_DATA.earnedPoints,
  };

  for (const field of PAGE_TWO_LAYOUT) {
    if (dynamicValues[field.key] === originalValues[field.key]) continue;
    drawTextField(context, dynamicValues[field.key], {
      ...field,
      background: field.key === "amountInWords" ? PAGE_TWO_PANEL_BACKGROUND : "#ffffff",
    });
  }
}

export function renderInvoicePage(context, image, data, calculations, sourceCalculations, pageNumber) {
  context.clearRect(0, 0, INVOICE_PAGE.widthPx, INVOICE_PAGE.heightPx);
  context.drawImage(image, 0, 0, INVOICE_PAGE.widthPx, INVOICE_PAGE.heightPx);

  drawHeader(context, data);
  if (pageNumber === 1) {
    drawCustomer(context, data);
    drawItems(context, data, calculations, sourceCalculations);
  } else {
    drawPageTwoFields(context, data, calculations, sourceCalculations);
  }

  if (data.invoiceNumber !== INVOICE_DEFAULT_DATA.invoiceNumber) {
    drawBarcode(context, data.invoiceNumber);
  }
}

function appendControl(parent, { label, path, value, multiline = false, direction, inputMode, maxLength }) {
  const group = document.createElement("label");
  group.className = "invoice-field";
  group.textContent = label;

  const control = multiline
    ? document.createElement("textarea")
    : document.createElement("input");
  control.className = "field-input";
  control.dataset.invoicePath = path;
  control.value = value;
  control.autocomplete = "off";
  if (multiline) {
    control.rows = 2;
  } else {
    control.type = "text";
    if (inputMode) control.inputMode = inputMode;
    if (maxLength) control.maxLength = maxLength;
  }
  if (direction) {
    control.dir = direction;
    if (direction === "rtl") control.lang = "ar";
  }
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

export function createInvoiceControls(container, data) {
  container.replaceChildren();

  const identifiers = createFieldset(container, "Invoice identifiers", "invoice-identifiers");
  appendControl(identifiers, { label: "Order number", path: "orderNumber", value: data.orderNumber, maxLength: 40 });
  appendControl(identifiers, {
    label: `Invoice number (up to ${INVOICE_BARCODE_MAX_CHARACTERS} Code 39 characters; updates both barcodes)`,
    path: "invoiceNumber",
    value: data.invoiceNumber,
    maxLength: INVOICE_BARCODE_MAX_CHARACTERS,
  });
  appendControl(identifiers, { label: "Invoice date", path: "invoiceDate", value: data.invoiceDate, maxLength: 30 });
  appendControl(identifiers, { label: "Expected delivery date", path: "expectedDeliveryDate", value: data.expectedDeliveryDate, maxLength: 30 });

  const customer = createFieldset(container, "Customer information", "invoice-customer");
  appendControl(customer, { label: "Customer name", path: "customer.name", value: data.customer.name, maxLength: 120 });
  appendControl(customer, { label: "Latin address", path: "customer.addressLatin", value: data.customer.addressLatin, multiline: true, maxLength: 240 });
  appendControl(customer, { label: "Arabic address", path: "customer.addressArabic", value: data.customer.addressArabic, multiline: true, direction: "rtl", maxLength: 240 });
  appendControl(customer, { label: "Tax ID", path: "customer.taxId", value: data.customer.taxId, maxLength: 40 });
  appendControl(customer, { label: "Phone", path: "customer.phone", value: data.customer.phone, inputMode: "tel", maxLength: 40 });

  const items = createFieldset(container, "Items and charges", "invoice-items");
  const note = document.createElement("p");
  note.className = "invoice-calculation-note";
  note.textContent = "Delivered quantity, VAT-inclusive unit price, and discount determine each row total. VAT is 14%.";
  items.append(note);

  data.items.forEach((item, index) => {
    const row = createFieldset(items, `Row ${index + 1}`, "invoice-item-row");
    appendControl(row, { label: "Description", path: `items.${index}.description`, value: item.description, multiline: true, maxLength: 180 });
    appendControl(row, { label: "Ordered quantity", path: `items.${index}.orderedQuantity`, value: item.orderedQuantity, inputMode: "decimal", maxLength: 20 });
    appendControl(row, { label: "Delivered quantity", path: `items.${index}.deliveredQuantity`, value: item.deliveredQuantity, inputMode: "decimal", maxLength: 20 });
    appendControl(row, { label: "Unit price incl. VAT", path: `items.${index}.unitPriceIncludingVat`, value: item.unitPriceIncludingVat, inputMode: "decimal", maxLength: 20 });
    appendControl(row, { label: "Substitution discount", path: `items.${index}.substitutionDiscount`, value: item.substitutionDiscount, inputMode: "decimal", maxLength: 20 });
  });

  const payment = createFieldset(container, "Payment and loyalty details", "invoice-payment");
  appendControl(payment, { label: "Payment type", path: "paymentType", value: data.paymentType, maxLength: 40 });
  appendControl(payment, { label: "MyClub card number", path: "myClubCardNumber", value: data.myClubCardNumber, maxLength: 40 });
  appendControl(payment, { label: "Loyalty customer name", path: "loyaltyName", value: data.loyaltyName, maxLength: 120 });
  appendControl(payment, { label: "Earned points", path: "earnedPoints", value: data.earnedPoints, inputMode: "decimal", maxLength: 20 });
}

export function formatMoneyForDisplay(cents) {
  return formatMoney(cents);
}
