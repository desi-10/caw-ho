"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import {
  AttendanceDataSchema,
  TypeofAttendanceData,
} from "@/validators/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface EditAttendanceProps {
  attendance: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditAttendanceDialog = ({
  attendance,
  open,
  onOpenChange,
  onSuccess,
}: EditAttendanceProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TypeofAttendanceData>({
    resolver: zodResolver(AttendanceDataSchema),
  });

  useEffect(() => {
    if (attendance) {
      setValue("firstname", attendance.firstname || "");
      setValue("lastname", attendance.lastname || "");
      setValue("phone", attendance.phone || "");
      setValue("status", attendance.status || "PRESENT");
      setValue("memberId", attendance.memberId || "none");
      if (attendance.date) {
        const date = new Date(attendance.date);
        setValue("date", date.toISOString().split("T")[0]);
      }
    }
  }, [attendance, setValue]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await axios.get("/api/member?page=1&limit=1000");
        setMembers(data.data.members);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
  }, []);

  const onSubmit = async (data: TypeofAttendanceData) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
          // Convert "none" back to empty string for memberId
          if (key === "memberId" && value === "none") {
            formData.append(key, "");
          } else {
            formData.append(key, value);
          }
        }
      }

      const { data: response } = await axios.put(
        `/api/attendance/${attendance.id}`,
        formData
      );
      if (response.success) {
        toast.success(response.message);
        onSuccess?.();
        onOpenChange(false);
        reset();
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ||
            "Something went wrong while updating attendance."
        );
      } else {
        toast.error("Something went wrong while updating attendance.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-4">
            <span className="font-bold">Edit Attendance</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                type="text"
                placeholder="First Name"
                {...register("firstname")}
              />
              {errors.firstname && (
                <p className="text-sm text-red-500">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                type="text"
                placeholder="Last Name"
                {...register("lastname")}
              />
              {errors.lastname && (
                <p className="text-sm text-red-500">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" placeholder="Phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENT">Present</SelectItem>
                    <SelectItem value="ABSENT">Absent</SelectItem>
                    <SelectItem value="LATE">Late</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="memberId">Member (Optional)</Label>
            <Controller
              name="memberId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-color hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              {isSubmitting ? "Updating..." : "Update Attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditAttendanceDialog };
