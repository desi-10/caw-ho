"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Plus, CalendarPlus } from "lucide-react";
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

const AddAttendance = () => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TypeofAttendanceData>({
    resolver: zodResolver(AttendanceDataSchema),
    defaultValues: {
      status: "PRESENT",
    },
  });

  const onSubmit = async (data: TypeofAttendanceData) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }

      const { data: response } = await axios.post("/api/attendance", formData);
      if (response.success) toast.success(response.message);

      setOpen(false);
      reset();
      window.location.reload();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ||
            "Something went wrong while adding attendance."
        );
      } else {
        toast.error("Something went wrong while adding attendance.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add Attendance
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            <span>Add Attendance</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              type="text"
              placeholder="First Name"
              {...register("firstname")}
            />
            {errors.firstname && (
              <p className="text-sm text-red-500">{errors.firstname.message}</p>
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
              <p className="text-sm text-red-500">{errors.lastname.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" placeholder="Phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              {isSubmitting ? "Adding..." : "Add Attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendance;
