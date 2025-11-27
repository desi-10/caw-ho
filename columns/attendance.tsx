"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { EditAttendanceDialog } from "@/components/dialogs/attendance/edit.attendance";
import { DeleteAttendanceDialog } from "@/components/dialogs/attendance/delete.attendance";
import { useState } from "react";

type AttendanceTable = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  status: string;
  date: string;
};

export const columns: ColumnDef<AttendanceTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "firstname",
    accessorKey: "firstname",
    header: "Firstname",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.firstname}</div>
    ),
  },

  {
    id: "lastname",
    accessorKey: "lastname",
    header: "Lastname",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.lastname}</div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.status}</div>
    ),
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="truncate w-44">{row.original.date}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;
      const [editOpen, setEditOpen] = useState(false);
      const [deleteOpen, setDeleteOpen] = useState(false);

      return (
        <>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-500 hover:bg-emerald-600 hover:text-white"
              onClick={() => setEditOpen(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-rose-500 hover:bg-rose-500 hover:text-white"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          {editOpen && (
            <EditAttendanceDialog
              attendance={data}
              open={editOpen}
              onOpenChange={setEditOpen}
            />
          )}
          {deleteOpen && (
            <DeleteAttendanceDialog
              attendance={data}
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
            />
          )}
        </>
      );
    },
    enableHiding: false,
  },
];
