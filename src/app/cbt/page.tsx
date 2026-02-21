export default function CBT() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h1>CBT Portal</h1>
        <p className="muted">
          Access method: Exam Code (fast) + optional Student Login.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="btn" href="/cbt/login">Start CBT by Exam Code</a>
          <a className="btn secondary" href="/cbt/student-login">Student Login (optional)</a>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "16px 0" }} />
        <p className="small muted">
          Student Login Rule: Username = Surname (e.g., Olagunju) | Password = Surname + Initials (e.g., Olagunju A.O).
        </p>
      </div>
    </div>
  );
}
