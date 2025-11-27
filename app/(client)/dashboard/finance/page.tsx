"use client";
import { columns } from "@/columns/finance";
import { DataTable } from "@/components/data-table";
import AddFinance from "@/components/dialogs/finance/add.finance";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-buttons";
import { useFinances } from "@/hooks/use-finances";
import { useState } from "react";
import {
  dateFormatter,
  formatCurrency,
  formatPaymentType,
  formatStatus,
  formatType,
} from "@/utils/fomatter";

const FinancePage = () => {
  const [page, setPage] = useState(1);
  const { data: finances, isLoading } = useFinances(page, 10);

  return (
    <div>
      <div className="w-full mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Finance
          </h1>
          <p className="h-2 w-full bg-amber-400 -mt-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButtons
            data={
              (finances?.finances || []).map((f) => ({
                date: dateFormatter(f.date),
                amount: f.currency + " " + f.amount,
                type: formatType(f.type),
                member: f.member
                  ? `${f.member.firstName} ${f.member.lastName}`
                  : "",
                reference: f.reference || "",
                status: formatStatus(f.status),
                paymentType: formatPaymentType(f.paymentType || ""),
                approvedBy: f.approvedBy?.name || "",
              })) as Record<string, unknown>[]
            }
            fileName="finances"
            title="Finances Report"
            columns={[
              { header: "Date", dataKey: "date" },
              { header: "Amount", dataKey: "amount" },
              { header: "Type", dataKey: "type" },
              { header: "Member", dataKey: "member" },
              { header: "Reference", dataKey: "reference" },
              { header: "Status", dataKey: "status" },
              { header: "Payment Type", dataKey: "paymentType" },
              { header: "Approved By", dataKey: "approvedBy" },
            ]}
          />
          <AddFinance />
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
            <DataTable
              data={(finances?.finances as any) || []}
              columns={columns}
            />
            {finances?.pagination && (
              <Pagination
                page={finances.pagination.page}
                totalPages={finances.pagination.totalPages}
                hasNextPage={finances.pagination.hasNextPage}
                hasPrevPage={finances.pagination.hasPrevPage}
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

export default FinancePage;
