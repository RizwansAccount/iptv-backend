import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/dbConnection.js';
import userRouter from './src/routes/userRouter.js';
import genreRouter from './src/routes/genreRouter.js';
import fileRouter from './src/routes/fileRouter.js';
import seriesRouter from './src/routes/seriesRouter.js';
import genreSeriesRouter from './src/routes/genreSeriesRouter.js';
import seasonRouter from './src/routes/seasonRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

connectDB();

app.use('/user', userRouter);
app.use('/genre', genreRouter);
app.use('/file', fileRouter);
app.use('/series', seriesRouter);
app.use('/genre-series', genreSeriesRouter);
app.use('/season', seasonRouter);

app.listen(port, ()=> `app is running on port ${port}`)