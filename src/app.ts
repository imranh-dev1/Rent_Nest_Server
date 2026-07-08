import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { authRoute } from './modules/auth/auth.route';
import cookieParser from 'cookie-parser';
import { categoryRoute } from './modules/category/category.route';
import { notFound } from './middlewares/notFound';
import { globalErrorHandler } from './errors/globalErrorHandler';
import { propertyRoute } from './modules/property/property.route';
import { rentalRequestsRoute } from './modules/rental/rental.route';

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
    res.send("Rent_Nest API is running, visit/health for status.");
});

app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/rental-requests", rentalRequestsRoute);


app.use(notFound);
app.use(globalErrorHandler);

export default app;