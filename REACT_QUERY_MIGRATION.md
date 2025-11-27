# React Query Migration Guide

## Overview

This application has been fully migrated to use **React Query (TanStack Query)** for all data fetching and state management. This provides automatic caching, background updates, optimistic updates, and better error handling.

## Architecture

### 1. Services Layer (`/services`)

Services encapsulate all API calls using Axios. Each service file contains:
- Type definitions for API responses
- CRUD operation functions
- Error handling

**Example: `services/member.service.ts`**

```typescript
export const memberService = {
  getList: async (page: number, limit: number) => {...},
  getById: async (id: string) => {...},
  create: async (memberData: CreateMemberData) => {...},
  update: async (memberData: UpdateMemberData) => {...},
  delete: async (id: string) => {...},
};
```

### 2. Hooks Layer (`/hooks`)

Custom React Query hooks wrap service calls and manage caching/mutations:
- Query hooks for fetching data (e.g., `useMembers`, `useMember`)
- Mutation hooks for modifying data (e.g., `useCreateMember`, `useUpdateMember`, `useDeleteMember`)
- Automatic cache invalidation on mutations
- Toast notifications on success/error

**Example: `hooks/use-members.ts`**

```typescript
export function useMembers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: MEMBER_KEYS.list(page),
    queryFn: () => memberService.getList(page, limit),
    placeholderData: keepPreviousData,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: memberService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.lists() });
      toast.success("Member created successfully");
    },
  });
}
```

### 3. Query Keys

Each entity has a structured set of query keys for cache management:

```typescript
export const MEMBER_KEYS = {
  all: ["members"] as const,
  lists: () => [...MEMBER_KEYS.all, "list"] as const,
  list: (page: number) => [...MEMBER_KEYS.lists(), page] as const,
  details: () => [...MEMBER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MEMBER_KEYS.details(), id] as const,
};
```

## Available Services & Hooks

### 1. Members

**Service:** `services/member.service.ts`  
**Hooks:** `hooks/use-members.ts`

- `useMembers(page, limit)` - Fetch paginated members
- `useMember(id)` - Fetch single member
- `useCreateMember()` - Create new member
- `useUpdateMember()` - Update existing member
- `useDeleteMember()` - Delete member

### 2. Users

**Service:** `services/user.service.ts`  
**Hooks:** `hooks/use-users.ts`

- `useUsers(page, limit)` - Fetch paginated users
- `useCreateUser()` - Create new user
- `useDeleteUser()` - Delete user

### 3. Finances

**Service:** `services/finance.service.ts`  
**Hooks:** `hooks/use-finances.ts`

- `useFinances(page, limit)` - Fetch paginated finance records
- `useCreateFinance()` - Create new finance record
- `useDeleteFinance()` - Delete finance record

### 4. Attendance

**Service:** `services/attendance.service.ts`  
**Hooks:** `hooks/use-attendances.ts`

- `useAttendances(page, limit)` - Fetch paginated attendance records
- `useCreateAttendance()` - Create new attendance record
- `useDeleteAttendance()` - Delete attendance record

### 5. SMS

**Service:** `services/sms.service.ts`  
**Hooks:** `hooks/use-sms.ts`

- `useSMS(page, limit)` - Fetch paginated SMS
- `useCreateSMS()` - Create/schedule new SMS
- `useDeleteSMS()` - Delete scheduled SMS

### 6. Dashboard Stats

**Service:** `services/dashboard.service.ts`  
**Hooks:** `hooks/use-dashboard-stats.ts`

- `useDashboardStats()` - Fetch dashboard statistics

## Usage Examples

### Fetching Data in a Page Component

```typescript
import { useMembers } from "@/hooks/use-members";
import { useState } from "react";

function MembersPage() {
  const [page, setPage] = useState(1);
  const { data: members, isLoading, isError } = useMembers(page, 10);

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage />;

  return (
    <div>
      <DataTable data={members.members} columns={columns} />
      <Pagination
        page={members.pagination.page}
        totalPages={members.pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Creating Data with Mutations

```typescript
import { useCreateMember } from "@/hooks/use-members";

function AddMemberDialog() {
  const createMember = useCreateMember();

  const handleSubmit = async (data) => {
    try {
      await createMember.mutateAsync(data);
      // Success toast automatically shown
      // Cache automatically invalidated
      onClose();
    } catch (error) {
      // Error toast automatically shown
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createMember.isPending}>
        {createMember.isPending ? "Creating..." : "Create Member"}
      </button>
    </form>
  );
}
```

## Cache Management

### Automatic Cache Invalidation

When mutations succeed, related queries are automatically invalidated:

```typescript
onSuccess: () => {
  // Invalidate all member lists
  queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.lists() });
  
  // Invalidate dashboard stats (if members affect stats)
  queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
}
```

### Manual Cache Updates

For optimistic updates or manual cache manipulation:

```typescript
const queryClient = useQueryClient();

// Get cached data
const members = queryClient.getQueryData(MEMBER_KEYS.list(1));

// Set cached data
queryClient.setQueryData(MEMBER_KEYS.list(1), newData);

// Remove from cache
queryClient.removeQueries({ queryKey: MEMBER_KEYS.detail(id) });
```

## Configuration

### Global Query Client Settings

Located in `components/providers/query-provider.tsx`:

```typescript
new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message || "An error occurred while fetching data");
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error.message || "An error occurred");
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Customizing Per-Query

Override defaults for specific queries:

```typescript
useQuery({
  queryKey: MEMBER_KEYS.detail(id),
  queryFn: () => memberService.getById(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
  enabled: !!id, // Only run if ID exists
});
```

## Benefits

1. **Automatic Caching**: Data is cached and reused across components
2. **Background Updates**: Stale data is refetched in the background
3. **Optimistic Updates**: UI updates before server confirms
4. **Error Handling**: Global error handlers with toast notifications
5. **Loading States**: Built-in `isLoading`, `isPending` states
6. **Pagination Support**: `placeholderData: keepPreviousData` for smooth pagination
7. **Type Safety**: Full TypeScript support with typed responses
8. **DevTools**: React Query DevTools for debugging (development only)

## DevTools

React Query DevTools are available in development mode. Open your app and look for the React Query icon in the bottom-right corner.

## Best Practices

1. **Always use hooks in components**, never call services directly
2. **Define query keys** at the top of hook files for consistency
3. **Invalidate related queries** after mutations
4. **Use `placeholderData`** for pagination to keep old data during fetch
5. **Handle loading and error states** in components
6. **Use mutation status** (`isPending`) to disable buttons during submission
7. **Extract common patterns** into reusable hooks when needed

## Migration Checklist

- ✅ Fix mutation cache in query provider
- ✅ Create member services (CRUD operations)
- ✅ Create useMember hooks (fetch, create, update, delete)
- ✅ Create user hooks and services
- ✅ Create finance hooks and services
- ✅ Create attendance hooks and services
- ✅ Create SMS hooks and services
- ✅ Update all pages to use React Query hooks
- ✅ Fix TypeScript linting errors
- ✅ Test all CRUD operations

## Next Steps

1. Implement optimistic updates for better UX
2. Add prefetching for anticipated user actions
3. Implement infinite scroll for large lists
4. Add retry logic with exponential backoff
5. Implement query cancellation for cancelled navigations

