import express from "express";
import { changeBookingStatus, checkAvailabilityOfCar, getUserBookings, createBooking, getOwnerBookings, cancelBooking, clearAllBookings } from "../controllers/bookingController.js"; 
import { protect } from "../middleware/auth.js";

const bookingsRouter = express.Router();

bookingsRouter.post("/check-availability", checkAvailabilityOfCar);
bookingsRouter.post("/create", protect, createBooking);
bookingsRouter.get("/user", protect, getUserBookings);
bookingsRouter.get("/owner", protect, getOwnerBookings);
bookingsRouter.post("/change-status", protect, changeBookingStatus);
bookingsRouter.post("/cancel", protect, cancelBooking);
bookingsRouter.delete("/clear-all", protect, clearAllBookings);

export default bookingsRouter;
