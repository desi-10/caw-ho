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
import { Loader2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { MemberDataSchema, TypeofMemberData } from "@/validators/members";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Image from "next/image";

interface EditMemberProps {
  member: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditMemberDialog = ({
  member,
  open,
  onOpenChange,
  onSuccess,
}: EditMemberProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TypeofMemberData>({
    resolver: zodResolver(MemberDataSchema),
  });

  const imageFile = watch("image");

  useEffect(() => {
    if (member) {
      setValue("firstName", member.firstName || "");
      setValue("lastName", member.lastName || "");
      setValue("email", member.email || "");
      setValue("phone", member.phone || "");
      setValue("address", member.address || "");
      setValue("userId", member.userId || "none");
      setPreview(member.image || null);
    }
  }, [member, setValue]);

  useEffect(() => {
    if (imageFile && typeof imageFile === "object" && "name" in imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user?page=1&limit=1000");
        if (response.data.success && response.data.data) {
          setUsers(response.data.data.users || []);
        } else {
          console.error("Unexpected response structure:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch users");
        } else {
          toast.error("Something went wrong");
        }
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: TypeofMemberData) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
          // Convert "none" back to empty string for userId
          if (key === "userId" && value === "none") {
            formData.append(key, "");
          } else {
            formData.append(key, value);
          }
        }
      }

      const { data: response } = await axios.put(
        `/api/member/${member.id}`,
        formData
      );
      if (response.success) {
        toast.success(response.message);
        onSuccess?.();
        onOpenChange(false);
        reset();
        setPreview(null);
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ||
            "Something went wrong while updating member."
        );
      } else {
        toast.error("Something went wrong while updating member.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-4">
            <span className="font-bold">Edit Member</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="grid gap-2">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 shadow flex items-center justify-center">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>

              <label
                htmlFor="edit-image"
                className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition"
              >
                Upload Image
              </label>
              <Input
                type="file"
                id="edit-image"
                accept="image/*"
                className="hidden"
                {...register("image")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input type="tel" placeholder="Phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input type="text" placeholder="Address" {...register("address")} />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="col-span-2 w-full">
            <Label htmlFor="userId">Users (Optional)</Label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users && users.length > 0 ? (
                      <>
                        <SelectItem value="none">None</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user?.name || user?.email || "Unknown User"}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No users available
                      </div>
                    )}
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
              className="bg-primary hover:bg-primary/80 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              {isSubmitting ? "Updating..." : "Update Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditMemberDialog };
