"use client";
import { columns } from "@/columns/attendance";
import { DataTable } from "@/components/data-table";
import AddAttendance from "@/components/dialogs/attendance/add.attendance";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-buttons";
import { useAttendances } from "@/hooks/use-attendances";
import { useState } from "react";

const AttendancePage = () => {
  const [page, setPage] = useState(1);
  const { data: attendances, isLoading } = useAttendances(page, 10);

  return (
    <div>
      <div className="w-full mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Attendance
          </h1>
          <p className="h-2 w-full bg-amber-400 -mt-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButtons
            data={
              (attendances?.attendances || []).map((a) => ({
                date: a.date,
                status: a.status,
                member: a.member
                  ? `${a.member.firstName} ${a.member.lastName}`
                  : "",
                firstname: a.firstname || "",
                lastname: a.lastname || "",
              })) as Record<string, unknown>[]
            }
            fileName="attendances"
            title="Attendances Report"
            columns={[
              { header: "Date", dataKey: "date" },
              { header: "Status", dataKey: "status" },
              { header: "Member", dataKey: "member" },
              { header: "Firstname", dataKey: "firstname" },
              { header: "Lastname", dataKey: "lastname" },
            ]}
          />
          <AddAttendance />
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
            <DataTable
              data={(attendances?.attendances as any) || []}
              columns={columns}
            />
            {attendances?.pagination && (
              <Pagination
                page={attendances.pagination.page}
                totalPages={attendances.pagination.totalPages}
                hasNextPage={attendances.pagination.hasNextPage}
                hasPrevPage={attendances.pagination.hasPrevPage}
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

export default AttendancePage;
