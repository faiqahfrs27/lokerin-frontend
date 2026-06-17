import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "../../components/admin/ConfirmModal";
import EditInterviewModal from "../../components/admin/EditInterviewModal";
import NewInterviewModal from "../../components/admin/NewInterviewModal";
import Spinner from "../../components/common/Spinner";
import {
  useDeleteInterview,
  useInterviews,
  type Interview,
} from "../../hooks/useInterviews";

function Interviews() {
  const [openCreate, setOpenCreate] = useState(false);
  const [editInterview, setEditInterview] = useState<Interview | null>(null);
  const [deleteInterview, setDeleteInterview] = useState<Interview | null>(
    null,
  );

  const { data, isLoading, isError, error } = useInterviews();
  const deleteMutation = useDeleteInterview(() => setDeleteInterview(null));

  const interviews = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const upcoming = interviews.filter(
    (it) => new Date(it.scheduledAt) > new Date(),
  ).length;

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Interviews</span>
          <h1>Interview schedule</h1>
          <p className="sub">
            {total} total · {upcoming} upcoming
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenCreate(true)}
        >
          <Plus size={14} /> Schedule interview
        </button>
      </div>

      <div className="table-card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job</th>
              <th>Scheduled at</th>
              <th>Location</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr className="empty-row">
                <td colSpan={5}>
                  <Spinner text="Loading interviews..." />
                </td>
              </tr>
            )}
            {isError && (
              <tr className="empty-row">
                <td colSpan={5}>
                  Couldn't load interviews.{" "}
                  {(error as { message?: string })?.message ?? ""}
                </td>
              </tr>
            )}
            {!isLoading && !isError && interviews.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>
                  No interviews scheduled yet. Click "Schedule interview" to
                  create one.
                </td>
              </tr>
            )}
            {interviews.map((it) => {
              const name =
                it.application.user.profile?.fullName ??
                it.application.user.email;
              const photo = it.application.user.profile?.photoUrl;
              return (
                <tr key={it.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt={name}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "var(--surface-2)",
                            color: "var(--fg-3)",
                            display: "grid",
                            placeItems: "center",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{name}</span>
                    </div>
                  </td>
                  <td>{it.application.job.title}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Calendar size={13} />
                      {new Date(it.scheduledAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </td>
                  <td>{it.location ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: 4,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => setEditInterview(it)}
                        title="Reschedule interview"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => setDeleteInterview(it)}
                        title="Cancel interview"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openCreate && (
        <NewInterviewModal onClose={() => setOpenCreate(false)} />
      )}

      {editInterview && (
        <EditInterviewModal
          interview={editInterview}
          onClose={() => setEditInterview(null)}
        />
      )}

      {deleteInterview && (
        <ConfirmModal
          title="Cancel interview"
          message={`Cancel interview with ${
            deleteInterview.application.user.profile?.fullName ??
            deleteInterview.application.user.email
          }?`}
          tone="danger"
          confirmLabel="Cancel interview"
          onClose={() => setDeleteInterview(null)}
          onConfirm={() => deleteMutation.mutate(deleteInterview.id)}
          isPending={deleteMutation.isPending}
        />
      )}
    </>
  );
}

export default Interviews;