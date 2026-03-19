import { sign, verify } from 'jsonwebtoken';
import { AppError } from "../app/AppError";
import { UserData } from '../types/AuthUser';

// jsonwebtoken here wrapped in a separated service to be easy to replace it at any time
export class JwtService {
    sign(userData: UserData, expTime: number = 3600): string {
        try {
            // not recommended to share the secrets inside the code
            const secret = process.env.JWT_SECRET || 'QFArVCmH12eySFzoSboXRNnGH4EWFrCMmNv0W8XHDln';
            return sign({
                exp: Math.floor(Date.now() / 1000) + expTime,
                data: userData,
            }, secret, { expiresIn: expTime });
        } catch (error) {
            throw new AppError(400, "Failed to sign jwt token");
        }
    }

    verify(token: string): any {
        try {
            // not recommended to share the secrets inside the code
            const secret = process.env.JWT_SECRET || 'QFArVCmH12eySFzoSboXRNnGH4EWFrCMmNv0W8XHDln';
            return verify(token, secret);
        } catch (error) {
            throw new AppError(401, "Unauthorized action");
        }
    }
}