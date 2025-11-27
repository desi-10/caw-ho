"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { toast } from "sonner";

interface ExportButtonsProps {
  data: Array<Record<string, unknown>>;
  fileName: string;
  title: string;
  columns: Array<{ header: string; dataKey: string }>;
}

export function ExportButtons({
  data,
  fileName,
  title,
  columns,
}: ExportButtonsProps) {
  const handleExportExcel = () => {
    try {
      if (data.length === 0) {
        toast.error("No data to export");
        return;
      }

      // Format data for Excel (remove IDs, format properly)
      const formattedData = data.map((row) => {
        const formatted: Record<string, unknown> = {};
        columns.forEach((col) => {
          const value = row[col.dataKey];
          if (
            value &&
            typeof value === "string" &&
            value.match(/^\d{4}-\d{2}-\d{2}/)
          ) {
            formatted[col.header] = new Date(value).toLocaleDateString();
          } else {
            formatted[col.header] = value || "";
          }
        });
        return formatted;
      });

      exportToExcel(formattedData, fileName);
      toast.success("Excel file exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel file");
    }
  };

  const handleExportPDF = () => {
    try {
      if (data.length === 0) {
        toast.error("No data to export");
        return;
      }

      exportToPDF(data, fileName, title, columns);
      toast.success("PDF file exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF file");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportExcel} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2">
          <FileText className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
