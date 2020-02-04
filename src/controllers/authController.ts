import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import RefreshToken, { IRefreshToken } from '../models/refreshToken';
import { getTokenId, validateRefreshToken } from '../libs/tokenMethods';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { ILogin } from '../models/dtos/input/ILogin';
import { IUserData } from '../models/dtos/output/IUserData';
import { IRefreshRequest } from '../models/dtos/input/IRefreshRequest';


export async function signUp(req: Request, res: Response) {

    // Saving user
    const { username, email, password } = req.body;
    const user = new User({
        username: username,
        email: email,
        password: password,
    } as IUser);
    user.password = await user.encryptPassword(user.password);
    const userAux: IUser = await user.save();

    //JWT
    const token: string = jwt.sign({ _id: userAux._id }, process.env.TOKEN_SECRET || 'dfojifdvpoavoijer893u2opiuvew3de9cuidso', {
        expiresIn: 60 * 60
    });
    const refresh = new RefreshToken({
        refreshToken: uuid(),
        jwtId: getTokenId(token),
        active: true,
        userId: userAux._id
    } as IRefreshToken);
    const refreshAux: IRefreshToken = await refresh.save();

    return res.header('auth-token', token).header('refresh-token', refreshAux.refreshToken).json(userAux);
}


export async function signIn(req: Request, res: Response) {

    const loginData: ILogin = req.body['loginData'];

    const user = await User.findOne({ email: loginData.email });
    if (!user) return res.status(400).json('Email is wrong');

    const userAux: IUserData = {
        id: user._id,
        email: user.email,
        username: user.username
    }

    const correctPassword: boolean = await user.validatePassword(loginData.password);
    if (!correctPassword) return res.status(400).json('Invalid password');

    const token: string = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'dfojifdvpoavoijer893u2opiuvew3de9cuidso', {
        expiresIn: 15
    });
    const refresh = new RefreshToken({
        refreshToken: uuid(),
        jwtId: getTokenId(token),
        active: true,
        userId: user._id
    } as IRefreshToken);
    const refreshAux: IRefreshToken = await refresh.save();

    return res.header('Auth-Token', token).header('Refresh-Token', refreshAux.refreshToken).json(userAux);
}


export async function refresh(req: Request, res: Response) {

    const refreshToken: IRefreshRequest = req.body['refresh'];
    const refreshAux = await RefreshToken.findOne({ refreshToken: refreshToken.refreshToken });
    if (!refreshAux) return res.status(400).json('RefreshToken is wrong');

    if (validateRefreshToken(refreshToken.jwtToken, refreshAux)) {
        refreshAux.active = false;
        await refreshAux.save();

        const newToken: string = jwt.sign({ _id: refreshToken.userId }, process.env.TOKEN_SECRET || 'dfojifdvpoavoijer893u2opiuvew3de9cuidso', {
            expiresIn: 60 * 60
        });
        const newRefreshToken = new RefreshToken({
            refreshToken: uuid(),
            jwtId: getTokenId(newToken),
            active: true,
            userId: refreshToken.userId
        } as IRefreshToken);

        const newRefreshAux: IRefreshToken = await newRefreshToken.save();
        return res.header('auth-token', newToken).header('refresh-token', newRefreshAux.refreshToken).json('Ok');
    } else {
        return res.status(400).json('RefreshToken is wrong');
    }

}


export async function profile(req: Request, res: Response) {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json('Not user found');

    const userData: IUserData = {
        email: user.email,
        username: user.username,
        id: user._id
    }
    return res.json(userData);
}




