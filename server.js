import express from 'express';
import userRoutes from './routes/user.js';
import restaurantRoutes from './routes/restaurant.js';

import mongoose from "mongoose";
import { errorHandler, notFoundError } from './middlewares/error-handler.js';
import morgan from 'morgan';
import cors from "cors";
import {} from 'dotenv/config'

const app = express();

const hostname = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;
const databaseName = process.env.DB_NAME;
const databaseURL = process.env.DB_URL;

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose
.connect(`mongodb://${databaseURL}/${databaseName}`)
.then(() => {
    console.log(`connected to ${databaseName}`);
})
.catch((err) => {
    console.log(err);
});

app.use(cors());
app.use(morgan("dev")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img",express.static("public/images"));

app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);

//error middlewares
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});
