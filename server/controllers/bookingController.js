import Booking from "../models/Booking.js"
import Car from "../models/Car.js"



// Function to Check Availability to Car for a given Date



const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({ 
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
     });
     return bookings.length === 0;
}



// Api to check availability of car for a given date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const {location, pickupDate, returnDate} = req.body;

        // Fetching all available cars for the given location
        const cars = await Car.find({location}); 

        // check car availability for the given date range using promise

        const availableCarsPromise = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
            return {...car._doc, isAvailable: isAvailable}
        });

        let availableCars = await Promise.all(availableCarsPromise);
        availableCars = availableCars.filter(car => car.isAvailable === true);


        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Api to create Booking
export const createBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"})
        }

        const carData = await Car.findById(car);
        // calculate price based on pickup and return date
        const pickup = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.max(1, Math.ceil((returned - pickup) / (1000 * 60 * 60 * 24)));
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

        res.json({success: true, message: "Booking created"})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Api to list user bookings

export const getUserBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user: _id}).populate("car").sort({createdAt: -1});

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to get Owner Bookings

export const getOwnerBookings = async (req, res) => {
    try {
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: "Unauthorized"})
        }

        const bookings  = await Booking.find({owner: req.user._id}).populate("car user").select("-user.password").sort({createdAt: -1});

        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to change booking status

export const changeBookingStatus = async (req, res) => {
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body;
        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({success: true, message: "Status Updated"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to clear all user bookings (delete booking history)

export const clearAllBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const result = await Booking.deleteMany({user: _id});

        res.json({success: true, message: `Cleared ${result.deletedCount} booking(s) from history`})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to cancel booking by user

export const cancelBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const {bookingId} = req.body;
        const booking = await Booking.findById(bookingId)

        if(!booking){
            return res.json({success: false, message: "Booking not found"})
        }

        if(booking.user.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }

        if(booking.status === 'cancelled'){
            return res.json({success: false, message: "Booking is already cancelled"})
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({success: true, message: "Booking cancelled successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
