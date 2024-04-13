import * as xlsx from "xlsx";

async function parseExcelData() {
  const workbook = xlsx.readFile("E:/DEV/Schenker/ips/uploads/users.xlsx");
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);
  console.log("siema", data);
  return data;
}

parseExcelData();
