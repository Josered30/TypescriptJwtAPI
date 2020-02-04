import { Schema, Document, model } from 'mongoose';

const schema = new Schema({
    refreshToken: String,
    jwtId: String,
    active: Boolean,
    userId: String
});


export interface IRefreshToken extends Document {
    refreshToken: string;
    jwtId: string;
    active: boolean;
    userId:string;
}

export default model<IRefreshToken>('RefreshToken', schema);


