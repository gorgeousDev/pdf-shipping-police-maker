const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312",
  "132212", "221213", "221312", "231212", "112232", "122132", "122231", "113222",
  "123122", "123221", "223211", "221132", "221231", "213212", "223112", "312131",
  "311222", "321122", "321221", "312212", "322112", "322211", "212123", "212321",
  "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121",
  "313121", "211331", "231131", "213113", "213311", "213131", "311123", "311321",
  "331121", "312113", "312311", "332111", "314111", "221411", "431111", "111224",
  "111422", "121124", "121421", "141122", "141221", "112214", "112412", "122114",
  "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112",
  "421211", "212141", "214121", "412121", "111143", "111341", "131141", "114113",
  "114311", "411113", "411311", "113141", "114131", "311141", "411131", "211412",
  "211214", "211232", "2331112",
];

const CODE39_PATTERNS = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  "$": "nwnwnwnnn",
  "/": "nwnwnnnwn",
  "+": "nwnnnwnwn",
  "%": "nnnwnwnwn",
  "*": "nwnnwnwnn",
};

const CODE39_ALLOWED = /^[0-9A-Z .\-$\/+%]+$/;

function addChecksumAndStop(dataWords) {
  const checksum = dataWords.reduce(
    (sum, value, index) => sum + (index === 0 ? value : index * value),
    0
  ) % 103;
  return [...dataWords, checksum, 106];
}

function valueForCodeSetB(character) {
  const code = character.charCodeAt(0);
  if (code < 32 || code > 126) {
    throw new Error("The label ID contains a character unsupported by Code 128.");
  }
  return code - 32;
}

export function encodeCode128A(value) {
  const dataWords = [103, ...[...value].map((character) => {
    const code = character.charCodeAt(0);
    if (code < 32 || code > 95) {
      throw new Error("The label ID contains a character unsupported by Code 128 Set A.");
    }
    return code - 32;
  })];
  return addChecksumAndStop(dataWords);
}

export function encodeCode128BWithNumericCompression(value) {
  const dataWords = [104];
  let index = 0;

  while (index < value.length) {
    const digitRun = value.slice(index).match(/^\d+/)?.[0] || "";
    if (digitRun.length >= 4) {
      if (digitRun.length % 2 === 1) {
        dataWords.push(valueForCodeSetB(value[index]));
        index += 1;
        continue;
      }

      dataWords.push(99);
      while (index < value.length && /^\d{2}/.test(value.slice(index))) {
        dataWords.push(Number(value.slice(index, index + 2)));
        index += 2;
      }
      if (index < value.length) dataWords.push(100);
      continue;
    }

    dataWords.push(valueForCodeSetB(value[index]));
    index += 1;
  }

  return addChecksumAndStop(dataWords);
}

export function code128Runs(symbols) {
  return symbols.flatMap((symbol) => {
    const pattern = CODE128_PATTERNS[symbol];
    if (!pattern) {
      throw new Error(`Missing Code 128 pattern for symbol ${symbol}.`);
    }
    return [...pattern].map((width, index) => ({
      width: Number(width),
      bar: index % 2 === 0,
    }));
  });
}

export function encodeCode39(value) {
  if (!CODE39_ALLOWED.test(value)) {
    throw new Error("The invoice number contains a character unsupported by Code 39.");
  }

  const characters = `*${value}*`;
  return [...characters].flatMap((character, characterIndex) => {
    const pattern = CODE39_PATTERNS[character];
    if (!pattern) {
      throw new Error(`Missing Code 39 pattern for character ${character}.`);
    }

    const runs = [...pattern].map((width, index) => ({
      width: width === "w" ? 3 : 1,
      bar: index % 2 === 0,
    }));
    if (characterIndex < characters.length - 1) {
      runs.push({ width: 1, bar: false });
    }
    return runs;
  });
}
