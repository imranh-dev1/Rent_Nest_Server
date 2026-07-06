import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { authRoute } from './modules/auth/auth.route';
import cookieParser from 'cookie-parser';


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

export default app;