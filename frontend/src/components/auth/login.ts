import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";
import {LoginResponseType} from "../../types/login-response.type";
import {ValidationType} from "../../types/validation.type";

export class Login {
    private emailInput: HTMLInputElement | null = null;
    private passwordInput: HTMLInputElement | null = null;
    private rememberMeCheckbox: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;
    readonly validations: ValidationType[];
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.findElements();
        this.validations = [
            {element: this.passwordInput},
            {
                element: this.emailInput,
                options: {
                    pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                }
            }
        ];

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        document.getElementById('process-button')?.addEventListener('click', this.login.bind(this));
    }

    private findElements(): void {
        this.emailInput = document.getElementById('email') as HTMLInputElement;
        this.passwordInput = document.getElementById('password') as HTMLInputElement;
        this.rememberMeCheckbox = document.getElementById('remember-me') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error');
    }

    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (ValidationUtils.validateForm(this.validations) && this.rememberMeCheckbox) {
            const loginResult: LoginResponseType | boolean = await AuthService.logIn({
                email: this.emailInput!.value,
                password: this.passwordInput!.value,
                rememberMe: this.rememberMeCheckbox.checked
            });

            if (loginResult) {
                AuthUtils.setAuthInfo((loginResult as LoginResponseType).tokens.accessToken, (loginResult as LoginResponseType).tokens.refreshToken, {
                    id: (loginResult as LoginResponseType).user.id,
                    name: (loginResult as LoginResponseType).user.name,
                    lastName: (loginResult as LoginResponseType).user.lastName
                });

                return this.openNewRoute('/');
            }

            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}