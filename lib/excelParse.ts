import * as xlsx from "xlsx";

export async function parseExcelData(file: any) {
  const workbook = xlsx.readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);
  return data;
}

