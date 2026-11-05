# StayEase update notes

## Changes in this build
- Explore Rooms shows all active rooms on first load; date/type/guest filters can be used to check date-based availability.
- Admin room directory includes room search and a shortcut to date-wise availability.
- Admin booking list includes search by guest, email, room number, or booking reference, and displays Payment Status instead of the Update dropdown.
- Payments & invoices includes search by booking/invoice reference, guest name, room, or payment reference. The single-option dropdown-style tab bar has been removed.
- Added an admin-only Reviews page. Feedback is shown without customer names or IDs.
- Added a readable booking reference (`STY-...`) for new bookings and CSV exports; MongoDB ObjectIds remain as internal document and relationship identifiers.
- Added search fields to room and user management.

## MongoDB ObjectId note
MongoDB `_id` values and `user` / `room` reference fields are internal identifiers used to connect records safely. They should not be manually replaced with names. The application displays readable booking references instead. Existing bookings without a booking reference continue to use a short display fallback.

## Run locally
1. Keep your existing private `backend/.env` file.
2. Backend terminal: `cd backend`, `npm.cmd install`, `npm.cmd run dev`.
3. Frontend terminal: `cd frontend`, `npm.cmd install`, `npm.cmd run dev`.
4. Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Testing note
Backend JavaScript syntax was checked. A full frontend build could not be completed in this environment; please run `npm.cmd run build` locally and test room search, bookings, payment search, and review visibility.


## Payment selector and database-backed reviews update
- The payment booking selector only lists bookings with an outstanding balance and pending/partially-paid payment status; cancelled, paid, and refunded bookings are excluded.
- Payment amounts are checked against the remaining balance by the backend.
- Customer ratings and suggestions are stored in MongoDB in the `reviews` collection and can be viewed by admins without exposing customer names or account IDs.
- New bookings receive a readable booking reference. For existing records without a reference, run `npm.cmd run backfill-booking-refs` from the backend folder after configuring `.env`. This updates only missing references and preserves MongoDB ObjectIds.


## Booking status selector fix
- Fixed the dashboard's booking-status dropdown, which referenced an undefined update handler.
- Restored a working booking-status dropdown in Admin > Manage bookings.
- Both selectors send the selected status to the admin-only `PATCH /api/bookings/:id/status` endpoint and update the displayed booking after a successful response.
- If the update is rejected (for example, due to overlapping room dates), an error message is displayed.


## Reviews date display fix
- Fixed the Admin Reviews date column to display the review's `createdAt` timestamp returned by the backend, with `date` as a fallback.
