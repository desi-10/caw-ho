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
import { Loader2, Wallet } from "lucide-react";
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
import { FinanceDataSchema, TypeofFinanceData } from "@/validators/finance";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface EditFinanceProps {
  finance: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditFinanceDialog = ({
  finance,
  open,
  onOpenChange,
  onSuccess,
}: EditFinanceProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TypeofFinanceData>({
    resolver: zodResolver(FinanceDataSchema),
  });

  useEffect(() => {
    if (finance) {
      setValue("type", finance.type);
      setValue("amount", finance.amount);
      setValue("currency", finance.currency || "GHS");
      setValue("paymentType", finance.paymentType || "CASH");
      setValue("status", finance.status || "COMPLETED");
      setValue("memberId", finance.memberId || "none");
      setValue("firstname", finance.firstname || "");
      setValue("lastname", finance.lastname || "");
      setValue("category", finance.category || "");
      setValue("description", finance.description || "");
      setValue("reference", finance.reference || "");
      setValue("notes", finance.notes || "");
      if (finance.date) {
        const date = new Date(finance.date);
        setValue("date", date);
      }
    }
  }, [finance, setValue]);

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

  const onSubmit = async (data: TypeofFinanceData) => {
    try {
      // Convert "none" back to empty string for memberId before sending
      const submitData = { ...data };
      if (submitData.memberId === "none") {
        submitData.memberId = "";
      }
      const { data: response } = await axios.put(
        `/api/finance/${finance.id}`,
        submitData
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
            "Something went wrong while updating finance."
        );
      } else {
        toast.error("Something went wrong while updating finance.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span>Edit Finance</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 w-full">
              <Label htmlFor="memberId">Member (Optional)</Label>
              <Controller
                name="memberId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "none"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {members?.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TITHE">Tithe</SelectItem>
                      <SelectItem value="OFFERING">Offering</SelectItem>
                      <SelectItem value="DONATION">Donation</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                      <SelectItem value="PLEDGE">Pledge</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GHS">GHS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paymentType">Payment Method</Label>
              <Controller
                name="paymentType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                      <SelectItem value="BANK">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstname">First Name (Optional)</Label>
              <Input
                type="text"
                placeholder="First Name"
                {...register("firstname")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastname">Last Name (Optional)</Label>
              <Input
                type="text"
                placeholder="Last Name"
                {...register("lastname")}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              type="text"
              placeholder="Category"
              {...register("category")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              type="text"
              placeholder="Description"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input type="date" {...register("date", { valueAsDate: true })} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                type="text"
                placeholder="Reference"
                {...register("reference")}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Notes"
              {...register("notes")}
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
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
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              {isSubmitting ? "Updating..." : "Update Finance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditFinanceDialog };
