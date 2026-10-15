import {
  LayoutDashboard, BookOpen, CheckSquare, CalendarDays, BarChart3,
  UserRound, Settings, LogOut, GraduationCap
} from "lucide-react";
const items = [
  ["Dashboard", "dashboard", LayoutDashboard],
  ["My Courses", "courses", BookOpen],
  ["Tasks", "tasks", CheckSquare],
  ["Calendar", "calendar", CalendarDays],
  ["Analytics", "analytics", BarChart3],
  ["Profile", "profile", UserRound],
];
export default function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><GraduationCap size={22} /></div>
        <div><strong>EduNova</strong><small>Student Portal</small></div>
      </div>
      <div className="side-label">MENU</div>
      <nav>
        {items.map(([label, id, Icon]) => (
          <button key={id} className={`nav-item ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}>
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className={`nav-item ${active === "settings" ? "active" : ""}`} onClick={() => setActive("settings")}>
          <Settings size={19} /><span>Settings</span>
        </button>
        <button className="nav-item logout" onClick={onLogout}>
          <LogOut size={19} /><span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}