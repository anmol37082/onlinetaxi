# TODO: Fix TypeError in API Routes

## Tasks
- [x] Refactor src/app/api/toproutes/route.js to use Mongoose TopRoute model instead of client.db()
- [x] Refactor src/app/api/tours/route.js to use Mongoose Tour model instead of client.db()
- [ ] Test the API endpoints to ensure they work correctly

## Details
The error occurs because dbConnect() returns a Mongoose connection object, not a native MongoDB client. The routes are trying to call client.db() which doesn't exist on Mongoose objects. Instead, use Mongoose models for database operations.

---

# TODO: Implement Booking Modal in BookingSection

## Tasks
- [x] Add state for showBookingModal and selectedCab in BookingSection.js
- [x] Modify handleBookNow to check authentication and open modal
- [x] Add BookingReceipt modal component with overlay styling
- [x] Update BookingReceipt to handle null routeData and use selectedCar properties
- [x] Add cab image display in BookingReceipt to match the cab card image
- [x] Test the booking flow to ensure modal opens correctly

## Details
The booking section now requires user authentication before allowing bookings. When "Book Now" is clicked, it checks for a valid token and redirects to login if not authenticated. If authenticated, it opens a modal with the BookingReceipt component for completing the booking. The BookingReceipt component has been updated to handle cases where routeData is null and uses the selectedCar properties (Car, From, To, Seats, Luggage, Price) for display and booking payload.
