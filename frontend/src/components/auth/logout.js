import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Logout {
    openNewRoute = null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout() {
        await AuthService.logout({
            refreshToken: AuthUtils.refreshTokenKey
        });

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}