import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export data to Excel file
 */
export function exportToExcel(
  data: Array<Record<string, unknown>>,
  fileName: string,
  sheetName = "Sheet1"
) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw new Error("Failed to export to Excel");
  }
}

/**
 * Export data to PDF file
 */
export function exportToPDF(
  data: Array<Record<string, unknown>>,
  fileName: string,
  title: string,
  columns: Array<{ header: string; dataKey: string }>
) {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = data.map((row) =>
      columns.map((col) => String(row[col.dataKey] || ""))
    );

    const headers = columns.map((col) => col.header);

    // Add table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw new Error("Failed to export to PDF");
  }
}

/**
 * Format data for export (remove IDs, format dates, etc.)
 */
export function formatDataForExport<T extends Record<string, unknown>>(
  data: T[],
  mapping: Record<string, string>
): Array<Record<string, unknown>> {
  return data.map((row) => {
    const formatted: Record<string, unknown> = {};
    Object.keys(mapping).forEach((key) => {
      const value = row[key];
      // Format date if it's a date string
      if (
        value &&
        typeof value === "string" &&
        value.match(/^\d{4}-\d{2}-\d{2}/)
      ) {
        formatted[mapping[key]] = new Date(value).toLocaleDateString();
      } else {
        formatted[mapping[key]] = value || "";
      }
    });
    return formatted;
  });
}
