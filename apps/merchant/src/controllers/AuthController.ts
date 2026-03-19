import type { Request, Response } from "express";
import { AppError } from "../app/AppError";
import { HashingService } from "../helpers/HashingService";
import { JwtService } from "../helpers/JwtService";
import { LoginData } from "../types/AuthUser";
import { UserService } from "../services/UserService";

export class AuthController {
    constructor(
        private readonly userService: UserService = new UserService(),
        private readonly secretService: HashingService = new HashingService(),
        private readonly jwtService: JwtService = new JwtService()
    ) { }

    async login(req: Request, res: Response): Promise<void> {
        const payload: LoginData = req?.body;
        // must use middleware for validating the body later
        // I recomment <class-validator>
        if (!payload.email || !payload.password) {
            throw new AppError(400, "Missing credentials");
        }
        // find the user by email
        const user = this.userService.getByEmail(payload.email);
        // compare the password (check user Authentication)
        const isAuthed = await this.secretService.compare(payload.password, user.password);
        if (!isAuthed) {
            throw new AppError(401, "creds are not correct");
        }

        // if authenticated, generate jwt token
        const token = this.jwtService.sign({ id: user.id });
        res.status(200).json({
            message: 'user logged in successfully',
            token,
        });
    }

    // implement the rest of methods later...

}
