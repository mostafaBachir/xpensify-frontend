"use client";

import { Button } from "@/components/ui/button";

export default function PaginationControls({
  currentPage,
  totalCount,
  limit,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalCount / limit);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2)
  );

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <Button
        size="sm"
        variant="outline"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀️ Précédent
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? "default" : "ghost"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        size="sm"
        variant="outline"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Suivant ▶️
      </Button>
    </div>
  );
}
