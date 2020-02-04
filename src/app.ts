import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app = express();

import authRoutes from './routes/auth';


// settings
app.set('port', process.env.PORT || 4000);



// midlewares
app.use(morgan('dev'));

const corsOptions = {
    exposedHeaders: ['Content-Range', 'X-Content-Range','Auth-Token','Refresh-Token']
};
app.use(cors(corsOptions));


app.use(express.json());

//routes
app.use('/api/auth', authRoutes);


export default app;