// Transform backend data to frontend format

type BackendMember = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

type BackendAttendance = {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  status: string;
  date: Date | string;
};

type BackendFinance = {
  id: string;
  type: string;
  category?: string | null;
  description?: string | null;
  amount: number;
  currency: string;
  paymentType: string;
  status: string;
  date: Date | string;
  memberId?: string | null;
  approvedById?: string | null;
  reference?: string | null;
  reconciled: boolean;
  receiptUrl?: string | null;
  fund?: string | null;
  notes?: string | null;
};

export function transformMemberToFrontend(member: BackendMember) {
  return {
    id: member.id,
    username: `${member.firstName} ${member.lastName || ""}`.trim(),
    email: member.email || "",
    phone: member.phone || "",
    address: member.address || "",
  };
}

export function transformMemberToBackend(data: {
  username: string;
  email: string;
  phone: string;
  address: string;
}) {
  const nameParts = data.username.split(" ");
  return {
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: data.email,
    phone: data.phone,
    address: data.address,
  };
}

export function transformAttendanceToFrontend(attendance: BackendAttendance) {
  return {
    id: attendance.id,
    firstname: attendance.firstname || "",
    lastname: attendance.lastname || "",
    phone: "",
    status:
      attendance.status === "PRESENT"
        ? "Present"
        : attendance.status === "ABSENT"
        ? "Absent"
        : "Late",
    date: attendance.date
      ? new Date(attendance.date).toISOString().split("T")[0]
      : "",
  };
}

export function transformFinanceToFrontend(finance: BackendFinance) {
  return {
    id: finance.id,
    type: finance.type.charAt(0) + finance.type.slice(1).toLowerCase(),
    category: finance.category || "",
    description: finance.description || "",
    amount: finance.amount.toString(),
    currency: finance.currency,
    paymentType:
      finance.paymentType === "CASH"
        ? "Cash"
        : finance.paymentType === "MOBILE_MONEY"
        ? "Mobile Money"
        : "Bank Transfer",
    status:
      finance.status === "COMPLETED"
        ? "Completed"
        : finance.status === "PENDING"
        ? "Pending"
        : "Cancelled",
    date: finance.date
      ? new Date(finance.date).toISOString().split("T")[0]
      : "",
    memberId: finance.memberId || "",
    approvedById: finance.approvedById || "",
    reference: finance.reference || "",
    reconciled: finance.reconciled ? "true" : "false",
    receiptUrl: finance.receiptUrl || "",
    fund: finance.fund || "",
    notes: finance.notes || "",
  };
}
