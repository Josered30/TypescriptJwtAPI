import jwt from 'jsonwebtoken';
import { IRefreshToken } from '../models/refreshToken';

interface IPayload {
    _id: string;
    iat: number;
    exp: number;
}

export function getTokenId(token: string) {
    try {
        const payload: IPayload = jwt.verify(token, process.env.TOKEN_SECRET || 'dfojifdvpoavoijer893u2opiuvew3de9cuidso') as IPayload;
        return payload._id;
    } catch(err){
        return null;
    }
}


export function validateRefreshToken(token: string, refresh: IRefreshToken){
    try {
        const payload: IPayload = jwt.verify(token, process.env.TOKEN_SECRET || 'dfojifdvpoavoijer893u2opiuvew3de9cuidso', {ignoreExpiration: true} ) as IPayload;
        return (refresh.jwtId == payload._id && refresh.active);
    } catch(err){
        return false;
    }
}

