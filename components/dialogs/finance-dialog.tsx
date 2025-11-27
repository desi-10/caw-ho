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

type Finance = {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: string;
  currency: string;
  paymentType: string;
  status: string;
  date: string;
  memberId: string;
  approvedById: string;
  reference: string;
  reconciled: string;
  receiptUrl: string;
  fund: string;
  notes: string;
};

type FinanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view" | "delete";
  finance?: Finance;
  onSave: (finance: Omit<Finance, "id">) => void;
  onDelete?: () => void;
};

export function FinanceDialog({
  open,
  onOpenChange,
  mode,
  finance,
  onSave,
  onDelete,
}: FinanceDialogProps) {
  const [formData, setFormData] = React.useState({
    type: "Tithe",
    category: "",
    description: "",
    amount: "",
    currency: "GHS",
    paymentType: "Cash",
    status: "Completed",
    date: new Date().toISOString().split("T")[0],
    memberId: "",
    approvedById: "",
    reference: "",
    reconciled: "false",
    receiptUrl: "",
    fund: "",
    notes: "",
  });

  React.useEffect(() => {
    if (finance && (mode === "edit" || mode === "view")) {
      setFormData({
        type: finance.type,
        category: finance.category,
        description: finance.description,
        amount: finance.amount,
        currency: finance.currency,
        paymentType: finance.paymentType,
        status: finance.status,
        date: finance.date,
        memberId: finance.memberId,
        approvedById: finance.approvedById,
        reference: finance.reference,
        reconciled: finance.reconciled,
        receiptUrl: finance.receiptUrl,
        fund: finance.fund,
        notes: finance.notes,
      });
    } else {
      setFormData({
        type: "Tithe",
        category: "",
        description: "",
        amount: "",
        currency: "GHS",
        paymentType: "Cash",
        status: "Completed",
        date: new Date().toISOString().split("T")[0],
        memberId: "",
        approvedById: "",
        reference: "",
        reconciled: "false",
        receiptUrl: "",
        fund: "",
        notes: "",
      });
    }
  }, [finance, mode]);

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Add Transaction"}
            {mode === "edit" && "Edit Transaction"}
            {mode === "view" && "View Transaction Details"}
            {mode === "delete" && "Delete Transaction"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Record a new financial transaction."}
            {mode === "edit" && "Update transaction information."}
            {mode === "view" && "View transaction details."}
            {mode === "delete" &&
              "Are you sure you want to delete this transaction? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {isDeleteMode ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete the transaction{" "}
              <strong>{finance?.type}</strong> - {finance?.amount}{" "}
              {finance?.currency} from the system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tithe">Tithe</SelectItem>
                      <SelectItem value="Offering">Offering</SelectItem>
                      <SelectItem value="Donation">Donation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={isViewMode}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    disabled={isViewMode}
                    required={!isViewMode}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GHS">GHS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentType">Payment Type</Label>
                  <Select
                    value={formData.paymentType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentType: value })
                    }
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      <SelectItem value="Bank Transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="memberId">Member ID</Label>
                  <Input
                    id="memberId"
                    value={formData.memberId}
                    onChange={(e) =>
                      setFormData({ ...formData, memberId: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) =>
                      setFormData({ ...formData, reference: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  disabled={isViewMode}
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
