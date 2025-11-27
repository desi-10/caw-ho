"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const handlePrevious = () => {
    if (hasPrevPage && !isLoading) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage && !isLoading) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!hasPrevPage || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!hasNextPage || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
