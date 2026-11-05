require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Room = require('../src/models/Room');

const rooms = [
  { roomNumber: '101', roomType: 'Standard', pricePerNight: 1499, capacity: 2, description: 'A cosy standard room for a comfortable city stay.', amenities: ['Wi-Fi', 'Air conditioning', 'TV'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '102', roomType: 'Standard', pricePerNight: 1599, capacity: 2, description: 'A bright room with practical comforts for two guests.', amenities: ['Wi-Fi', 'Air conditioning', 'Work desk'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '103', roomType: 'Standard', pricePerNight: 1699, capacity: 2, description: 'Simple, peaceful accommodation for short stays.', amenities: ['Wi-Fi', 'TV', 'Tea maker'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '104', roomType: 'Deluxe', pricePerNight: 2299, capacity: 2, description: 'An upgraded room with extra space and a refined finish.', amenities: ['Wi-Fi', 'Air conditioning', 'Mini fridge'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '105', roomType: 'Deluxe', pricePerNight: 2499, capacity: 3, description: 'A spacious deluxe room suited to a small family.', amenities: ['Wi-Fi', 'TV', 'Mini fridge'], image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '106', roomType: 'Deluxe', pricePerNight: 2599, capacity: 3, description: 'Comfortable interiors with room to unwind.', amenities: ['Wi-Fi', 'Air conditioning', 'Work desk'], image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '107', roomType: 'Suite', pricePerNight: 3999, capacity: 2, description: 'A premium suite with a separate lounge feel.', amenities: ['Wi-Fi', 'Lounge area', 'Mini fridge'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '108', roomType: 'Suite', pricePerNight: 4499, capacity: 3, description: 'A premium stay with generous space and elegant details.', amenities: ['Wi-Fi', 'Lounge area', 'Smart TV'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '109', roomType: 'Family', pricePerNight: 3299, capacity: 4, description: 'A family-friendly room with space for everyone.', amenities: ['Wi-Fi', 'Air conditioning', 'Extra beds'], image: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '110', roomType: 'Family', pricePerNight: 3599, capacity: 5, description: 'A larger room for families travelling together.', amenities: ['Wi-Fi', 'TV', 'Extra beds'], image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '201', roomType: 'Standard', pricePerNight: 1499, capacity: 2, description: 'A quiet upper-floor room for a relaxing visit.', amenities: ['Wi-Fi', 'Air conditioning', 'TV'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '202', roomType: 'Deluxe', pricePerNight: 2399, capacity: 3, description: 'A polished deluxe room with everyday essentials.', amenities: ['Wi-Fi', 'Air conditioning', 'Tea maker'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '203', roomType: 'Suite', pricePerNight: 4299, capacity: 2, description: 'An elegant suite for a special weekend or business trip.', amenities: ['Wi-Fi', 'Lounge area', 'Smart TV'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '204', roomType: 'Family', pricePerNight: 3799, capacity: 6, description: 'A family room with capacity for a group of up to six.', amenities: ['Wi-Fi', 'TV', 'Extra beds'], image: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1000&q=85' },
  { roomNumber: '205', roomType: 'Presidential', pricePerNight: 6999, capacity: 4, description: 'A premium presidential room with extra space and luxury amenities.', amenities: ['Wi-Fi', 'Air conditioning', 'Mini fridge'], image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=85' }
];

async function seed() {
  try {
    await connectDB();
    let added = 0; let skipped = 0;
    for (const room of rooms) {
      const result = await Room.updateOne({ roomNumber: room.roomNumber }, { $setOnInsert: { ...room, isActive: true } }, { upsert: true });
      if (result.upsertedCount) added++; else skipped++;
    }
    console.log(`Sample room seed complete. Added: ${added}; already existed (left unchanged): ${skipped}; sample rooms: ${rooms.length}.`);
  } catch (error) {
    console.error('Could not seed sample rooms:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
seed();
