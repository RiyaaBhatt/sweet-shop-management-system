// src/app.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
// import sweetRoutes from './routes/sweet.routes'; // later
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use('/api/auth', authRoutes);
// app.use('/api/sweets', sweetRoutes);

export default app;
