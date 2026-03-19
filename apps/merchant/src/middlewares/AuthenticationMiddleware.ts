import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../helpers/JwtService';
import { AppError } from '../app/AppError';
import { UserService } from '../services/UserService';

// Authentication Middleware
const AuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        throw new AppError(401, 'unAuthorized action');
    }

    const jwtService = new JwtService();
    const { data } = jwtService.verify(token);

    if (!data?.id) {
        throw new AppError(401, 'unAuthorized action');
    }

    const userService = new UserService();
    const user = userService.getById(data?.id);

    if (!user) {
        throw new AppError(401, 'unAuthorized action');
    }

    next();
};

export default AuthenticationMiddleware;