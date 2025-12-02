import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingsRouter from './routes/bookingRoutes.js';


// Initialize express app

const app = express()

// Connect to database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Server is running...'))
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/booking', bookingsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


