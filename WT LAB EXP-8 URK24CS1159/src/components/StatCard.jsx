import { ArrowUpRight } from "lucide-react";

export default function StatCard({ icon: Icon, title, value, change, tone }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-top">
        <div className="icon-box"><Icon size={20} /></div>
        <span className="change"><ArrowUpRight size={14} /> {change}</span>
      </div>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}