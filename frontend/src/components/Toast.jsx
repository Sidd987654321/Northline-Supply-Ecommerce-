export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <div className={`toast ${type === "error" ? "error" : ""}`} onClick={onClose}>
      {type === "error" ? "⚠" : "✓"} {message}
    </div>
  );
}
