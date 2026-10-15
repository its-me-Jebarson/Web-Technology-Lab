import { Bell, Search, Sun, Moon, Menu } from "lucide-react";

export default function Topbar({ dark, setDark, setMobileOpen, search, setSearch }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
      <div className="search-wrap">
        <Search size={18} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search courses, tasks..." />
        {search && <button className="clear-search" onClick={() => setSearch("")}>×</button>}
      </div>
      <div className="top-actions">
        <button className="icon-btn" onClick={() => setDark(!dark)} title="Toggle theme">
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="icon-btn notification" title="Notifications"><Bell size={19} /><i /></button>
        <div className="user-mini">
          <div className="avatar">JP</div>
          <div><strong>Jebarson</strong><small>CSE • Year 3</small></div>
        </div>
      </div>
    </header>
  );
}