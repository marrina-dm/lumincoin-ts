import config from "../config/config";
import {UserInfoType} from "../types/auth.type";
import {RefreshResponseType} from "../types/refresh-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {Methods} from "../types/methods.enum";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoTokenKey: string = 'userInfo';

    public static getAuthInfo(key: string | null): string | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        }
        return null;
    }

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo?: UserInfoType): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: Methods.post,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });

            if (response && response.status === 200) {
                const tokens: DefaultResponseType | RefreshResponseType | Error = await response.json();
                if ((tokens as RefreshResponseType).tokens && !(tokens as DefaultResponseType).error && !(tokens instanceof Error)) {
                    this.setAuthInfo((tokens as RefreshResponseType).tokens.accessToken, (tokens as RefreshResponseType).tokens.refreshToken);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}