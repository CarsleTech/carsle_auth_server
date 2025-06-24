import express, { Request, Response } from 'express';
import cors from 'cors';
import healthRoute from "./routers/health"
import authRoute from "./routers/auth";

const app = express();


app.use(cors());
app.use(express.json());

app.use('/health', healthRoute);
app.use('/api/auth',authRoute)


export default app;