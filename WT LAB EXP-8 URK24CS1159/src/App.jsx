import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, ClipboardCheck, CalendarCheck2, Trophy, Plus, X, MoreHorizontal,
  ChevronRight, TrendingUp, CheckCircle2, Target, Users, Award, ShieldCheck,
  LockKeyhole, Eye, EyeOff, Mail, Sparkles, Flame, Clock3, Bell, LogOut
} from "lucide-react";
import StatCard from "./components/StatCard";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TaskList from "./components/TaskList";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Complete React UI Lab", course: "Web Technology", date: "Today", priority: "high", done: false },
  { id: 2, title: "Prepare DBMS normalization notes", course: "Database Management", date: "Tomorrow", priority: "medium", done: false },
  { id: 3, title: "Submit DAA assignment", course: "Design & Analysis", date: "Oct 03", priority: "high", done: true },
  { id: 4, title: "Review Computer Networks", course: "Networks", date: "Oct 05", priority: "low", done: false },
];

const courses = [
  { name: "Web Technology", code: "23CS2034", progress: 82, instructor: "Dr. Priya", color: "purple" },
  { name: "Database Management", code: "23CS2014", progress: 74, instructor: "Mr. Arun", color: "blue" },
  { name: "Design & Analysis of Algorithms", code: "23CS2008", progress: 68, instructor: "Dr. Kumar", color: "orange" },
  { name: "Computer Networks", code: "23CS2051", progress: 91, instructor: "Ms. Anitha", color: "green" },
];

const notifications = [
  "React UI Lab is due today",
  "Database lecture starts at 11:30 AM",
  "Your attendance is above the 85% requirement",
];

function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("edunova-auth") === "true");
  const [dark, setDark] = useState(() => localStorage.getItem("edunova-theme") === "dark");
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [taskText, setTaskText] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("");
  const [chartRange, setChartRange] = useState("6 months");

  useEffect(() => localStorage.setItem("edunova-theme", dark ? "dark" : "light"), [dark]);
  useEffect(() => localStorage.setItem("edunova-auth", authenticated ? "true" : "false"), [authenticated]);

  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.filter(t => !t.done).length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const attendance = 92;
  const cgpa = 8.7;

  const filteredCourses = useMemo(() =>
    courses.filter(c => `${c.name} ${c.code} ${c.instructor}`.toLowerCase().includes(search.toLowerCase())), [search]
  );

  const notify = (msg) => {
    setToast(msg);
    window.clearTimeout(window.__eduToast);
    window.__eduToast = window.setTimeout(() => setToast(""), 2200);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    setTasks(prev => [{ id: Date.now(), title: taskText.trim(), course: "Personal", date: "Today", priority: taskPriority, done: false }, ...prev]);
    setTaskText("");
    setTaskPriority("medium");
    setShowTaskForm(false);
    notify("Task added successfully");
  };

  const toggleTask = id => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    notify("Task status updated");
  };
  const deleteTask = id => { setTasks(prev => prev.filter(t => t.id !== id)); notify("Task deleted"); };

  const logout = () => {
    localStorage.removeItem("edunova-auth");
    setAuthenticated(false);
    setActive("dashboard");
  };

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;

  return (
    <div className={dark ? "app dark" : "app"}>
      <div className={`mobile-overlay ${mobileOpen ? "show" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`sidebar-holder ${mobileOpen ? "open" : ""}`}>
        <Sidebar active={active} setActive={(id) => { setActive(id); setMobileOpen(false); }} onLogout={logout} />
      </div>
      <section className="main-area">
        <Topbar dark={dark} setDark={setDark} setMobileOpen={setMobileOpen} search={search} setSearch={setSearch}
          onNotifications={() => setShowNotifications(v => !v)} hasNotifications={notifications.length > 0} />
        {showNotifications && <div className="notification-popover"><div className="popover-head"><strong>Notifications</strong><span>{notifications.length} new</span></div>{notifications.map((n, i) => <button key={i} onClick={() => { setShowNotifications(false); notify(n); }}><span className="notification-dot"/><span>{n}</span></button>)}<button className="mark-read" onClick={() => setShowNotifications(false)}>Close notifications</button></div>}

        <main className="content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow"><span className="live-dot" /> Academic overview</div>
              <h1>Good morning, Jebarson <span>👋</span></h1>
              <p>Here’s what’s happening with your studies today.</p>
            </div>
            <button className="primary-btn" onClick={() => setShowTaskForm(true)}><Plus size={18} /> Add task</button>
          </div>

          {active === "dashboard" && <>
            <section className="stats-grid">
              <button className="stat-button" onClick={() => setActive("courses")}><StatCard icon={BookOpen} title="Active Courses" value="6" change="+2.4%" tone="purple" /></button>
              <button className="stat-button" onClick={() => setActive("tasks")}><StatCard icon={ClipboardCheck} title="Pending Tasks" value={pending} change="+12.5%" tone="blue" /></button>
              <button className="stat-button" onClick={() => setActive("analytics")}><StatCard icon={CalendarCheck2} title="Attendance" value={`${attendance}%`} change="+1.8%" tone="green" /></button>
              <button className="stat-button" onClick={() => setActive("analytics")}><StatCard icon={Trophy} title="Current CGPA" value={cgpa} change="+0.3" tone="orange" /></button>
            </section>

            <section className="quick-strip">
              <div><Flame size={18}/><span><strong>12 day</strong> study streak</span></div>
              <div><Clock3 size={18}/><span><strong>4.5 hrs</strong> focused this week</span></div>
              <div><Target size={18}/><span><strong>{completionRate}%</strong> task completion</span></div>
              <button onClick={() => setActive("analytics")}>View insights <ChevronRight size={15}/></button>
            </section>

            <section className="grid-2">
              <div className="panel performance">
                <div className="panel-head">
                  <div><h3>Academic performance</h3><p>Your progress across the semester</p></div>
                  <select className="chart-select" value={chartRange} onChange={e => { setChartRange(e.target.value); notify(`Showing ${e.target.value.toLowerCase()} performance`); }}><option>6 months</option><option>3 months</option><option>This year</option></select>
                </div>
                <div className="chart-area">
                  <div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
                  <div className="chart"><div className="grid-line" /><div className="grid-line second" /><div className="grid-line third" /><div className="grid-line fourth" />
                    <svg viewBox="0 0 600 220" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopOpacity=".22"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs><path d="M0 175 C45 158 75 145 115 151 S170 126 205 135 S250 115 295 123 S345 93 385 105 S435 77 475 88 S535 55 600 63 L600 220 L0 220 Z" fill="url(#fill)"/><path d="M0 175 C45 158 75 145 115 151 S170 126 205 135 S250 115 295 123 S345 93 385 105 S435 77 475 88 S535 55 600 63" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
                    <div className="chart-labels"><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span></div>
                  </div>
                </div>
                <div className="performance-footer"><span><i className="legend" /> Overall score</span><strong>86.4% <TrendingUp size={15} /></strong></div>
              </div>

              <div className="panel attendance-panel">
                <div className="panel-head"><div><h3>Attendance</h3><p>Current semester</p></div><button className="ghost-btn" onClick={() => notify("Attendance details are up to date")}><MoreHorizontal size={19}/></button></div>
                <div className="attendance-ring"><div className="ring"><div><strong>92%</strong><span>Overall</span></div></div></div>
                <div className="attendance-items"><div><span><i className="dot purple-dot" /> Present</span><strong>46 days</strong></div><div><span><i className="dot gray-dot" /> Absent</span><strong>4 days</strong></div></div>
                <div className="notice"><ShieldCheck size={17} /><span>Attendance is above the 85% requirement.</span></div>
              </div>
            </section>

            <section className="grid-2 lower">
              <div className="panel">
                <div className="panel-head"><div><h3>My courses</h3><p>{filteredCourses.length} courses shown</p></div><button className="text-btn" onClick={() => setActive("courses")}>View all <ChevronRight size={15}/></button></div>
                <div className="course-list">{filteredCourses.slice(0, 4).map(course => <div className="course-row" key={course.code} onClick={() => { setActive("courses"); notify(`${course.name} opened`); }}><div className={`course-icon ${course.color}`}><BookOpen size={18}/></div><div className="course-info"><strong>{course.name}</strong><span>{course.code} • {course.instructor}</span></div><div className="progress-wrap"><div className="progress"><span style={{width: `${course.progress}%`}} /></div><small>{course.progress}%</small></div></div>)}{filteredCourses.length === 0 && <div className="empty">No courses found.</div>}</div>
              </div>
              <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} filter={filter} setFilter={setFilter} />
            </section>
          </>}

          {active === "courses" && <Page title="My Courses" subtitle="Track your course completion and academic progress"><div className="course-cards">{filteredCourses.map(c => <CourseCard key={c.code} course={c} onOpen={() => notify(`${c.name} selected`)} />)}</div></Page>}
          {active === "tasks" && <Page title="Tasks & Assignments" subtitle="Manage everything you need to complete"><TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} filter={filter} setFilter={setFilter} /></Page>}
          {active === "calendar" && <Page title="Academic Calendar" subtitle="Your upcoming schedule"><CalendarView notify={notify}/></Page>}
          {active === "analytics" && <Page title="Analytics" subtitle="A quick view of your academic metrics"><Analytics tasks={tasks} completionRate={completionRate}/></Page>}
          {active === "profile" && <Page title="Student Profile" subtitle="Your personal and academic information"><Profile onEdit={() => notify("Profile editing is ready for your next update")} /></Page>}
          {active === "settings" && <Page title="Settings" subtitle="Customize your dashboard"><Settings dark={dark} setDark={setDark} notify={notify} onLogout={logout}/></Page>}
        </main>
        <footer>© 2026 EduNova • Modern Student Dashboard</footer>
      </section>

      {showTaskForm && <div className="modal-backdrop" onMouseDown={() => setShowTaskForm(false)}><form className="modal" onSubmit={addTask} onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><h3>Add a new task</h3><p>Create a task and stay organized.</p></div><button type="button" onClick={() => setShowTaskForm(false)}><X size={19}/></button></div><label>Task name<input autoFocus value={taskText} onChange={e => setTaskText(e.target.value)} placeholder="e.g. Complete React assignment" /></label><label>Priority<select value={taskPriority} onChange={e => setTaskPriority(e.target.value)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><div className="modal-actions"><button type="button" className="ghost-btn" onClick={() => setShowTaskForm(false)}>Cancel</button><button className="primary-btn">Add task</button></div></form></div>}
      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("student@edunova.com");
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = e => { e.preventDefault(); if (email === "jebarson@eduserve.com" && password === "hello123") { setError(""); onLogin(); } else setError("Invalid credentials. Use the demo account shown below."); };
  return <div className="login-page"><div className="login-glow one"/><div className="login-glow two"/><div className="login-card"><div className="login-brand"><div className="brand-mark"><BookOpen size={23}/></div><div><strong>EduNova</strong><span>Student Portal</span></div></div><div className="login-heading"><div className="eyebrow"><Sparkles size={13}/> Welcome back</div><h1>Sign in to your dashboard</h1><p>Continue your learning journey and keep your semester on track.</p></div><form onSubmit={submit} className="login-form"><label><span>Email address</span><div className="input-icon"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></div></label><label><span>Password</span><div className="input-icon"><LockKeyhole size={17}/><input type={show ? "text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{error && <div className="login-error">{error}</div>}<button className="login-submit">Sign in <ChevronRight size={17}/></button></form><div className="demo-box"><strong>Demo login</strong><span>Email: jebarson@eduserve.com</span><span>Password: hello123</span></div><p className="login-note">Demo authentication uses your browser's local storage. No real account is created.</p></div></div>;
}

function Page({ title, subtitle, children }) { return <div className="page"><div className="page-title"><div><div className="eyebrow"><span className="live-dot"/> Student workspace</div><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</div>; }
function CourseCard({ course, onOpen }) { return <button className="course-card" onClick={onOpen}><div className={`big-course-icon ${course.color}`}><BookOpen size={25}/></div><h3>{course.name}</h3><p>{course.code} • {course.instructor}</p><div className="big-progress"><span style={{width:`${course.progress}%`}}/></div><div className="course-meta"><strong>{course.progress}% complete</strong><span>Active</span></div></button>; }
function CalendarView({ notify }) { const events = [["09:00 AM","Web Technology","Lab session • Room C-204"],["11:30 AM","Database Management","Lecture • Room A-112"],["02:00 PM","Design & Analysis","Assignment review"],["04:00 PM","Computer Networks","Tutorial session"]]; return <div className="panel schedule"><div className="panel-head"><div><h3>Today’s schedule</h3><p>Wednesday, October 1, 2026</p></div><CalendarCheck2 size={22}/></div>{events.map(e=><button className="event event-button" key={e[0]} onClick={()=>notify(`${e[1]} event selected`)}><span>{e[0]}</span><div><strong>{e[1]}</strong><p>{e[2]}</p></div><ChevronRight size={16}/></button>)}</div>; }
function Analytics({ tasks, completionRate }) { const done = tasks.filter(t=>t.done).length; return <div className="analytics-grid"><div className="metric panel"><Target/><strong>86.4%</strong><span>Overall performance</span></div><div className="metric panel"><CheckCircle2/><strong>{done}/{tasks.length}</strong><span>Tasks completed • {completionRate}%</span></div><div className="metric panel"><Users/><strong>92%</strong><span>Attendance</span></div><div className="metric panel"><Award/><strong>8.7</strong><span>Current CGPA</span></div></div>; }
function Profile({ onEdit }) { return <div className="panel profile-panel"><div className="profile-big"><div className="profile-avatar">JP</div><div><h3>Jebarson P</h3><p>B.Tech Computer Science & Engineering</p><span>3rd Year • Student ID: CSE2024</span></div><button className="ghost-btn profile-edit" onClick={onEdit}>Edit profile</button></div><div className="profile-grid"><div><small>Email</small><strong>student@edunova.com</strong></div><div><small>Department</small><strong>Computer Science & Engineering</strong></div><div><small>Current CGPA</small><strong>8.7 / 10</strong></div><div><small>Attendance</small><strong>92%</strong></div></div></div>; }
function Settings({ dark, setDark, notify, onLogout }) { return <div className="panel settings-panel"><div className="setting-row"><div><strong>Dark mode</strong><p>Use a darker interface for low-light environments.</p></div><button className={`switch ${dark ? "on":""}`} onClick={()=>setDark(!dark)}><span/></button></div><div className="setting-row"><div><strong>Desktop notifications</strong><p>Show updates for tasks and academic reminders.</p></div><button className="switch on" onClick={()=>notify("Notifications preference updated")}><span/></button></div><div className="setting-row"><div><strong>Account session</strong><p>Sign out from this browser session.</p></div><button className="danger-btn" onClick={onLogout}><LogOut size={15}/> Sign out</button></div></div>; }

export default App;
