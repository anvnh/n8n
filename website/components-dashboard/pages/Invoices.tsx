import { useState } from "react";
import { Link } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";
import { approveInvoice, rejectInvoice } from "../api/webhooks";
import { useQueryClient } from "@tanstack/react-query";
import type { Invoice } from "../api/invoices";

type Status = "All" | "Pending" | "Approved" | "Rejected" | "Paid";

function InvoiceBadge({ status }: { status: Invoice["status"] }) {
  const cls = {
    Pending: "badge-pending",
    Approved: "badge-approved",
    Rejected: "badge-rejected",
    Paid: "badge-paid",
  };
  return <span className={`badge ${cls[status]}`}>{status}</span>;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function Invoices() {
  const { data: invoices = [], isLoading, error } = useInvoices();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const filtered = invoices.filter((inv) => {
    const matchStatus = filter === "All" || inv.status === filter;
    const matchSearch =
      inv.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      inv.sender.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    All: invoices.length,
    Pending: invoices.filter((i) => i.status === "Pending").length,
    Approved: invoices.filter((i) => i.status === "Approved").length,
    Rejected: invoices.filter((i) => i.status === "Rejected").length,
    Paid: invoices.filter((i) => i.status === "Paid").length,
  };

  const doAction = async (id: string, action: "approve" | "reject") => {
    setLoading(`${id}-${action}`);
    setFeedback(null);
    try {
      if (action === "approve") await approveInvoice(id);
      else await rejectInvoice(id);
      setFeedback({
        type: "success",
        msg: `Invoice ${id} ${action}d successfully.`,
      });
      setTimeout(() => qc.invalidateQueries({ queryKey: ["invoices"] }), 800);
    } catch {
      setFeedback({
        type: "error",
        msg: `Failed to ${action} ${id}. Check if n8n webhook is active.`,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Invoices</h1>
        <p>Review and approve vendor invoices from Google Sheets</p>
      </div>

      {feedback && (
        <div
          className={
            feedback.type === "success" ? "badge badge-approved" : "error-state"
          }
          style={{
            display: "block",
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {feedback.msg}
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex gap-8 mb-24" style={{ flexWrap: "wrap" }}>
        {(["All", "Pending", "Approved", "Rejected", "Paid"] as Status[]).map(
          (s) => (
            <button
              key={s}
              className={
                filter === s ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"
              }
              onClick={() => setFilter(s)}
            >
              {s} <span style={{ opacity: 0.7 }}>({counts[s]})</span>
            </button>
          ),
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div
          className="filter-bar"
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="search-wrap">
            <input
              className="input search-input"
              style={{ paddingLeft: 14 }}
              placeholder="Search by ID or sender…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <span>Loading invoices…</span>
          </div>
        ) : error ? (
          <div style={{ padding: 20 }}>
            <div className="error-state">Error fetching invoices.</div>
          </div>
        ) : null}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Vendor</th>
                <th>Sender</th>
                <th>Received Date</th>
                <th>Amount</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Drive</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((inv) => (
                  <tr key={inv.invoiceId}>
                    <td>
                      <Link
                        to={`/invoices/${inv.invoiceId}`}
                        className="text-accent font-semibold"
                      >
                        {inv.invoiceId}
                      </Link>
                    </td>
                    <td className="text-sm font-medium">
                      {inv.vendorId || "—"}
                    </td>
                    <td className="text-sm">{inv.sender}</td>
                    <td className="text-sm text-muted">
                      {formatDate(inv.receivedDate)}
                    </td>
                    <td className="font-semibold">
                      $
                      {inv.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span className="badge badge-inactive">
                        {inv.priority || "Normal"}
                      </span>
                    </td>
                    <td>
                      <InvoiceBadge status={inv.status} />
                    </td>
                    <td>
                      {inv.driveLink ? (
                        <a
                          href={inv.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-sm"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {inv.status === "Pending" ? (
                        <div className="flex gap-8">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => doAction(inv.invoiceId, "approve")}
                            disabled={loading === `${inv.invoiceId}-approve`}
                          >
                            {loading === `${inv.invoiceId}-approve`
                              ? "…"
                              : "Approve"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => doAction(inv.invoiceId, "reject")}
                            disabled={loading === `${inv.invoiceId}-reject`}
                          >
                            {loading === `${inv.invoiceId}-reject`
                              ? "…"
                              : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">
                          {inv.transactionId || "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="table-empty">
                    <p>No invoices match your filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
