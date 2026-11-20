// 계약서 Word 생성 공통 도우미 (조문·항·호·표·상자)
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, ShadingType, PageBreak, Footer, PageNumber,
} = require("docx");

const FONT = "Malgun Gothic";
const r = (text, o = {}) => new TextRun({ text, font: FONT, size: 21, ...o });

const p = (text, o = {}) => new Paragraph({
  children: Array.isArray(text) ? text : [r(text, o.run || {})],
  spacing: { after: 80, line: 300 },
  alignment: o.align || AlignmentType.JUSTIFIED,
  indent: o.indent,
});
const hang = (text) => p(text, { indent: { left: 300, hanging: 300 } }); // 항 ①②
const ho = (text) => p(text, { indent: { left: 600, hanging: 300 } });   // 호 1. 2.
const note = (text) => p(text, { run: { size: 19 } });
const blank = () => p("");
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const title = (text) => new Paragraph({
  children: [r(text, { size: 36, bold: true })],
  alignment: AlignmentType.CENTER, spacing: { before: 0, after: 360 },
});
const section = (text) => new Paragraph({
  children: [r(text, { size: 26, bold: true })],
  spacing: { before: 360, after: 160 }, keepNext: true,
});
const art = (text) => new Paragraph({
  children: [r(text, { bold: true })],
  spacing: { before: 240, after: 100 }, keepNext: true,
});

const box = (lines, fill = "FFF4E5") => new Table({
  width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026],
  rows: [new TableRow({ children: [new TableCell({
    width: { size: 9026, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, color: "auto", fill },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    children: lines.map((l, i) => p(l, { align: AlignmentType.LEFT, run: i === 0 ? { bold: true } : {} })),
  })] })],
});

const table = (widths, rows, headerFill = "E8EEF7") => new Table({
  width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  columnWidths: widths,
  rows: rows.map((row, ri) => new TableRow({
    tableHeader: ri === 0,
    children: row.map((cell, ci) => new TableCell({
      width: { size: widths[ci], type: WidthType.DXA },
      shading: ri === 0 ? { type: ShadingType.CLEAR, color: "auto", fill: headerFill } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({
        children: [r(cell, { bold: ri === 0, size: 19 })],
        alignment: ri === 0 || (ci > 0 && cell.length <= 16) ? AlignmentType.CENTER : AlignmentType.LEFT,
      })],
    })),
  })),
});

// 문서 저장
function save(body, out) {
  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 21 } } } },
    sections: [{
      properties: { page: { margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
      footers: { default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [r("- ", { size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 }), r(" -", { size: 18 })],
      })] }) },
      children: body,
    }],
  });
  return Packer.toBuffer(doc)
    .then((buf) => { fs.writeFileSync(out, buf); console.log("생성 완료:", out); })
    .catch((e) => { console.error("생성 실패:", e); process.exit(1); });
}

module.exports = { r, p, hang, ho, note, blank, pageBreak, title, section, art, box, table, save, AlignmentType };
