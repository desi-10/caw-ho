import { SectionCards } from "@/components/section-cards";
import { AttendanceChart } from "@/components/chart-area-interactive";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's what's happening with your church community.
        </p>
      </div> */}
      <SectionCards />
      <div className="">
        <div className="">
          <AttendanceChart />
        </div>
      </div>
    </div>
  );
}
