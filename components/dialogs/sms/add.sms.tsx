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
import { useState, useEffect } from "react";
import { Loader2, Plus, MessageSquare, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { SMSDataSchema, TypeofSMSData } from "@/validators/sms";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddSMS = () => {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  type FormData = {
    message: string;
    scheduledFor?: string;
    isRecurring: boolean;
    dayOfWeek: number;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("/api/member?page=1&limit=1000");
        if (response.data.success) {
          const membersWithPhone = response.data.data.members.filter(
            (m: any) => m.phone
          );
          setMembers(membersWithPhone);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    if (open) {
      fetchMembers();
    }
  }, [open]);

  const toggleMember = (phone: string) => {
    setSelectedMembers((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]
    );
  };

  const selectAll = () => {
    setSelectedMembers(members.map((m) => m.phone));
  };

  const deselectAll = () => {
    setSelectedMembers([]);
  };

  const onSubmit = async (data: FormData) => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    const payload = {
      message: data.message,
      recipients: selectedMembers,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
      dayOfWeek: 0,
      isRecurring: false,
    };

    try {
      const { data: response } = await axios.post("/api/sms", payload);
      toast.success(response.message);
      setOpen(false);
      reset();
      setSelectedMembers([]);
      // window.location.reload();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ||
            "Something went wrong while sending SMS."
        );
      } else {
        toast.error("Something went wrong while sending SMS.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Send SMS
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Send SMS to Members</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              {...register("message")}
              placeholder="Type your message here..."
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="isRecurring">Is Recurring</Label>
              <Select
                {...register("isRecurring")}
                value={watch("isRecurring") ? "true" : "false"}
                onValueChange={(value) =>
                  setValue("isRecurring", value === "true")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select recurring type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dayOfWeek">Day of Week</Label>
              <Select
                {...register("dayOfWeek")}
                value={
                  watch("dayOfWeek") !== undefined
                    ? watch("dayOfWeek").toString()
                    : "-1"
                }
                onValueChange={(value) =>
                  setValue("dayOfWeek", parseInt(value) ? parseInt(value) : -1)
                }
                disabled={!watch("isRecurring")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day of week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">No day of week</SelectItem>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
              {errors.dayOfWeek && (
                <p className="text-sm text-red-500">
                  {errors.dayOfWeek.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
            <Input
              type="datetime-local"
              {...register("scheduledFor")}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.scheduledFor && (
              <p className="text-sm text-red-500">
                {errors.scheduledFor.message}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Recipients ({selectedMembers.length} selected)
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deselectAll}
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No members with phone numbers found
                </p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                  >
                    <Checkbox
                      checked={selectedMembers.includes(member.phone)}
                      onCheckedChange={() => toggleMember(member.phone)}
                    />
                    <label className="flex-1 cursor-pointer text-sm">
                      {member.firstName} {member.lastName} - {member.phone}
                    </label>
                  </div>
                ))
              )}
            </div>
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
                <MessageSquare className="h-4 w-4 mr-1" />
              )}
              {isSubmitting ? "Sending..." : "Send SMS"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSMS;
