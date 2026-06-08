import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, ArrowRight, Trash2, FileText } from "lucide-react";
import NewTestModal from "../../components/admin/NewTestModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useTests } from "../../hooks/useTests";
import type { TestListItem } from "../../hooks/useTests";
import { useDeleteTest } from "../../hooks/useDeleteTest";

function Tests() {
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TestListItem | null>(null);

  const { data, isLoading, isError, error } = useTests();
  const deleteMutation = useDeleteTest(() => setDeleteTarget(null));

  const tests = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Pre-Selection Test</span>
          <h1>Tests</h1>
          <p className="sub">{total} total</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenCreate(true)}
        >
          <Plus size={14} /> Create test
        </button>
      </div>

      <div className="table-card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Test</th>
              <th>Job</th>
              <th>Questions</th>
              <th>Attempts</th>
              <th>Pass score</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr className="empty-row">
                <td colSpan={6}>Loading...</td>
              </tr>
            )}
            {isError && (
              <tr className="empty-row">
                <td colSpan={6}>
                  Couldn't load tests.{" "}
                  {(error as { message?: string })?.message ?? ""}
                </td>
              </tr>
            )}
            {!isLoading && !isError && tests.length === 0 && (
              <tr className="empty-row">
                <td colSpan={6}>
                  No tests yet. Click "Create test" to make your first.
                </td>
              </tr>
            )}
            {tests.map((t) => (
              <tr key={t.id}>
                <td>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <FileText size={16} style={{ color: "var(--ink-soft)" }} />
                    <strong>{t.title}</strong>
                  </div>
                </td>
                <td>{t.job.title}</td>
                <td>{t._count.questions}</td>
                <td>{t._count.attempts}</td>
                <td>{t.passingScore} / 100</td>
                <td style={{ textAlign: "right" }}>
                  <div className="hstack" style={{ gap: 6, justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      title="Manage questions"
                      onClick={() => navigate(`/admin/tests/${t.id}`)}
                    >
                      <ArrowRight size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      title="Delete test"
                      onClick={() => setDeleteTarget(t)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openCreate && (
        <NewTestModal onClose={() => setOpenCreate(false)} />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete test?"
          message={`Delete "${deleteTarget.title}"? All questions and attempts will be removed.`}
          confirmLabel="Delete"
          tone="danger"
          isPending={deleteMutation.isPending}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        />
      )}
    </>
  );
}

export default Tests;