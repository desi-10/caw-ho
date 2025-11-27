"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

type Attendance = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  status: string;
  date: string;
};

type AttendanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view" | "delete";
  attendance?: Attendance;
  onSave: (attendance: Omit<Attendance, "id">) => void;
  onDelete?: () => void;
};

export function AttendanceDialog({
  open,
  onOpenChange,
  mode,
  attendance,
  onSave,
  onDelete,
}: AttendanceDialogProps) {
  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    phone: "",
    status: "Present",
    date: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    if (attendance && (mode === "edit" || mode === "view")) {
      setFormData({
        firstname: attendance.firstname,
        lastname: attendance.lastname,
        phone: attendance.phone,
        status: attendance.status,
        date: attendance.date,
      });
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        phone: "",
        status: "Present",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [attendance, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create" || mode === "edit") {
      onSave(formData);
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    onOpenChange(false);
  };

  const isViewMode = mode === "view";
  const isDeleteMode = mode === "delete";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Add Attendance"}
            {mode === "edit" && "Edit Attendance"}
            {mode === "view" && "View Attendance Details"}
            {mode === "delete" && "Delete Attendance"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Record a new attendance entry."}
            {mode === "edit" && "Update attendance information."}
            {mode === "view" && "View attendance details."}
            {mode === "delete" &&
              "Are you sure you want to delete this attendance record? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {isDeleteMode ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete the attendance record for{" "}
              <strong>
                {attendance?.firstname} {attendance?.lastname}
              </strong>{" "}
              from the system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    value={formData.firstname}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                    disabled={isViewMode}
                    required={!isViewMode}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    disabled={isViewMode}
                    required={!isViewMode}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={isViewMode}
                  required={!isViewMode}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  disabled={isViewMode}
                  required={!isViewMode}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {isViewMode ? "Close" : "Cancel"}
                </Button>
              </DialogClose>
              {!isViewMode && (
                <Button type="submit">
                  {mode === "create" ? "Create" : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        )}

        {isDeleteMode && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
