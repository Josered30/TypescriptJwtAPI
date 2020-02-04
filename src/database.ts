import mongoose from 'mongoose';
import { connect } from 'mongoose';

export async function startConnection() {
    await connect(process.env.MONGODB_URI|| 'mongodb://localhost/jwt-api',{
        useNewUrlParser: true,
        useFindAndModify: false
    });
    console.log('Database is connected');
}