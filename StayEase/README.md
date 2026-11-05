# StayEase — Hotel Room Booking System (MERN)

A starter full-stack hotel room booking application built with React + Bootstrap, Node.js, Express, MongoDB, and Mongoose.

## Requirements
- Node.js 20+ (LTS recommended)
- MongoDB Server running locally
- MongoDB Compass (optional GUI)

## 1. Database
In MongoDB Compass connect to `mongodb://127.0.0.1:27017`. You may create a database named `hotel_booking_db`, but it is also fine to let Mongoose create it automatically.

## 2. Configure backend
Open a terminal in `backend` and run:

```bash
npm install
```

Copy `.env.example` to `.env` and edit it if needed:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hotel_booking_db
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Create the initial administrator account:

```bash
npm run create-admin
```

Default values are read from `.env`:
`ADMIN_NAME=StayEase Admin`, `ADMIN_EMAIL=admin@stayease.local`, `ADMIN_PASSWORD=Admin@12345`.
Change these in `.env` before running the script. The script creates an admin only if that email does not already exist.

Start the API:

```bash
npm run dev
```

API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 3. Configure frontend
Open another terminal in `frontend` and run:

```bash
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

## Included features
- User sign-up and login with hashed passwords and JWT authentication
- Role-based admin and customer interfaces
- Admin dashboard and room create/read/update/deactivate operations
- Room search and date-based availability checks
- Booking creation, own-booking list, cancellation, admin booking status management
- Admin user listing and account deactivation
- Password change
- Responsive Bootstrap layout

## Notes
- This is an educational project starter, not a production-ready hotel reservation service.
- Booking availability is checked on the server. For production and high-concurrency use, add transaction/locking strategy and more extensive tests to prevent simultaneous booking races.
- No payment gateway or email service is included.
- Keep `.env` private. Never commit secrets or database credentials.


## Add 15 sample rooms

After configuring `backend/.env` with your MongoDB connection and ensuring MongoDB is running:

1. Open a terminal in the `backend` folder.
2. Run `npm install` if dependencies are not installed.
3. Run `npm run seed-rooms` (in Windows PowerShell, `npm.cmd run seed-rooms` also works).
4. Refresh the StayEase website. The 15 sample rooms will appear in the room directory and admin room management page.

The seed is safe to run more than once: it creates missing sample room numbers and leaves existing rooms with those numbers unchanged. It does not delete existing rooms or bookings.

## Date-based room availability

On the Explore Rooms page, choose check-in and check-out dates and click Search. Rooms that overlap a pending or confirmed booking remain visible with a **Booked for selected dates** label, while available rooms can be opened for booking. The backend checks date overlap again when a booking is submitted and prevents overlapping bookings. A check-out date is available for another guest to check in on that same day. Cancelled bookings do not block availability.

## Update: account settings and search-first booking

- Added a Settings page for signed-in customers and administrators.
- Profile editing supports full name and mobile number; email and account role are read-only in personal settings.
- Added Light, Dark, and Forest appearance themes. The selected theme is saved in the browser on that device.
- Password change remains available from Settings and still requires the current password.
- The customer room-search flow now asks for check-in, check-out, guest count, and room type before displaying matching rooms. The home-page search also includes room type.
- Added Presidential to the supported room categories and changed sample room 205 to Presidential. The sample seeder contains 15 rooms and is safe to rerun without overwriting matching room numbers.
- Date-overlap checks are still performed by the backend when a booking is created; never rely only on the room card's display status.

### Important scope note
This update implements the account settings/theme and search-first booking improvements on top of the existing project. The full wishlist (payment gateway, invoice generation, housekeeping assignments, maintenance workflows, email notifications, coupons, favourites/reviews, advanced analytics, and complete CSV report suite) is not all implemented in this archive yet. Online payments also require a real payment-gateway account and server-side integration.

## Added hotel operations (October 2026)

The admin-only **Operations** page adds payment recording/history, printable payment receipts, maintenance issue tracking, and CSV reports. The admin dashboard includes room/customer/booking counts, available/occupied/maintenance counts, today's check-ins/check-outs, pending/confirmed bookings, housekeeping and maintenance counts, revenue totals for today/last 7 days/month/year, and popular rooms.

### Start the project

1. Configure `backend/.env` using `backend/.env.example` and your local MongoDB URI.
2. Terminal 1: `cd backend`, `npm.cmd install`, then `npm.cmd run dev`.
3. Terminal 2: `cd frontend`, `npm.cmd install`, then `npm.cmd run dev`.
4. Open the Vite URL shown in the terminal (usually `http://localhost:5173`).
5. Sign in with an administrator account to use **Dashboard → Operations**.

### Operations notes

- Payment records track cash, UPI, online, card, and bank-transfer payments. Recording an online/UPI payment is only a record; it does not charge a payment gateway.
- The payment invoice/receipt opens the browser print dialog; choose “Save as PDF” to download it.
- Payment/revenue CSV exports are available from the dashboard and Operations page. Booking CSV export includes booking status and payment status.
- Reporting a maintenance issue blocks the room from new public searches. Resolving the final open maintenance issue marks the room ready and reactivates it.
- - Revenue summaries are based on payment records marked paid, not on booking totals. Historical bookings without payment records are not counted as received revenue.
