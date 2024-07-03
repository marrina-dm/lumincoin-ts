import {HttpUtils} from "../utils/http-utils";
import {LoginBodyType} from "../types/login-body.type";
import {LoginResponseType} from "../types/login-response.type";
import {Methods} from "../types/methods.enum";
import {ResultRequestType} from "../types/result-request.type";
import {SignupBodyType} from "../types/signup-body.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LogoutBodyType} from "../types/logout-body.type";

export class AuthService {
    public static async logIn(data: LoginBodyType): Promise<LoginResponseType | boolean> {
        const result: ResultRequestType = await HttpUtils.request('/login', Methods.post, false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }

    public static async signUp(data: SignupBodyType): Promise<SignupResponseType | boolean> {
        const result: ResultRequestType = await HttpUtils.request('/signup', Methods.post, false, data);

        if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName || !result.response.user.email))) {
            return false;
        }

        return result.response;
    }

    public static async logout(data: LogoutBodyType): Promise<void> {
        await HttpUtils.request('/logout', Methods.post, false, data);
    }
}