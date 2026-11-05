import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BedDouble, LogOut, Menu, Settings } from 'lucide-react';
export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const leave = () => { onLogout(); navigate('/'); };
  return <nav className="navbar navbar-expand-lg navbar-dark site-nav sticky-top"><div className="container">
    <Link className="navbar-brand brand-mark" to="/"><span className="brand-icon"><BedDouble size={20}/></span> stay<span>ease</span></Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Toggle navigation"><Menu/></button>
    <div className="collapse navbar-collapse" id="mainNav"><div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
      <NavLink className="nav-link" to="/rooms">Explore rooms</NavLink>
      {user && user.role !== 'admin' && <NavLink className="nav-link" to="/my-bookings">My bookings</NavLink>}
      {user?.role === 'admin' && <><NavLink className="nav-link" to="/admin">Dashboard</NavLink><NavLink className="nav-link" to="/admin/rooms">Rooms</NavLink><NavLink className="nav-link" to="/admin/bookings">Bookings</NavLink><NavLink className="nav-link" to="/admin/users">Users</NavLink><NavLink className="nav-link" to="/admin/operations">Payments</NavLink><NavLink className="nav-link" to="/admin/reviews">Reviews</NavLink></>}
      {user ? <><NavLink className="nav-link" to="/settings"><Settings size={15} className="me-1"/>Settings</NavLink><button className="btn btn-nav-outline ms-lg-2" onClick={leave}><LogOut size={16} className="me-1"/> Logout</button></> : <><NavLink className="nav-link" to="/login">Log in</NavLink><Link className="btn btn-lime ms-lg-2" to="/signup">Get started</Link></>}
    </div></div></div></nav>;
}
