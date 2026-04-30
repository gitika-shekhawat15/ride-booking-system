import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';
import userRouter from './routes/user.routes.js';
import driverRouter from './routes/driver.routes.js';
import rideRouter from './routes/ride.routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://ride-booking-system-topaz.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use("/users", userRouter);
app.use("/drivers", driverRouter);
app.use("/rides", rideRouter);



app.get('/', (req, res)=> {
    res.send('Hello World!');
});

app.use(errorHandler);




export default app;