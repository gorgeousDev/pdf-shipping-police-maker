export const TAX_INVOICE_PAGE = Object.freeze({
  widthPt: 596,
  heightPt: 842,
  widthPx: 2384,
  heightPx: 3368,
  scale: 4,
});

const TAX_INVOICE_FONT_FAMILY = "Electronic Invoice DejaVu Sans";
const TAX_INVOICE_TABLE_FONT_SIZE = 4.8;
const TAX_INVOICE_TABLE_CLEAR_AREA = Object.freeze({ x: 298, y: 1275, width: 1800, height: 1024 });

const TAX_INVOICE_AMOUNT_DECIMALS = 5;
const TAX_INVOICE_VAT_RATE = 0.14;
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatArabicIndicAmount(value, decimals = TAX_INVOICE_AMOUNT_DECIMALS) {
  const rounded = roundTo(Number(value) || 0, decimals);
  const [integerPart, fractionPart] = Math.abs(rounded).toFixed(decimals).split(".");
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${rounded < 0 ? "-" : ""}${`${grouped},${fractionPart}`.replace(/[0-9]/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)])}`;
}

function buildTaxInvoiceData(source) {
  const items = source.items.map((item) => ({
    name: item.name,
    code: item.code,
    description: item.description,
    quantityUnit: `/ ${formatArabicIndicAmount(item.quantity)}\n${item.unit}`,
    unitPrice: formatArabicIndicAmount(item.unitPrice),
    salesAmount: formatArabicIndicAmount(item.quantity * item.unitPrice),
  }));
  const salesTotal = source.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountTotal = Number(source.summary.discountTotal) || 0;
  const itemDiscountTotal = Number(source.summary.itemDiscountTotal) || 0;
  const additionalInvoiceDiscount = Number(source.summary.additionalInvoiceDiscount) || 0;
  const taxableTotal = salesTotal - discountTotal - itemDiscountTotal;
  const vat = taxableTotal * TAX_INVOICE_VAT_RATE;
  const grandTotal = taxableTotal - additionalInvoiceDiscount + vat;
  return {
    status: source.status,
    submissionDate: source.submissionDate,
    issueDate: source.issueDate,
    seller: structuredClone(source.seller),
    references: structuredClone(source.references),
    buyer: structuredClone(source.buyer),
    items,
    summary: {
      salesTotal: formatArabicIndicAmount(salesTotal),
      discountTotal: formatArabicIndicAmount(discountTotal),
      itemDiscountTotal: formatArabicIndicAmount(itemDiscountTotal),
      vat: formatArabicIndicAmount(vat),
      additionalInvoiceDiscount: formatArabicIndicAmount(additionalInvoiceDiscount),
      grandTotal: formatArabicIndicAmount(grandTotal),
    },
    footer: structuredClone(source.footer),
  };
}

const TAX_INVOICE_SOURCE_DATA = {
  status: "صحيح",
  submissionDate: "(PM UTC ٠٤:٠١:٣٧ ٢٠٢٦/٠٩/٢٧) PM ٠٦:٠١:٣٧ ٢٠٢٦/٠٩/٢٧",
  issueDate: "(AM UTC ١٢:٠٠:٠٠ ٢٠٢٦/٠٩/٢٧) القاهرة AM ٠٢:٠٠:٠٠ ٢٠٢٦/٠٩/٢٧",
  seller: {
    name: "اس اند ايه للتجاره",
    registration: "731227697#",
    activityCode: "4761",
    address: "64 ش ذاكر حسين الحي السابع مدينة نصر , قسم اول مدينة نصر , القاهرة , مصر",
    locality: "القاهرة, القاهرة, EG",
  },
  references: {
    electronicId: "5PBDBSDW3WYDC86WDB3W3N7M10",
    provisionalExportInvoiceNumber: "",
    salesOrderReference: "",
    purchaseOrderReference: "",
  },
  buyer: {
    name: "زياد هشام فوزى محمود الشافعى -",
    registration: "783939507#",
    address: "ش النصر متفرع من ش 45 عصفاره قبلى",
    locality: "EG, EG, EG",
  },
  items: [
    {
      name: "ادوات منزليه",
      code: "EG-731227697-608",
      description: "زجاجة مياه حراري\nستانلس سمارت فيت\nSmart Fit Pink\n1000ml",
      quantity: 15,
      unit: "EA",
      unitPrice: 200,
    },
    {
      name: "الات الكترونيه",
      code: "EG-731227697-104",
      description: "اله حاسبه CASIO رقم FX -\n991 ES PLUS",
      quantity: 150,
      unit: "EA",
      unitPrice: 1201.754,
    },
    {
      name: "خدمات",
      code: "EG-731227697-409",
      description: "خدمة توصيل 19891",
      quantity: 60,
      unit: "EA",
      unitPrice: 0.8781,
    },
  ],
  summary: {
    discountTotal: 0,
    itemDiscountTotal: 0,
    additionalInvoiceDiscount: 0,
  },
  footer: {
    internalNumber: "GLETH-000000090",
    fileCreationDate: "30/9/26 PM 01:26 UTC+02:00",
    signature: "اس اند ايه للتجاره",
  },
};

export const TAX_INVOICE_DEFAULT_DATA = Object.freeze(buildTaxInvoiceData(TAX_INVOICE_SOURCE_DATA));

// Layout values use PDF points with a top-left origin. Covers include a small
// safety margin; text boxes remain within the existing row or value region.
export const TAX_INVOICE_FIELDS = [
  { group: "Header", path: "status", label: "Invoice status", cover: [482, 34.1, 499, 42], box: [482.7, 34.5, 498.5, 41.5], size: 7.6, minSize: 5.2, align: "right", direction: "rtl", weight: "700", fill: "#ffffff" },
  { group: "Header", path: "submissionDate", label: "Submission date and time", cover: [344.5, 47.2, 487.4, 55.5], box: [345.5, 47.4, 486, 55], size: 6.2, minSize: 4.8, align: "left", direction: "ltr", color: "#666666", fill: "#ffffff", bidiIsolate: true },
  { group: "Header", path: "issueDate", label: "Issue date and time", cover: [324.4, 60.4, 487.4, 68.5], box: [325.1, 60.7, 486, 68], size: 6.2, minSize: 4.8, align: "left", direction: "ltr", color: "#666666", fill: "#ffffff", bidiIsolate: true },
  { group: "Seller", path: "seller.name", label: "Seller name", cover: [430, 126.7, 493.6, 135], box: [430.7, 127.3, 492.5, 134], size: 5.1, minSize: 4.4, align: "right", direction: "rtl", weight: "700", scaleX: 0.94, fill: "#f9f9f9" },
  { group: "Seller", path: "seller.registration", label: "Seller registration number", cover: [429.5, 137.5, 475.7, 145.5], box: [430.5, 138, 475, 145], size: 4.8, minSize: 4.5, align: "right", direction: "ltr", weight: "700", fill: "#f9f9f9" },
  { group: "Seller", path: "seller.activityCode", label: "Seller tax activity code", cover: [207.8, 148.4, 225, 156.2], box: [208.5, 149, 224.2, 155.8], size: 4.8, minSize: 4.5, align: "right", direction: "ltr", fill: "#f9f9f9" },
  { group: "Seller", path: "seller.address", label: "Seller address", multiline: true, cover: [319, 159.2, 513, 167.1], box: [320, 159.6, 512.5, 166.5], size: 5, minSize: 4.4, align: "right", direction: "rtl", scaleX: 0.93, fill: "#f9f9f9" },
  { group: "Seller", path: "seller.locality", label: "Seller locality", cover: [464.5, 170.2, 513, 177.5], box: [465, 170.7, 512.5, 177], size: 5.1, minSize: 4.6, align: "right", direction: "rtl", scaleX: 0.97, fill: "#f9f9f9" },
  { group: "References", path: "references.electronicId", label: "Electronic invoice ID", cover: [359, 217.1, 471.5, 224.7], box: [360, 217.6, 468.5, 224], size: 4.3, minSize: 4.3, align: "right", direction: "ltr", scaleX: 1.1, fill: "#ffffff" },
  { group: "References", path: "references.provisionalExportInvoiceNumber", label: "Provisional export invoice number", cover: [76, 216.9, 190, 224.8], box: [77, 217.5, 189, 224], size: 7.5, minSize: 5, align: "left", direction: "ltr", fill: "#ffffff" },
  { group: "References", path: "references.salesOrderReference", label: "Sales order reference", cover: [76, 227.8, 210, 235.5], box: [77, 228.2, 209, 234.8], size: 7.5, minSize: 5, align: "left", direction: "ltr", fill: "#ffffff" },
  { group: "References", path: "references.purchaseOrderReference", label: "Purchase order reference", cover: [266, 227.8, 466, 235.5], box: [267, 228.2, 465, 234.8], size: 7.5, minSize: 5, align: "right", direction: "rtl", fill: "#ffffff" },
  { group: "Buyer", path: "buyer.name", label: "Buyer name", cover: [379, 263.9, 499.3, 271.4], box: [380, 264.3, 498.5, 271], size: 5, minSize: 4.5, align: "right", direction: "rtl", weight: "700", scaleX: 0.85, fill: "#ffffff" },
  { group: "Buyer", path: "buyer.registration", label: "Buyer registration number", cover: [435, 274.8, 480, 282], box: [436, 275.2, 479.4, 281.6], size: 4.8, minSize: 4.5, align: "right", direction: "ltr", weight: "700", fill: "#ffffff" },
  { group: "Buyer", path: "buyer.address", label: "Buyer address", cover: [399, 296.4, 516, 303.8], box: [400, 296.8, 515.5, 303.4], size: 5, minSize: 4.8, align: "right", direction: "rtl", scaleX: 0.95, fill: "#ffffff" },
  { group: "Buyer", path: "buyer.locality", label: "Buyer locality", cover: [479, 307.2, 516, 314.6], box: [480, 307.6, 515.5, 314.2], size: 4.4, minSize: 4.3, align: "right", direction: "ltr", scaleX: 1.05, fill: "#ffffff" },
  ...[
    { name: "Item 1", y: 357.8, y1: 403.5, valueY: 380.7, quantityBaselines: [375.3, 386.1], baselines: [370, 380.8, 391.6, 402.4] },
    { name: "Item 2", y: 407.8, y1: 432.4, valueY: 420.3, quantityBaselines: [414.9, 425.7], baselines: [420.4, 431.2] },
    { name: "Item 3", y: 437, y1: 461.3, valueY: 449.1, quantityBaselines: [443.7, 454.5], baselines: [454.2] },
  ].flatMap((row, index) => {
    const path = `items.${index}`;
    const field = (key, config) => ({ group: row.name, path: `${path}.${key}`, fill: "#ffffff", ...config });
    return [
      field("name", { label: "Item name / category", cover: [488, row.valueY - 3, 517, row.valueY + 6], box: [488.2, row.valueY - 2.5, 516, row.valueY + 5.5], size: TAX_INVOICE_TABLE_FONT_SIZE, minSize: TAX_INVOICE_TABLE_FONT_SIZE, align: "right", direction: "rtl" }),
      field("code", { label: "Item code", cover: [418, row.valueY - 3, 468, row.valueY + 6], box: [419, row.valueY - 2.5, 467.5, row.valueY + 5.5], size: TAX_INVOICE_TABLE_FONT_SIZE, minSize: TAX_INVOICE_TABLE_FONT_SIZE, align: "left", direction: "ltr" }),
      field("description", { label: "Description", multiline: true, wrap: true, cover: [319.8, row.y + 1, 386, row.y1 - 0.1], box: [320.5, row.y + 1.5, 383, row.y1 - 0.2], baselines: row.baselines, size: TAX_INVOICE_TABLE_FONT_SIZE, minSize: TAX_INVOICE_TABLE_FONT_SIZE, lineStep: 10.8, align: "right", direction: "auto" }),
      field("quantityUnit", { label: "Quantity and unit", multiline: true, cover: [269.3, row.quantityBaselines[0] - 6, 318.4, row.quantityBaselines[1] + 6], box: [270, row.quantityBaselines[0] - 4.5, 318, row.quantityBaselines[1] + 1.5], baselines: row.quantityBaselines, size: TAX_INVOICE_TABLE_FONT_SIZE, minSize: TAX_INVOICE_TABLE_FONT_SIZE, lineStep: 10.8, align: "right", direction: "rtl" }),
      field("unitPrice", { label: "Unit price", cover: [162.7, row.valueY - 3, 267.9, row.valueY + 6], box: [163.4, row.valueY - 2.5, 265.7, row.valueY + 5.5], size: TAX_INVOICE_TABLE_FONT_SIZE, minSize: TAX_INVOICE_TABLE_FONT_SIZE, align: "right", direction: "rtl", digitStyle: "arabic-indic" }),
      field("salesAmount", { label: "Sales amount", cover: [76, row.valueY - 3, 161.5, row.valueY + 6], box: [76.8, row.valueY - 2.5, 159.3, row.valueY + 5.5], size: TAX_INVOICE_TABLE_FONT_SIZE, minSize: TAX_INVOICE_TABLE_FONT_SIZE, align: "right", direction: "rtl", digitStyle: "arabic-indic" }),
    ];
  }),
  ...[
    ["salesTotal", "Sales total", 472.5],
    ["discountTotal", "Total discount", 490.6],
    ["itemDiscountTotal", "Item discount total", 508.6],
    ["vat", "VAT", 526.6],
    ["additionalInvoiceDiscount", "Additional invoice discount", 544.6],
    ["grandTotal", "Grand total", 562.6],
  ].map(([key, label, y]) => ({
    group: "Totals",
    path: `summary.${key}`,
    label,
    cover: [76, y - 1.2, 161.5, y + 6.8],
    box: [76.8, y - 0.8, 159.3, y + 6.2],
    size: TAX_INVOICE_TABLE_FONT_SIZE,
    minSize: TAX_INVOICE_TABLE_FONT_SIZE,
    align: "right",
    direction: "rtl",
    digitStyle: "arabic-indic",
    weight: key === "grandTotal" ? "700" : "400",
    fill: "#ffffff",
  })),
  { group: "Footer", path: "footer.internalNumber", label: "Internal number", cover: [435, 600.6, 486, 608.3], box: [436, 601, 484.5, 607.8], size: 7.2, minSize: 5.2, align: "right", direction: "ltr", scaleX: 0.96, fill: "#ffffff" },
  { group: "Footer", path: "footer.fileCreationDate", label: "File creation date", cover: [79.2, 627, 218.2, 634.8], box: [80, 627.4, 217.3, 634.2], size: 4.6, minSize: 4.6, align: "right", direction: "rtl", bidiIsolate: true, color: "#b3b3b3", fill: "#ffffff" },
  { group: "Footer", path: "footer.signature", label: "Seller signature", cover: [449, 625.8, 501, 633.7], box: [450, 626.2, 499, 633], size: 5, minSize: 4.8, align: "right", direction: "rtl", scaleX: 0.8, fill: "#ffffff" },
];

function getValue(data, path) {
  return path.split(".").reduce((value, key) => value?.[key], data);
}

function setValue(data, path, value) {
  const keys = path.split(".");
  const finalKey = keys.pop();
  const target = keys.reduce((current, key) => current[key], data);
  target[finalKey] = value;
}

export function formatTaxInvoiceDisplayValue(value, field) {
  const text = String(value);
  if (field.path === "footer.fileCreationDate") {
    const match = text.match(/^(\d{1,2}\/\d{1,2}\/\d{2})\s+(AM|PM)\s+(\d{2}:\d{2})\s+(?:UTC)?([+-]\d{2}:\d{2})$/u);
    if (match) {
      const [, date, meridiem, time, timezone] = match;
      return `\u2067تاريخ إنشاء الملف:\u2069 \u2066${date}\u2069 \u2066${time} ${meridiem}\u2069 \u2067التوقيت العالمي\u2069 \u2066${timezone}\u2069`;
    }
  }
  const numericOnly = /^[0-9٠-٩\s.,+-]+$/u.test(text);
  const converted = field.digitStyle === "arabic-indic" && numericOnly
    ? text.replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)])
    : text;
  return field.bidiIsolate
    ? converted.replace(/[٠-٩]+(?:[/:][٠-٩]+)*/g, (run) => `\u2066${run}\u2069`)
    : converted;
}

export function createTaxInvoiceData() {
  return structuredClone(TAX_INVOICE_DEFAULT_DATA);
}

export function setTaxInvoiceValue(data, path, value) {
  setValue(data, path, value);
}

export function taxInvoiceHasChanges(data) {
  return JSON.stringify(data) !== JSON.stringify(TAX_INVOICE_DEFAULT_DATA);
}

export function verifyTaxInvoiceOverlay(context) {
  const { widthPx, heightPx, scale } = TAX_INVOICE_PAGE;
  const allowed = new Uint8Array(widthPx * heightPx);
  for (const field of TAX_INVOICE_FIELDS) {
    const [x0, y0, x1, y1] = field.cover;
    const startX = Math.max(0, Math.floor(x0 * scale));
    const endX = Math.min(widthPx, Math.ceil(x1 * scale));
    const startY = Math.max(0, Math.floor(y0 * scale));
    const endY = Math.min(heightPx, Math.ceil(y1 * scale));
    for (let y = startY; y < endY; y += 1) {
      allowed.fill(1, y * widthPx + startX, y * widthPx + endX);
    }
  }

  const pixels = context.getImageData(0, 0, widthPx, heightPx).data;
  for (let pixel = 0; pixel < allowed.length; pixel += 1) {
    if (!allowed[pixel] && pixels[pixel * 4 + 3] !== 0) {
      throw new Error("An edited invoice overlay extends outside the measured editable fields.");
    }
  }
}

function fieldDirection(value, field) {
  return field.direction === "auto"
    ? (/[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u.test(value) ? "rtl" : "ltr")
    : (field.direction || "ltr");
}

function wrapCanvasText(context, value, maxWidth, field) {
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
      context.direction = fieldDirection(candidate, field);
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

function drawValue(context, value, field) {
  const scale = TAX_INVOICE_PAGE.scale;
  const [coverX0, coverY0, coverX1, coverY1] = field.cover;
  const [x0, y0, x1, y1] = field.box;
  context.save();
  if (field.drawBackground !== false) {
    context.fillStyle = field.fill || "#ffffff";
    context.fillRect(coverX0 * scale, coverY0 * scale, (coverX1 - coverX0) * scale, (coverY1 - coverY0) * scale);
  }
  if (field.drawText === false) {
    context.restore();
    return;
  }
  context.beginPath();
  context.rect(x0 * scale, y0 * scale, (x1 - x0) * scale, (y1 - y0) * scale);
  context.clip();
  context.textAlign = field.align || "left";
  context.textBaseline = "alphabetic";
  context.fillStyle = field.color || "#111111";

  const displayValue = formatTaxInvoiceDisplayValue(value, field);
  const rawLines = field.multiline ? displayValue.split(/\r?\n/) : [displayValue];
  const horizontalScale = field.scaleX || 1;
  const boxWidth = (x1 - x0) * scale;
  const textWidth = boxWidth / horizontalScale;
  const desiredSize = field.size * scale;
  const minimumSize = field.minSize * scale;
  const family = `"${TAX_INVOICE_FONT_FAMILY}", Arial, sans-serif`;
  let fontSize = desiredSize;
  let lines = rawLines;
  while (true) {
    context.font = `${field.weight || "400"} ${fontSize}px ${family}`;
    lines = field.wrap
      ? rawLines.flatMap((line) => wrapCanvasText(context, line, textWidth, field))
      : rawLines;
    const fits = lines.every((line) => {
      context.direction = fieldDirection(line, field);
      return context.measureText(line).width <= textWidth;
    });
    if (fits || fontSize <= minimumSize) break;
    fontSize = Math.max(minimumSize, fontSize - 1);
  }
  context.font = `${field.weight || "400"} ${fontSize}px ${family}`;
  const drawX = (field.align === "right" ? x1 : field.align === "center" ? (x0 + x1) / 2 : x0) * scale;
  const baselines = field.baselines || [field.baseline || (y1 - 1.2)];
  lines.forEach((line, index) => {
    const baseline = baselines[index] ?? (baselines[0] + (field.lineStep || 10.8) * index);
    context.direction = fieldDirection(line, field);
    context.save();
    context.translate(drawX, 0);
    context.scale(horizontalScale, 1);
    context.fillText(line, 0, baseline * scale);
    context.restore();
  });
  context.restore();
}

export function renderTaxInvoicePage(context, image, data) {
  context.clearRect(0, 0, TAX_INVOICE_PAGE.widthPx, TAX_INVOICE_PAGE.heightPx);
  context.drawImage(image, 0, 0, TAX_INVOICE_PAGE.widthPx, TAX_INVOICE_PAGE.heightPx);
  const { x, y, width, height } = TAX_INVOICE_TABLE_CLEAR_AREA;
  context.fillStyle = "#ffffff";
  context.fillRect(x, y, width, height);
  drawTaxInvoiceFieldBackgrounds(context, data);
}

export function renderTaxInvoiceOverlay(context, data) {
  context.clearRect(0, 0, TAX_INVOICE_PAGE.widthPx, TAX_INVOICE_PAGE.heightPx);
  drawTaxInvoiceFieldText(context, data);
}

export function renderTaxInvoiceTable(table, data) {
  for (const cell of table.querySelectorAll("[data-tax-invoice-path]")) {
    const field = TAX_INVOICE_FIELDS.find((entry) => entry.path === cell.dataset.taxInvoicePath);
    if (!field) {
      throw new Error(`Unknown tax invoice table field: ${cell.dataset.taxInvoicePath}`);
    }
    const value = String(getValue(data, cell.dataset.taxInvoicePath) ?? "");
    cell.textContent = value;
    cell.dir = fieldDirection(value, field);
    if (cell.dir === "rtl") {
      cell.lang = "ar";
    } else {
      cell.removeAttribute("lang");
    }
  }
}

function drawTaxInvoiceFieldBackgrounds(context, data) {
  for (const field of TAX_INVOICE_FIELDS) {
    drawValue(context, getValue(data, field.path), { ...field, drawBackground: true, drawText: false });
  }
}

function drawTaxInvoiceFieldText(context, data) {
  for (const field of TAX_INVOICE_FIELDS) {
    if (field.path.startsWith("items.") || field.path.startsWith("summary.")) {
      continue;
    }
    drawValue(context, getValue(data, field.path), { ...field, drawBackground: false });
  }
}

function appendControl(parent, field, data) {
  const group = document.createElement("label");
  group.className = "invoice-field";
  group.textContent = field.label;

  const control = field.multiline ? document.createElement("textarea") : document.createElement("input");
  control.className = "field-input";
  control.dataset.taxInvoicePath = field.path;
  control.value = getValue(data, field.path);
  control.autocomplete = "off";
  control.dir = field.direction || "ltr";
  if (field.direction === "rtl") control.lang = "ar";
  if (field.multiline) {
    control.rows = field.path.endsWith("description") ? 4 : 2;
  } else {
    control.type = "text";
    control.maxLength = 240;
  }
  group.append(control);
  parent.append(group);
}

export function createTaxInvoiceControls(container, data) {
  container.replaceChildren();
  const groups = new Map();
  for (const field of TAX_INVOICE_FIELDS) {
    let fieldset = groups.get(field.group);
    if (!fieldset) {
      fieldset = document.createElement("fieldset");
      fieldset.className = "invoice-section tax-invoice-section";
      const legend = document.createElement("legend");
      legend.textContent = field.group;
      fieldset.append(legend);
      container.append(fieldset);
      groups.set(field.group, fieldset);
    }
    appendControl(fieldset, field, data);
  }
}
