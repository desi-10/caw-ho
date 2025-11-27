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
import { Loader2, Plus, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { TypeUserData, UserDataSchema } from "@/features/users/users.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxiosError } from "axios";

const AddUser = () => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TypeUserData>({
    resolver: zodResolver(UserDataSchema),
  });

  //   const imageFile = watch("image");

  const onSubmit = async (data: TypeUserData) => {
    await authClient.admin.createUser(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      },
      {
        onSuccess: () => {
          toast.success("User added successfully");
          setOpen(false);
          reset();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Failed to add user");
          } else {
            toast.error("Something went wrong");
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-4">
            <span className="font-bold">Add User</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          {/* <div className="grid gap-2"> */}
          {/* <div className="flex flex-col items-center gap-3">
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
                htmlFor="image"
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 transition"
              >
                Upload Image
              </label>
              <Input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                {...register("image")}
              />
            </div>
          </div> */}

          {/* Other Inputs */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" placeholder="Name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) =>
                setValue("role", value as "admin" | "user")
              }
              defaultValue={watch("role") as "admin" | "user"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
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
              {isSubmitting ? "Adding User..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
