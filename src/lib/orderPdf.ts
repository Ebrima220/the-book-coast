import { formatMoney } from "./catalog";
import { store } from "../data/store";

export type OrderPdfLine = {
  title: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

export type OrderPdfInput = {
  name: string;
  address: string;
  homeDelivery: boolean;
  note: string;
  lines: OrderPdfLine[];
  total: number;
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 48;
const TOP = PAGE_HEIGHT - MARGIN;
const BOTTOM = MARGIN;

const WIN1252: Record<string, number> = {
  "€": 0x80,
  "‚": 0x82,
  "ƒ": 0x83,
  "„": 0x84,
  "…": 0x85,
  "†": 0x86,
  "‡": 0x87,
  "ˆ": 0x88,
  "‰": 0x89,
  "Š": 0x8a,
  "‹": 0x8b,
  "Œ": 0x8c,
  "Ž": 0x8e,
  "‘": 0x91,
  "’": 0x92,
  "“": 0x93,
  "”": 0x94,
  "•": 0x95,
  "–": 0x96,
  "—": 0x97,
  "˜": 0x98,
  "™": 0x99,
  "š": 0x9a,
  "›": 0x9b,
  "œ": 0x9c,
  "ž": 0x9e,
  "Ÿ": 0x9f,
};

type FontName = "F1" | "F2";

type DrawnLine = {
  text: string;
  font: FontName;
  size: number;
  y: number;
};

function winAnsiByte(char: string): number {
  const code = char.codePointAt(0) ?? 0x3f;
  if (code >= 0x20 && code <= 0x7e) return code;
  if (code >= 0xa0 && code <= 0xff) return code;
  return WIN1252[char] ?? 0x3f;
}

function pdfString(text: string): string {
  let out = "(";
  for (const char of text) {
    const byte = winAnsiByte(char);
    if (byte === 0x28 || byte === 0x29 || byte === 0x5c) {
      out += `\\${String.fromCharCode(byte)}`;
    } else if (byte < 0x20 || byte > 0x7e) {
      out += `\\${byte.toString(8).padStart(3, "0")}`;
    } else {
      out += String.fromCharCode(byte);
    }
  }
  return `${out})`;
}

function wrap(text: string, size: number): string[] {
  const width = PAGE_WIDTH - MARGIN * 2;
  const maxChars = Math.max(20, Math.floor(width / (size * 0.52)));
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const pieces = word.length > maxChars ? word.match(new RegExp(`.{1,${maxChars}}`, "g")) ?? [word] : [word];
      for (const piece of pieces) {
        const next = current ? `${current} ${piece}` : piece;
        if (current && next.length > maxChars) {
          lines.push(current);
          current = piece;
        } else {
          current = next;
        }
      }
    }
    if (current) lines.push(current);
  }
  return lines.length > 0 ? lines : [""];
}

function receiptLines(input: OrderPdfInput): { text: string; font: FontName; size: number; gap: number }[] {
  const delivery = input.homeDelivery ? "Yes (extra fees may apply)" : "No";
  const rows: { text: string; font: FontName; size: number; gap: number }[] = [
    { text: store.name, font: "F2", size: 22, gap: 8 },
    { text: "Order receipt", font: "F1", size: 12, gap: 16 },
    {
      text: "Thank you for your order. Please confirm the books and the final price.",
      font: "F1",
      size: 11,
      gap: 16,
    },
    { text: `Name: ${input.name.trim()}`, font: "F1", size: 11, gap: 8 },
    { text: "Address:", font: "F1", size: 11, gap: 4 },
    { text: input.address.trim(), font: "F1", size: 11, gap: 8 },
    { text: `Home delivery: ${delivery}`, font: "F1", size: 11, gap: 18 },
    { text: "Books", font: "F2", size: 13, gap: 10 },
  ];
  for (const line of input.lines) {
    rows.push(
      { text: line.title, font: "F2", size: 11, gap: 3 },
      {
        text: `${line.quantity} × ${formatMoney(line.price)}`,
        font: "F1",
        size: 11,
        gap: 3,
      },
      { text: formatMoney(line.lineTotal), font: "F1", size: 11, gap: 12 },
    );
  }
  rows.push({ text: `Total: ${formatMoney(input.total)}`, font: "F2", size: 13, gap: 16 });
  if (input.note.trim()) {
    rows.push(
      { text: "Note:", font: "F2", size: 11, gap: 4 },
      { text: input.note.trim(), font: "F1", size: 11, gap: 8 },
    );
  }
  return rows;
}

function layoutPages(input: OrderPdfInput): DrawnLine[][] {
  const pages: DrawnLine[][] = [];
  let page: DrawnLine[] = [];
  let y = TOP;

  const nextPage = () => {
    if (page.length > 0) pages.push(page);
    page = [];
    y = TOP;
  };

  for (const row of receiptLines(input)) {
    const wrapped = wrap(row.text, row.size);
    wrapped.forEach((text, index) => {
      const gap = index === wrapped.length - 1 ? row.gap : 3;
      if (y - row.size < BOTTOM) nextPage();
      page.push({ text, font: row.font, size: row.size, y: y - row.size });
      y -= row.size + gap;
    });
  }
  if (page.length > 0) pages.push(page);
  return pages.length > 0 ? pages : [[]];
}

function pageStream(lines: DrawnLine[]): string {
  const commands = ["BT"];
  for (const line of lines) {
    commands.push(`/${line.font} ${line.size} Tf`);
    commands.push(`1 0 0 1 ${MARGIN} ${line.y.toFixed(2)} Tm`);
    commands.push(`${pdfString(line.text)} Tj`);
  }
  commands.push("ET");
  return commands.join("\n");
}

function assemble(objects: string[]): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let offset = 0;
  const offsets = [0];
  const push = (value: string) => {
    const bytes = encoder.encode(value);
    chunks.push(bytes);
    offset += bytes.length;
  };
  push("%PDF-1.4\n");
  objects.forEach((object, index) => {
    offsets.push(offset);
    push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });
  const xrefAt = offset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    xref += `${offsets[index].toString().padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;
  push(xref);
  const pdf = new Uint8Array(offset);
  let cursor = 0;
  for (const chunk of chunks) {
    pdf.set(chunk, cursor);
    cursor += chunk.length;
  }
  return pdf;
}

export function buildOrderPdf(input: OrderPdfInput): Uint8Array {
  const pages = layoutPages(input);
  const objects: string[] = new Array(4 + pages.length * 2);
  const kids = pages.map((_, index) => `${5 + index * 2} 0 R`);
  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`;
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  pages.forEach((lines, index) => {
    const pageId = 5 + index * 2;
    const streamId = pageId + 1;
    const stream = pageStream(lines);
    objects[pageId - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents ${streamId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`;
    objects[streamId - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });
  return assemble(objects);
}

export function orderPdfFile(input: OrderPdfInput): File {
  const pdf = buildOrderPdf(input);
  const buffer = new ArrayBuffer(pdf.byteLength);
  new Uint8Array(buffer).set(pdf);
  return new File([buffer], "the-book-coast-order.pdf", { type: "application/pdf" });
}
