export default function Admissions() {
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h1>Admissions</h1>
        <div className="badge red">Admission in Progress</div>
        <p className="muted">
          Entrance Form Fee: <b>₦5,000</b>
        </p>
        <p>
          Location: Adjacent Baptist Grammar School, Off NIHORT Road, Idi-Ishin, Ibadan.
          <br/>Director: <b>+2347069381923</b>
        </p>
        <h3>Admission Process</h3>
        <ol className="muted">
          <li>Fill the admission form (online/offline)</li>
          <li>Receive CBT exam code</li>
          <li>Take entrance CBT</li>
          <li>Admission decision + registration</li>
        </ol>
      </div>

      <div className="card">
        <h3>Apply (Starter)</h3>
        <p className="muted">
          This starter does not include the full admission form yet.
          Your developer (or the next phase) will connect it to Supabase.
        </p>
        <p className="muted">
          For now, call: <b>+2347069381923</b>
        </p>
      </div>
    </div>
  );
}
