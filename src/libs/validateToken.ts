import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayload {
    _id: string;
    iat: number;
    exp: number;
}


export function validateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json('Access denied');
    try {
        const payload: IPayload = jwt.verify(token, process.env.TOKEN_SECRET || 'dfojifdvpoavoijer893u2opiuvew3de9cuidso') as IPayload;
        req.userId = payload._id;
        console.log(req.userId);
        next();
    } catch (error) {
        return res.status(401).json('Access denied');
    }
}