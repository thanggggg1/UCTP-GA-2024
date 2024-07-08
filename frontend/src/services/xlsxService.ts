import { utils, write, WorkSheet } from "xlsx-js-style";
import { saveAs } from "file-saver";
import { borderStyle, centerStyle } from "../config/excel.config";

export class XlsxService {
  static fortmatWSFile({
    ws,
    cellsToFormat,
    colWidths,
  }: {
    ws: WorkSheet;
    cellsToFormat: any[];
    colWidths: number[];
  }): void {
    // Set column widths
    if (colWidths.length > 0) {
      ws["!cols"] = colWidths.map((width) => {
        return { wch: width };
      });
    }
    // Apply the style to all cells in the worksheet
    for (const cell in ws) {
      // Skip properties that are not cells (like '!ref' or '!merges')
      if (cell[0] === "!") continue;
      const existingStyle = ws[cell].s || {};
      ws[cell].s = {
        ...existingStyle,
        ...centerStyle,
      };
    }
    // Apply formatting to custom cells
    cellsToFormat.forEach((cellAddress) => {
      applyCustomFgColor(ws, cellAddress);
    });
  }
  static applyStyleToRange(
    ws: any,
    startCell: string,
    endCell: string,
    style: any
  ) {
    const start = utils.decode_cell(startCell);
    const end = utils.decode_cell(endCell);

    for (let R = start.r; R <= end.r; ++R) {
      for (let C = start.c; C <= end.c; ++C) {
        const cellRef = utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) ws[cellRef] = { t: "s", v: "" }; // create a new cell if it doesn't exist
        ws[cellRef].s = style;
      }
    }
  }

  static generateFile(
    aoa: any[][],
    fileName: string,
    sheetName: string,
    cellsToFormat: any[],
    colWidths?: number[]
  ): void {
    const worksheet = utils.aoa_to_sheet([[]]);
    utils.sheet_add_aoa(worksheet, aoa);

    this.fortmatWSFile({
      ws: worksheet,
      cellsToFormat,
      colWidths: colWidths || [
        3.4, 10.6, 12, 10.6, 10.8, 32.8, 12.6, 15, 5.6, 9.8, 11.2, 14.4, 7,
        13.8, 8.8,
      ],
    });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, worksheet, sheetName);
    const excelBuffer = write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    this.saveAsExcelFile(excelBuffer, fileName);
  }

  static saveAsExcelFile(buffer: ArrayBuffer, fileName: string): void {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const data = new Blob([buffer], { type: EXCEL_TYPE });

    saveAs(
      data,
      fileName + "_export_" + new Date().toDateString() + EXCEL_EXTENSION
    );
  }

  // static getCellValue = (column, item) => {
  //   let value = "";
  //   if (column.customCell) {
  //     value = column.customCell(item, true);
  //   } else {
  //     switch (column.dataType) {
  //       case "date":
  //         if (item[column.field]) {
  //           value = FormatDisplay.date(item[column.field]);
  //         }
  //         break;
  //       case "date-time":
  //         if (item[column.field]) {
  //           value = FormatDisplay.dateTime(item[column.field]);
  //         }
  //         break;
  //       default:
  //         value = item[column.field] || "";
  //     }
  //   }
  //   return value;
  // };
  // static readExcelFile(file: any, opts?: ReadOpts): Promise<any> {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       if (event && event.target && event.target.result) {
  //         const wb = read(event.target.result);

  //         const sheet2JSONOpts: any = {
  //           header: 1,
  //         };
  //         if (opts?.startRow) {
  //           const range = utils.decode_range(
  //             wb.Sheets[wb.SheetNames[0]]["!ref"]
  //           );
  //           range.s.r = opts.startRow;
  //           sheet2JSONOpts.range = utils.encode_range(range);
  //         }

  //         const data = utils.sheet_to_json(
  //           wb.Sheets[wb.SheetNames[0]],
  //           sheet2JSONOpts
  //         );
  //         resolve(data);
  //       } else {
  //         resolve([]);
  //       }
  //     };
  //     reader.onerror = () => {
  //       resolve([]);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   });
  // }

  // static readExcelUrl(url: string, opts?: ReadOpts): Promise<any> {
  //   return axios
  //     .get(url, { responseType: "arraybuffer" })
  //     .then((response) => {
  //       const wb = read(new Uint8Array(response.data), { type: "array" });

  //       const sheet2JSONOpts: any = {
  //         header: 1,
  //       };
  //       if (opts?.startRow) {
  //         const range = utils.decode_range(wb.Sheets[wb.SheetNames[0]]["!ref"]);
  //         range.s.r = opts.startRow;
  //         sheet2JSONOpts.range = utils.encode_range(range);
  //       }

  //       return utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], sheet2JSONOpts);
  //     })
  //     .catch((error) => {
  //       console.error("Error reading file:", error);
  //     });
  // }
}
function applyCustomFgColor(ws: any, cellAddress: any) {
  if (!ws[cellAddress]) ws[cellAddress] = {};
  ws[cellAddress].s = {
    fill: {
      fgColor: { rgb: "FFA500" }, // Orange, change as needed
    },
    border: borderStyle,
  };
}
/* start_col and end_col are SheetJS 0-indexed column indices */
// function grouperColumns(ws: any, start_col: number, end_col: number) {
//   /* create !cols array if it does not exist */
//   if (!ws["!cols"]) ws["!cols"] = [];
//   /* loop over every column index */
//   for (let i = start_col; i <= end_col; ++i) {
//     /* create column metadata object if it does not exist */
//     if (!ws["!cols"][i]) ws["!cols"][i] = { wch: 8 };
//     /* increment level */
//     ws["!cols"][i].level = 1 + (ws["!cols"][i].level || 0);
//   }
// }
/* start_row and end_row are SheetJS 0-indexed row indices */
// function grouperRows(ws: any, start_row: number, end_row: number) {
//   /* create !rows array if it does not exist */
//   if (!ws["!rows"]) ws["!rows"] = [];
//   /* loop over every row index */
//   for (let i = start_row; i <= end_row; ++i) {
//     /* create row metadata object if it does not exist */
//     if (!ws["!rows"][i]) ws["!rows"][i] = { hpx: 20 };
//     /* increment level */
//     ws["!rows"][i].level = 1 + (ws["!rows"][i].level || 0);
//   }
// }
