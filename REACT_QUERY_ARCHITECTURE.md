# React Query Architecture Documentation

This project now uses **React Query** for efficient data fetching, caching, and state management with a clean separation of concerns.

## 🏗️ Architecture Overview

```
├── services/              # API service functions (axios calls)
│   └── dashboard.service.ts
├── hooks/                 # Custom React Query hooks
│   └── use-dashboard-stats.ts
├── components/
│   └── providers/        # React Query provider
│       └── query-provider.tsx
└── lib/
    └── query-client.ts   # Query client configuration
```

## 📦 Installation

React Query is already installed:

```bash
npm install @tanstack/react-query
```

## 🔧 Configuration

### 1. Query Provider Setup (`components/providers/query-provider.tsx`)

The QueryProvider wraps the entire application and provides React Query functionality:

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

### 2. App Layout Integration (`app/layout.tsx`)

```typescript
import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

## 📁 Services Layer

Services contain pure functions that make API calls using axios. They should be framework-agnostic and reusable.

### Example: `services/dashboard.service.ts`

```typescript
import axios from "axios";

export interface DashboardStats {
  totalRevenue: string;
  revenueChange: string;
  totalMembers: number;
  membersChange: string;
  newTimers: number;
  newTimersChange: string;
  growthRate: string;
}

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}

export const dashboardService = {
  /**
   * Fetch dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await axios.get<DashboardStatsResponse>(
      "/api/dashboard/stats"
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch dashboard stats");
    }

    return data.data;
  },
};
```

**Key Points**:
- ✅ Use axios for HTTP requests
- ✅ Define TypeScript interfaces for request/response
- ✅ Handle errors appropriately
- ✅ Return clean data (not the entire response object)
- ✅ Document functions with JSDoc comments

## 🪝 Hooks Layer

Hooks wrap service functions with React Query functionality, providing caching, loading states, and error handling.

### Example: `hooks/use-dashboard-stats.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { dashboardService, DashboardStats } from "@/services/dashboard.service";

export const DASHBOARD_STATS_KEY = ["dashboard", "stats"];

export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: DASHBOARD_STATS_KEY,
    queryFn: dashboardService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
}
```

**Key Points**:
- ✅ Define query keys as constants for reusability
- ✅ Configure staleTime based on data freshness needs
- ✅ Use refetchInterval for real-time data
- ✅ Export typed hooks for TypeScript safety

## 🎯 Component Usage

### Before (without React Query):

```typescript
export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        if (data.success) setStats(data.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  // ... render stats
}
```

### After (with React Query):

```typescript
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function SectionCards() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !stats) return <div>Error!</div>;
  
  // ... render stats
}
```

**Benefits**:
- ✅ Less boilerplate code
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Loading and error states handled
- ✅ No manual state management

## 🔑 Query Keys

Query keys should be defined as constants for consistency:

```typescript
// Define keys
export const DASHBOARD_STATS_KEY = ["dashboard", "stats"];
export const MEMBER_LIST_KEY = ["members", "list"];
export const MEMBER_DETAIL_KEY = (id: string) => ["members", "detail", id];

// Use in hooks
useQuery({ queryKey: DASHBOARD_STATS_KEY, ... });
useQuery({ queryKey: MEMBER_LIST_KEY, ... });
useQuery({ queryKey: MEMBER_DETAIL_KEY(memberId), ... });
```

## 📊 Advanced Patterns

### 1. Dependent Queries

```typescript
export function useMemberDetails(memberId: string) {
  return useQuery({
    queryKey: ["members", "detail", memberId],
    queryFn: () => memberService.getById(memberId),
    enabled: !!memberId, // Only fetch if memberId exists
  });
}
```

### 2. Mutations (Create, Update, Delete)

```typescript
// Service
export const memberService = {
  create: async (data: CreateMemberData) => {
    const response = await axios.post("/api/member", data);
    return response.data;
  },
};

// Hook
export function useCreateMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberService.create,
    onSuccess: () => {
      // Invalidate and refetch member list
      queryClient.invalidateQueries({ queryKey: ["members", "list"] });
    },
  });
}

// Component
function AddMemberButton() {
  const createMember = useCreateMember();
  
  const handleSubmit = (data: CreateMemberData) => {
    createMember.mutate(data, {
      onSuccess: () => toast.success("Member added!"),
      onError: (error) => toast.error(error.message),
    });
  };
  
  return <button onClick={handleSubmit}>Add Member</button>;
}
```

### 3. Pagination

```typescript
export function useMembersPaginated(page: number) {
  return useQuery({
    queryKey: ["members", "list", page],
    queryFn: () => memberService.getList(page),
    keepPreviousData: true, // Keep old data while fetching new page
  });
}
```

### 4. Infinite Queries (Infinite Scroll)

```typescript
export function useMembersInfinite() {
  return useInfiniteQuery({
    queryKey: ["members", "infinite"],
    queryFn: ({ pageParam = 1 }) => memberService.getList(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
```

## 🐛 Bug Fix: Revenue Change Calculation

### Problem

The revenue change was showing absurd values like "+5000.0%".

### Root Cause

Incorrect formula in `/app/api/dashboard/stats/route.ts`:

```typescript
// ❌ WRONG
revenueChange = (revenueThisMonth / (totalRevenue - revenueThisMonth)) * 100;
// If revenueThisMonth = 5000 and totalRevenue = 5100
// = 5000 / 100 * 100 = 5000%
```

### Solution

Compare this month to last month, not to the difference:

```typescript
// ✅ CORRECT
const revenueLastMonth = financeRecords
  .filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate >= lastMonthStart &&
      recordDate < startOfMonth &&
      record.currency === "GHS"
    );
  })
  .reduce((sum, record) => sum + Number(record.amount), 0);

const changePercent = 
  ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;
revenueChange = 
  changePercent >= 0
    ? `+${changePercent.toFixed(1)}%`
    : `${changePercent.toFixed(1)}%`;
```

## 📝 Best Practices

### Services

1. **Keep services pure** - No React dependencies
2. **Handle errors** - Throw meaningful error messages
3. **Type everything** - Use TypeScript interfaces
4. **Document functions** - Add JSDoc comments
5. **Return clean data** - Don't return full axios response

### Hooks

1. **One hook per query** - Separation of concerns
2. **Export query keys** - For cache invalidation
3. **Configure wisely** - Set appropriate staleTime
4. **Type the hook** - Specify data and error types
5. **Consider dependencies** - Use `enabled` option

### Components

1. **Use hooks** - Don't call services directly
2. **Handle states** - Loading, error, and success states
3. **Optimistic updates** - For better UX
4. **Cache invalidation** - After mutations
5. **Error boundaries** - Catch query errors

## 🔄 Migration Guide

To migrate existing fetch logic to React Query:

### Step 1: Create Service

```typescript
// services/your-feature.service.ts
export const yourFeatureService = {
  getData: async () => {
    const { data } = await axios.get("/api/your-endpoint");
    return data;
  },
};
```

### Step 2: Create Hook

```typescript
// hooks/use-your-feature.ts
export function useYourFeature() {
  return useQuery({
    queryKey: ["your-feature"],
    queryFn: yourFeatureService.getData,
  });
}
```

### Step 3: Update Component

```typescript
// Before
const [data, setData] = useState(null);
useEffect(() => { /* fetch */ }, []);

// After
const { data } = useYourFeature();
```

## 🎓 Learning Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query Essentials](https://tanstack.com/query/latest/docs/react/guides/queries)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

## 📈 Performance Benefits

- **Automatic caching** - Reduces redundant API calls
- **Background refetching** - Keeps data fresh
- **Request deduplication** - Multiple components, one request
- **Optimistic updates** - Instant UI feedback
- **Garbage collection** - Unused cache cleaned automatically

Your application now has a robust, scalable data-fetching architecture! 🚀

