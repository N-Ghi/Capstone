// Styles
export const s: Record<string, React.CSSProperties> = {
  section: { padding: "2px 0" },

  // Header
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "12px" },
  headerLeft: { display: "flex", flexDirection: "column", gap: "4px" },
  title: { margin: 0, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(43,65,80,0.4)", fontFamily: "'DM Sans', sans-serif" },
  avgRow: { display: "flex", alignItems: "center", gap: "5px" },
  avgNumber: { fontSize: "0.88rem", fontWeight: 600, color: "#2B4150", fontFamily: "'DM Sans', sans-serif" },
  reviewCount: { fontSize: "0.78rem", color: "rgba(43,65,80,0.4)", fontFamily: "'DM Sans', sans-serif" },

  leaveReviewBtn: {
    padding: "7px 14px",
    background: "linear-gradient(135deg, #627F67, #506957)",
    border: "none", borderRadius: "7px",
    fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, color: "#fff", cursor: "pointer",
    boxShadow: "0 2px 8px rgba(98,127,103,0.22)",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  },

  // Loading
  loadingRow: { display: "flex", alignItems: "center", gap: "10px", padding: "20px 0", color: "rgba(43,65,80,0.4)" },
  spinner: { width: "15px", height: "15px", border: "2px solid rgba(43,65,80,0.1)", borderTopColor: "#627F67", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  loadingText: { fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" },

  // Empty
  empty: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "8px", padding: "28px 0", color: "rgba(43,65,80,0.3)" },
  emptyIcon: { fontSize: "22px" },
  emptyText: { margin: 0, fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif" },

  // List
  list: { display: "flex", flexDirection: "column" as const, gap: "0px" },

  // Review card
  reviewCard: {
    padding: "14px 0",
    borderBottom: "1px solid rgba(43,65,80,0.07)",
  },
  reviewCardOwn: {
    background: "rgba(98,127,103,0.04)",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "4px",
    borderBottom: "none",
  },
  reviewTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" },
  authorRow: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" as const, flexShrink: 0 },
  avatarFallback: {
    width: "34px", height: "34px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: 600, color: "#fff",
    fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
  },
  authorName: { fontSize: "0.86rem", fontWeight: 600, color: "#2B4150", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px" },
  youBadge: { fontSize: "0.68rem", fontWeight: 500, background: "rgba(98,127,103,0.12)", color: "#506957", borderRadius: "999px", padding: "1px 7px", fontFamily: "'DM Sans', sans-serif" },
  reviewMeta: { display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" },
  metaDot: { color: "rgba(43,65,80,0.25)", fontSize: "0.8rem" },
  reviewDate: { fontSize: "0.74rem", color: "rgba(43,65,80,0.38)", fontFamily: "'DM Sans', sans-serif" },
  editedTag: { fontSize: "0.68rem", color: "rgba(43,65,80,0.3)", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" as const },
  editBtn: {
    padding: "4px 11px", background: "transparent",
    border: "1.5px solid rgba(43,65,80,0.15)", borderRadius: "6px",
    fontSize: "0.74rem", fontFamily: "'DM Sans', sans-serif",
    color: "rgba(43,65,80,0.5)", cursor: "pointer", flexShrink: 0,
  },
  reviewComment: { margin: 0, fontSize: "0.86rem", color: "rgba(43,65,80,0.72)", lineHeight: "1.6", fontFamily: "'DM Sans', sans-serif" },

  // Edit wrapper
  editingWrap: { background: "rgba(43,65,80,0.02)", borderRadius: "8px", padding: "14px", marginBottom: "4px", border: "1.5px solid rgba(43,65,80,0.08)" },

  // Inline form
  inlineForm: { background: "rgba(43,65,80,0.02)", borderRadius: "8px", padding: "16px", marginBottom: "16px", border: "1.5px solid rgba(43,65,80,0.08)" },
  formField: { marginBottom: "12px" },
  starRow: { display: "flex", alignItems: "center", gap: "2px" },
  starBtn: { background: "none", border: "none", fontSize: "24px", cursor: "pointer", padding: "0 1px", lineHeight: 1, transition: "transform 0.1s ease, color 0.1s ease" },
  ratingHint: { marginLeft: "8px", fontSize: "0.76rem", color: "rgba(43,65,80,0.45)", fontFamily: "'DM Sans', sans-serif" },
  fieldError: { display: "block", marginTop: "4px", fontSize: "0.74rem", color: "#c0392b", fontFamily: "'DM Sans', sans-serif" },
  textarea: {
    width: "100%", boxSizing: "border-box" as const,
    background: "#fff", border: "1.5px solid rgba(43,65,80,0.15)",
    borderRadius: "7px", color: "#2B4150", fontSize: "0.86rem",
    fontFamily: "'DM Sans', sans-serif", lineHeight: "1.6",
    padding: "9px 12px", resize: "vertical" as const, outline: "none",
    transition: "border-color 0.15s",
  },
  textareaFooter: { display: "flex", alignItems: "center", marginTop: "4px" },
  charCount: { fontSize: "0.7rem", color: "rgba(43,65,80,0.3)", fontFamily: "'DM Sans', sans-serif" },
  submitError: { margin: "0 0 10px", fontSize: "0.76rem", color: "#c0392b", fontFamily: "'DM Sans', sans-serif" },
  formActions: { display: "flex", justifyContent: "flex-end", gap: "8px" },
  cancelBtn: { padding: "7px 16px", background: "transparent", border: "1.5px solid rgba(43,65,80,0.15)", borderRadius: "7px", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", color: "rgba(43,65,80,0.5)", cursor: "pointer" },
  submitBtn: { padding: "7px 18px", background: "linear-gradient(135deg, #627F67, #506957)", border: "none", borderRadius: "7px", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(98,127,103,0.22)", transition: "opacity 0.15s" },
};