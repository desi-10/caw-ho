"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "@/columns/user";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportButtons } from "@/components/export-buttons";
import AddUser from "@/components/dialogs/users/add-user";
import { Pagination } from "@/components/pagination";
import { useUsers } from "@/hooks/use-users";
import { useState } from "react";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useUsers(page, 10);

  return (
    <div>
      <div className="w-full mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Users</h1>
          <p className="h-2 w-full bg bg-amber-500 -mt-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButtons
            data={(users?.users || []).map((user) => ({
              name: user.name,
              email: user.email,
              role: user.role,
            }))}
            fileName="users"
            title="Users Report"
            columns={[
              { header: "Name", dataKey: "name" },
              { header: "Email", dataKey: "email" },
              { header: "Role", dataKey: "role" },
            ]}
          />
          <AddUser />
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
                    {[1, 2, 3, 4].map((i) => (
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
                        {[1, 2, 3, 4].map((col) => (
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
            <DataTable data={users?.users || []} columns={columns} />
            {users?.pagination && (
              <Pagination
                page={users.pagination.page}
                totalPages={users.pagination.totalPages}
                hasNextPage={users.pagination.hasNextPage}
                hasPrevPage={users.pagination.hasPrevPage}
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

export default UsersPage;
