"use client";
import { DataTable } from "@/components/data-table";
import AddMember from "@/components/dialogs/members/add.member";
import { columns } from "@/columns/members";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportButtons } from "@/components/export-buttons";
import { Pagination } from "@/components/pagination";
import { useMembers } from "@/hooks/use-members";
import { useState } from "react";

const MembersPage = () => {
  const [page, setPage] = useState(1);
  const { data: members, isLoading } = useMembers(page, 10);

  return (
    <div>
      <div className="w-full mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Members
          </h1>
          <p className="h-2 w-full bg bg-amber-500 -mt-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButtons
            data={
              (members?.members || []).map((m) => ({
                firstName: m.firstName,
                lastName: m.lastName,
                email: m.email,
                phone: m.phone,
                address: m.address,
              })) as Record<string, unknown>[]
            }
            fileName="members"
            title="Members Report"
            columns={[
              { header: "First Name", dataKey: "firstName" },
              { header: "Last Name", dataKey: "lastName" },
              { header: "Email", dataKey: "email" },
              { header: "Phone", dataKey: "phone" },
              { header: "Address", dataKey: "address" },
            ]}
          />
          <AddMember />
        </div>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="text-xs">
            <div className="rounded-md">
              {/* Table Controls Skeleton */}
              <div className="flex justify-between items-center mb-5">
                <Skeleton className="h-10 w-full max-w-sm rounded-md" />
                <div className="flex space-x-3">
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </div>

              {/* Table Skeleton */}
              <div className="rounded-md border">
                {/* Table Header */}
                <div className="border-b bg-muted/50">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 p-4">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Rows */}
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
            <DataTable data={members?.members || []} columns={columns} />
            {members?.pagination && (
              <Pagination
                page={members.pagination.page}
                totalPages={members.pagination.totalPages}
                hasNextPage={members.pagination.hasNextPage}
                hasPrevPage={members.pagination.hasPrevPage}
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

export default MembersPage;
