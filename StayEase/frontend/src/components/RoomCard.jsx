import { Link } from 'react-router-dom';
import { Users, ArrowUpRight, Wifi, Sparkles } from 'lucide-react';
const fallback = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85';
export default function RoomCard({ room }) {
  return <article className="room-card h-100"><div className="room-photo-wrap"><img className="room-photo" src={room.image || fallback} alt={`${room.roomType} room`} onError={(e) => { e.currentTarget.src = fallback; }}/><span className="room-type-tag">{room.roomType}</span>{room.isAvailableForDates === false && <span className="room-unavailable-tag">Booked for selected dates</span>}</div>
    <div className="room-card-body"><div className="d-flex justify-content-between align-items-start gap-2"><div><p className="eyebrow mb-1">ROOM {room.roomNumber}</p><h3 className="room-title">{room.roomType} retreat</h3></div><div className="room-price">₹{Number(room.pricePerNight).toLocaleString('en-IN')}<small>/ night</small></div></div>
      <p className="room-desc">{room.description || 'A thoughtfully designed room with everything you need for a relaxing stay.'}</p><div className="room-meta"><span><Users size={16}/> Up to {room.capacity}</span><span><Wifi size={16}/> Comfort stay</span></div>
      <div className="room-card-bottom"><span className="amenity-note"><Sparkles size={15}/> {room.amenities?.slice(0, 2).join(' · ') || 'Relax · Recharge'}</span>{room.isAvailableForDates === false ? <span className="round-arrow room-unavailable-action" title="Unavailable for selected dates" aria-label="Unavailable for selected dates">—</span> : <Link className="round-arrow" to={`/rooms/${room._id}`} aria-label={`View ${room.roomType}`}><ArrowUpRight size={19}/></Link>}</div>
    </div></article>;
}
