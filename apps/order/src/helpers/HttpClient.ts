import { post } from 'axios';
import { AppError } from "../app/AppError";

// axios here wrapped in a separated service to be easy to replace it at any time
export class HttpClient {
    async post(api: string, payload: object): Promise<any> {
        try {
           return post()
        } catch (error) {
            throw new AppError(400, "Failed to generate encryption");
        }
    }

    async get(url: string): Promise<any> {
        try {
           return hash(value, salt);
        } catch (error) {
            throw new AppError(400, "Failed to generate encryption");
        }
    }
}