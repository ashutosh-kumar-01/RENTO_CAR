import { json } from "express";
import User from "../models/User.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";


// Api to Change Role to User
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "Now you can list cars" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Api to list Car

export const addCar = async (req, res) => {
    try {
        const {_id } = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Image is required" });
        }

        // Upload Image to Imagekit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer, //required
            fileName: imageFile.originalname, //required
            folder: "/cars" //optional
        })


        // optimization through imageKit URL transformation
        var optimizationImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width : '1280'}, //width resizing
                {quality : 'auto'},  //Auto compression
                {format : 'webp'} //convert to modern format
            ]
        });

        const image = optimizationImageUrl;
        await Car.create({...car, image, owner: _id});

        res.json({ success: true, message: "Car Added" });


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Api to List Owner Cars

export const getOwnerCars = async (req, res) => {
    try {
        const {_id } = req.user;
        const cars = await Car.find({ owner: _id });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Api to Toggle Car Availability

export const toggleCarAvailability = async (req, res) => {
     try {
        const {_id } = req.user;
        const {carId }= req.body
        const car = await Car.findById(carId);

        // checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        res.json({ success: true, message: "Availability Toggled" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Api to delete a Car
export const deleteCar = async (req, res) => {
     try {
        const {_id } = req.user;
        const {carId }= req.body
        const car = await Car.findById(carId);

        // checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.owner = null;
        car.isAvailable = false;

        await car.save();

        res.json({ success: true, message: "Car Removed" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Api to get  Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const {_id, role } = req.user;
        
        if(role !== "owner"){
            return res.json({ success: false, message: "Unauthorized. Owner access required." });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate("car").sort({createdAt: -1});

        const pendingBookings = bookings.filter(b => b.status === "pending");
        const confirmedBookings = bookings.filter(b => b.status === "confirmed");
        const cancelledBookings = bookings.filter(b => b.status === "cancelled");

        // Calculate monthly revenue from confirmed bookings in current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyRevenue = bookings
            .filter(booking => booking.status === "confirmed" && new Date(booking.createdAt) >= startOfMonth)
            .reduce((acc, booking) => acc + booking.price, 0);

        // Calculate total revenue (all time)
        const totalRevenue = bookings
            .filter(booking => booking.status === "confirmed")
            .reduce((acc, booking) => acc + booking.price, 0);

        // Calculate availability rate
        const availableCars = cars.filter(c => c.isAvailable).length;
        const availabilityRate = cars.length > 0 ? Math.round((availableCars / cars.length) * 100) : 0;

        // Get recent bookings with user info
        const recentBookings = await Booking.find({ owner: _id })
            .populate("car")
            .populate("user", "name email")
            .sort({createdAt: -1})
            .limit(5);

        const dashboardData = {
            totalCars: cars.length,
            availableCars,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            confirmedBookings: confirmedBookings.length,
            cancelledBookings: cancelledBookings.length,
            recentBookings,
            monthlyRevenue,
            totalRevenue,
            availabilityRate
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Api to update user image / profile

export const updateUserImage = async (req, res) => {
    try {
        const {_id } = req.user;
        
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Image is required" });
        }

        // Upload Image to Imagekit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/users"
        });

        // optimization through imageKit URL transformation
        const optimizationImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {width: '400'},
                {quality: 'auto'},
                {format: 'webp'}
            ]
        });

        const image = optimizationImageUrl;

        await User.findByIdAndUpdate(_id, {image});

        // Clean up temp file
        fs.unlinkSync(imageFile.path);

        res.json({ success: true, message: "Profile image updated" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}