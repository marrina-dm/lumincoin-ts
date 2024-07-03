import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Logout {
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.logout().then();
    }

    private async logout(): Promise<void> {
        await AuthService.logout({
            refreshToken: AuthUtils.refreshTokenKey
        });

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login').then();
    }
}