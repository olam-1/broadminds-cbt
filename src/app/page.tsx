export default function Home() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div className="badge red">Admission is Now in Progress</div>
        <h1 style={{ marginTop: 10 }}>Broadminds Model College</h1>
        <p className="muted" style={{ marginTop: -6 }}>
          Nursery • Primary • JSS • SSS — Knowledge with the Fear of God
        </p>
        <p>
          Adjacent Baptist Grammar School, Off NIHORT Road, Idi-Ishin, Ibadan.
          <br />
          Director of Schools: <b>+2347069381923</b>
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="btn" href="/admissions">Apply for Admission</a>
          <a className="btn secondary" href="/cbt">Start CBT</a>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <h3>Why Parents Trust Broadminds</h3>
          <ul className="muted">
            <li>Strong academics + moral training</li>
            <li>Modern CBT system with instant scoring</li>
            <li>Safe and conducive learning environment</li>
            <li><b>Weekend Qur’an & Arabic classes (offered)</b></li>
          </ul>
        </div>
        <div className="card">
          <h3>CBT Portal</h3>
          <p className="muted">
            Take timed exams, get instant results, and practice confidently.
          </p>
          <a className="btn" href="/cbt/login">Start CBT by Exam Code</a>
        </div>
      </div>
    </div>
  );
}
