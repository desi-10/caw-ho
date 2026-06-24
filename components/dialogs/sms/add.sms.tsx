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
import { Loader2, Plus, MessageSquare, Users, Trash2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AddSMS = () => {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [customNumbersInput, setCustomNumbersInput] = useState("");
  const [customContacts, setCustomContacts] = useState<{name: string, phone: string, title?: string}[]>([]);

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
    if (!open) return;
    const fetchMembers = async () => {
      try {
        const response = await axios.get("/api/member?page=1&limit=50");
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

  const handleParseNumbers = () => {
    const parsed = customNumbersInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => {
        const match = s.match(/^(.*?)([\d\s\-\+]{8,})$/);
        if (match) {
          const name = match[1].replace(/[:\-,\s]+$/, "").trim();
          const phone = match[2].replace(/[\s\-]/g, "");
          return { name, phone, title: "" };
        }
        return { name: "", phone: s.replace(/[\s\-]/g, ""), title: "" };
      });
    setCustomContacts((prev) => [...prev, ...parsed]);
    setCustomNumbersInput("");
  };

  const removeCustomContact = (index: number) => {
    setCustomContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    const memberRecipients = selectedMembers.map((phone) => {
      const member = members.find((m) => m.phone === phone);
      
      let title = "";
      if (member?.role === "PASTOR") title = "Pastor";
      else if (member?.gender === "MALE") title = "Esteemed Brother";
      else if (member?.gender === "FEMALE") title = "Esteemed Sister";
      else title = "Sir/Madam"; // Default fallback

      return { phone, name: member?.firstName || "", title };
    });

    const allRecipients = [...memberRecipients, ...customContacts];

    if (allRecipients.length === 0) {
      toast.error("Please select or add at least one recipient");
      return;
    }

    const payload = {
      message: data.message,
      recipients: allRecipients,
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
      setCustomContacts([]);
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
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="custom">Custom Contacts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Select ({selectedMembers.length} selected)
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
                      Clear
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
              </TabsContent>

              <TabsContent value="custom" className="space-y-3 mt-4">
                <div className="grid gap-2">
                  <Label>Add External Numbers</Label>
                  <div className="flex gap-2">
                    <textarea
                      value={customNumbersInput}
                      onChange={(e) => setCustomNumbersInput(e.target.value)}
                      placeholder="Paste numbers here (e.g. John - 0241234567, 0551234567)"
                      className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <Button type="button" variant="secondary" onClick={handleParseNumbers} disabled={!customNumbersInput.trim()}>
                    Parse & Add
                  </Button>
                </div>

                {customContacts.length > 0 && (
                  <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                    <Label className="mb-2 block text-xs font-semibold text-muted-foreground">Added Contacts ({customContacts.length})</Label>
                    {customContacts.map((contact, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-accent/50 rounded-md gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                          <Select 
                            value={contact.title || "none"} 
                            onValueChange={(val) => {
                              const newContacts = [...customContacts];
                              newContacts[idx].title = val === "none" ? "" : val;
                              setCustomContacts(newContacts);
                            }}
                          >
                            <SelectTrigger className="w-[110px] h-8 text-xs">
                              <SelectValue placeholder="Title" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Title</SelectItem>
                              <SelectItem value="Mr">Mr.</SelectItem>
                              <SelectItem value="Mrs">Mrs.</SelectItem>
                              <SelectItem value="Miss">Miss</SelectItem>
                              <SelectItem value="Dr">Dr.</SelectItem>
                              <SelectItem value="Prof">Prof.</SelectItem>
                              <SelectItem value="Esteemed Brother">Esteemed Brother</SelectItem>
                              <SelectItem value="Esteemed Sister">Esteemed Sister</SelectItem>
                              <SelectItem value="Pastor">Pastor</SelectItem>
                              <SelectItem value="Sir">Sir</SelectItem>
                              <SelectItem value="Madam">Madam</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm">
                            {contact.name ? `${contact.name} - ` : ""}{contact.phone}
                          </span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeCustomContact(idx)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
