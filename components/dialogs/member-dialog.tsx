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
import { Trash2 } from "lucide-react";

type Member = {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

type MemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view" | "delete";
  member?: Member;
  onSave: (member: Omit<Member, "id">) => void;
  onDelete?: () => void;
};

export function MemberDialog({
  open,
  onOpenChange,
  mode,
  member,
  onSave,
  onDelete,
}: MemberDialogProps) {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  React.useEffect(() => {
    if (member && (mode === "edit" || mode === "view")) {
      setFormData({
        username: member.username,
        email: member.email,
        phone: member.phone,
        address: member.address,
      });
    } else {
      setFormData({
        username: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [member, mode]);

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
            {mode === "create" && "Add New Member"}
            {mode === "edit" && "Edit Member"}
            {mode === "view" && "View Member Details"}
            {mode === "delete" && "Delete Member"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Add a new member to your church community."}
            {mode === "edit" && "Update member information."}
            {mode === "view" && "View member details."}
            {mode === "delete" &&
              "Are you sure you want to delete this member? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {isDeleteMode ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete <strong>{member?.username}</strong>{" "}
              from the system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={isViewMode}
                  required={!isViewMode}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isViewMode}
                  required={!isViewMode}
                />
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
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
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
