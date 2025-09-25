import express, { Router, Request, Response } from 'express';
import cors from 'cors';
import userRouter from './router/user';
import sanphamRouter from './router/sanpham';
import loaisanphamRouter from './router/loaisanpham';
import nguyenlieuRouter from './router/nguyenlieu';

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
app.use(express.json()); 
app.use('/api/user', userRouter);
app.use('/api/sanpham',sanphamRouter)
app.use('/api/loaisanpham',loaisanphamRouter)
app.use('/api/nguyenlieu',nguyenlieuRouter)


app.listen(7000, () => console.log('Server running on port http://localhost:7000'));