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

app.use(cors({
  origin: process.env.CLIENT_URL,
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