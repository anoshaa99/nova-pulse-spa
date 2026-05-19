import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-inner">
          <h1 className="app-title">
            Nova<span>Pulse</span>
          </h1>
          <p className="app-desc">
            A bright, fast AI chat experience — ask questions, brainstorm ideas,
            or get help on the spot.
          </p>
          <ul className="feature-list">
            <li>Real-time ChatGPT replies</li>
            <li>Secure server-side API</li>
            <li>Single-page, no reloads</li>
          </ul>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <p className="topbar-label">Assistant</p>
          <span className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            Online
          </span>
        </header>

        <main className="chat-area">
          <Chatbot />
        </main>

        <footer className="bottombar">
          <p>NovaPulse AI · Web Engineering Project</p>
        </footer>
      </div>
    </div>
  );
}
