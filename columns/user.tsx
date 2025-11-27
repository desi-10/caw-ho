"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

type UserTable = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  image?: string | null;
};

export const columns: ColumnDef<UserTable>[] = [
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
    id: "image",
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original.image || "/placeholder.png"}
        alt="Image"
        width={40}
        height={40}
        className="w-10 h-10 object-cover rounded-lg border"
      />
    ),
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="truncate w-44">{row.original.name}</div>,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.email}</div>
    ),
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="truncate w-44 capitalize">
        {row.original.role || "User"}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-500 hover:bg-emerald-600 hover:text-white"
            onClick={() => meta?.onEdit?.(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-rose-500 hover:bg-rose-500 hover:text-white"
            onClick={() => meta?.onDelete?.(row.original)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
