import "./globals.css";

export const metadata = {
  title: "Broadminds Model College",
  description: "Broadminds Model College - Knowledge with the Fear of God"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const school = process.env.NEXT_PUBLIC_SCHOOL_NAME || "Broadminds Model College";
  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="nav">
            <div className="brand">{school}</div>
            <a className="small muted" href="/">Home</a>
            <a className="small muted" href="/about">About</a>
            <a className="small muted" href="/admissions">Admissions</a>
            <a className="small muted" href="/cbt">CBT Portal</a>
            <a className="small muted" href="/contact">Contact</a>
          </div>
          {children}
          <div className="small muted" style={{ padding: "24px 0" }}>
            © {new Date().getFullYear()} {school}. Motto: Knowledge with the Fear of God.
          </div>
        </div>
      </body>
    </html>
  );
}
