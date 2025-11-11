
"use client";

import React from "react";
// import { _ } from "vitest/dist/chunks/reporters.d.BFLkQcL6";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const goto = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    if (page != currentPage) onPageChange(page);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-4">
      <div className="text-sm">
        Showing page <strong>{currentPage}</strong> of{" "}
        <strong>{totalPages}</strong>
      </div>

      <div className="btn-group">
        <button className="btn btn-sm" onClick={() => goto(currentPage - 1)}>
          ← Previous
        </button>

        {/* For compactness, show a few page buttons around current */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) =>
              p === 1 ||
              p === totalPages ||
              (p >= currentPage - 2 && p <= currentPage + 2)
          )
          .map((p, idx, arr) => {
            // Show ellipsis if gap
            const prev = arr[idx - 1];
            const isGap = prev && p - prev > 1;
            return (
              <React.Fragment key={p}>
                {isGap && <span className="btn btn-ghost btn-sm">...</span>}
                <button
                  onClick={() => goto(p)}
                  className={`btn btn-sm ${ p === currentPage
                    ? "!bg-gradient-nav text-black dark:text-white shadow-md"
                    : "bg-blue-700 dark:bg-sky-500/50 hover:bg-gradient-nav hover:text-white"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

        <button 
          className="btn btn-sm" 
          onClick={() => goto(currentPage + 1)} disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );

};

export default Pagination;

