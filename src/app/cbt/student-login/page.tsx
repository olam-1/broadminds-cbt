export default function StudentLogin() {
  return (
    <div className="card">
      <h1>Student Login (Optional)</h1>
      <p className="muted">
        This starter focuses on Exam Code access first (fastest).
        Next phase will add full student/parent/teacher portals with Supabase Auth.
      </p>
      <p className="small muted">
        Rule: Username = Surname | Password = Surname + Initials (example: Olagunju A.O)
      </p>
      <a className="btn" href="/cbt/login">Start CBT by Exam Code</a>
    </div>
  );
}
