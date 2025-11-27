"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { EditMemberDialog } from "@/components/dialogs/members/edit.member";
import { DeleteMemberDialog } from "@/components/dialogs/members/delete.member";
import { useState } from "react";

type MemberTable = {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string | null;
};

export const columns: ColumnDef<MemberTable>[] = [
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
    id: "firstName",
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.firstName}</div>
    ),
  },

  {
    id: "lastName",
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.lastName}</div>
    ),
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.phone}</div>
    ),
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.address}</div>
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

          <EditMemberDialog
            member={data}
            open={editOpen}
            onOpenChange={setEditOpen}
          />

          <DeleteMemberDialog
            member={data}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      );
    },
    enableHiding: false,
  },
];
