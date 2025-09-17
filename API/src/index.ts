import express, { Router, Request, Response } from 'express';
import cors from 'cors';
import userRouter from './router/user';
import giaovienRouter from './router/giaovien';

const app = express();
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:3000',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/user', userRouter);
app.use('/api/giaovien', giaovienRouter);


app.listen(7000, () => console.log('Server running on port 7000'));