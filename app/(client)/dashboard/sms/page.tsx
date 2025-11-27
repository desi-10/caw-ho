"use client";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import AddSMS from "@/components/dialogs/sms/add.sms";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { useSMS, useDeleteSMS } from "@/hooks/use-sms";

type SMS = {
  id: string;
  message: string;
  recipients: string[];
  scheduledFor?: string;
  status: string;
  sentAt?: string | null;
  sentCount: number;
};

const SMSPage = () => {
  const [page, setPage] = useState(1);
  const { data: sms, isLoading } = useSMS(page, 10);
  const deleteSMS = useDeleteSMS();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheduled SMS?")) return;
    deleteSMS.mutate(id);
  };

  const columns: ColumnDef<SMS>[] = [
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const message = row.getValue("message") as string;
        return (
          <div className="max-w-[300px]">
            <p className="truncate text-sm">{message}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "recipients",
      header: "Recipients",
      cell: ({ row }) => {
        const recipients = row.getValue("recipients") as string[];
        return (
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {recipients?.length || 0} recipients
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "scheduledFor",
      header: "Scheduled For",
      cell: ({ row }) => {
        const scheduledFor = row.getValue("scheduledFor") as string;
        return scheduledFor ? (
          <span className="text-sm">
            {new Date(scheduledFor).toLocaleString()}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Immediate</span>
        );
      },
    },
    {
      accessorKey: "sentCount",
      header: "Sent Count",
      cell: ({ row }) => {
        const sentCount = row.getValue("sentCount") as number;
        return <span className="text-sm font-medium">{sentCount}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "SENT"
                ? "default"
                : status === "FAILED"
                ? "destructive"
                : status === "CANCELLED"
                ? "outline"
                : "secondary"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "sentAt",
      header: "Sent At",
      cell: ({ row }) => {
        const sentAt = row.getValue("sentAt") as string | null;
        return sentAt ? (
          <span className="text-sm">{new Date(sentAt).toLocaleString()}</span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const smsItem = row.original;
        return (
          <div className="flex items-center gap-2">
            {smsItem.status === "PENDING" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(smsItem.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="w-full mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">SMS</h1>
          <p className="h-2 w-full bg-amber-400 -mt-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <AddSMS />
        </div>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="text-xs">
            <div className="rounded-md">
              <div className="flex justify-between items-center mb-5">
                <Skeleton className="h-10 w-full max-w-sm rounded-md" />
                <div className="flex space-x-3">
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </div>

              <div className="rounded-md border">
                <div className="border-b bg-muted/50">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 p-4">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                    <div
                      key={row}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((col) => (
                          <div key={col} className="flex-1 p-4">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <DataTable data={sms?.sms || []} columns={columns} />
            {sms?.pagination && (
              <Pagination
                page={sms.pagination.page}
                totalPages={sms.pagination.totalPages}
                hasNextPage={sms.pagination.hasNextPage}
                hasPrevPage={sms.pagination.hasPrevPage}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SMSPage;
