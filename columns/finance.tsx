"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { EditFinanceDialog } from "@/components/dialogs/finance/edit.finance";
import { DeleteFinanceDialog } from "@/components/dialogs/finance/delete.finance";
import { useState } from "react";
import { formatPaymentType, formatStatus, formatType } from "@/utils/fomatter";
import { dateFormatter } from "@/utils/fomatter";

type FinanceTable = {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: string;
  currency: string;
  paymentType: string;
  status: string;
  date: string;
  reference: string;
  reconciled: string;
  receiptUrl: string;
  fund: string;
  notes: string;
  firstname: string;
  lastname: string;
  approvedBy: {
    name: string;
  };
  member: {
    firstName: string;
    lastName: string;
  } | null;
};

export const columns: ColumnDef<FinanceTable>[] = [
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
    id: "type",
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="truncate w-44 space-y-1 text-sm">
        <p>{formatType(row.original.type)}</p>
        <p className="text-xs text-gray-500 truncate">
          {row.original.description || "----"}
        </p>
      </div>
    ),
  },

  // {
  //   id: "category",
  //   accessorKey: "category",
  //   header: "Category",
  //   cell: ({ row }) => (
  //     <div className="truncate w-44">{row.original.category}</div>
  //   ),
  // },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {row.original.currency} {row.original.amount}
      </div>
    ),
  },
  {
    id: "paymentType",
    accessorKey: "paymentType",
    header: "Payment Type",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {formatPaymentType(row.original.paymentType)}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="truncate w-44">{formatStatus(row.original.status)}</div>
    ),
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="truncate w-44">{dateFormatter(row.original.date)}</div>
    ),
  },
  {
    id: "memberId",
    accessorKey: "memberId",
    header: "Member",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {row.original.member?.firstName || "----"}{" "}
        {row.original.member?.lastName || "----"}
      </div>
    ),
  },
  {
    id: "approvedBy",
    accessorKey: "approvedBy",
    header: "Approved By",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {row.original.approvedBy?.name || "----"}{" "}
      </div>
    ),
  },
  {
    id: "member",
    accessorKey: "member",
    header: "Transaction Name",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {row.original.firstname || "----"} {row.original.lastname || "----"}
      </div>
    ),
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.reference || "----"}</div>
    ),
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
            <EditFinanceDialog
              finance={data}
              open={editOpen}
              onOpenChange={setEditOpen}
            />
          )}
          {deleteOpen && (
            <DeleteFinanceDialog
              finance={data}
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
            />
          )}
        </>
      );
    },
  },
];
