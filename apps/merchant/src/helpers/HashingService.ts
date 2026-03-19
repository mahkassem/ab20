import { hash, compare } from 'bcrypt';
import { AppError } from "../app/AppError";

// bcrypt here wrapped in a separated service to be easy to replace it at any time
export class HashingService {
    async hash(value: string, salt: number = 10): Promise<string> {
        try {
           return hash(value, salt);
        } catch (error) {
            throw new AppError(400, "Failed to generate encryption");
        }
    }

    async compare(original: string, encrypted: string): Promise<boolean> {
        try {
            return compare(original, encrypted);
        } catch (error) {
            throw new AppError(400, "Failed to compare the data");
        }
    }
}