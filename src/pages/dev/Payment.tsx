import { useState } from "react";
import { usePayments } from "../../hooks/useSubscription";
import PaymentRow from "../../components/subscription/PaymentRow";
import Pagination from "../../components/common/Pagination";
import type { Payment } from "../../schemas/subscriptionSchema";
import Spinner from "../../components/common/Spinner";

function Payments() {
  const [page, setPage] = useState(1);
  const { data: paymentsRes, isLoading, error } = usePayments(page);

  return (
    <>
      <div className="admin-top">
        <div>
          <span className="kicker">Subscriptions</span>
          <h1>Payment Approvals</h1>
          <p className="sub">Review and approve user subscription payments.</p>
        </div>
      </div>
      <div className="table-card">
        <table className="tbl">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Proof</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <TableBody
              payments={paymentsRes?.data}
              isLoading={isLoading}
              error={error}
            />
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={paymentsRes?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
    </>
  );
}

function TableBody({
  payments,
  isLoading,
  error,
}: {
  payments?: Payment[];
  isLoading: boolean;
  error: unknown;
}) {
  if (isLoading)
    return (
      <tr className="empty-row">
        <td colSpan={7}>
          <Spinner text="Loading payments..." />
        </td>
      </tr>
    );
  if (error)
    return (
      <tr className="empty-row">
        <td colSpan={7}>Failed to load payments.</td>
      </tr>
    );
  if (!payments || payments.length === 0)
    return (
      <tr className="empty-row">
        <td colSpan={7}>No payments yet.</td>
      </tr>
    );
  return (
    <>
      {payments.map((p) => (
        <PaymentRow key={p.id} payment={p} />
      ))}
    </>
  );
}

export default Payments;