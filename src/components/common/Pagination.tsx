import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 24 }}>
      <button className="btn btn-secondary btn-icon" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ArrowLeft size={14} />
      </button>
      <span style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)" }}>
        Page {page} of {totalPages}
      </span>
      <button className="btn btn-secondary btn-icon" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default Pagination;