const LABELS = {
  connected: "Live",
  connecting: "Connecting",
  reconnecting: "Reconnecting",
  offline: "Offline",
};

export function ConnectionBadge({ status }) {
  return (
    <div className={`connection-badge ${status}`}>
      <span className="status-dot" aria-hidden="true" />
      {LABELS[status] || "Unknown"}
    </div>
  );
}
