import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";
import {LoginResponseType} from "../../types/login-response.type";
import {SignupResponseType} from "../../types/signup-response.type";
import {ValidationType} from "../../types/validation.type";

export class Signup {
    private nameInput: HTMLInputElement | null = null;
    private lastNameInput: HTMLInputElement | null = null;
    private emailInput: HTMLInputElement | null = null;
    private passwordInput: HTMLInputElement | null = null;
    private repeatPasswordInput: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;
    readonly validations: ValidationType[];
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.findElements();
        this.validations = [
            {
                element: this.nameInput,
                options: {
                    pattern: /^[А-Я][а-я]+\s*$/
                }
            },
            {
                element: this.lastNameInput,
                options: {
                    pattern: /^[А-Я][а-я]+\s*$/
                }
            },
            {
                element: this.emailInput,
                options: {
                    pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                }
            },
            {
                element: this.passwordInput,
                options: {
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
                }
            },
            {
                element: this.repeatPasswordInput,
                options: {
                    compareTo: this.passwordInput?.value,
                }
            },
        ];

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        document.getElementById('process-button')?.addEventListener('click', this.signup.bind(this));
    }

    private findElements(): void {
        this.nameInput = document.getElementById('name') as HTMLInputElement;
        this.lastNameInput = document.getElementById('last-name') as HTMLInputElement;
        this.emailInput = document.getElementById('email') as HTMLInputElement;
        this.passwordInput = document.getElementById('password') as HTMLInputElement;
        this.repeatPasswordInput = document.getElementById('repeat-password') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error');
    }

    private async signup(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        for (let i: number = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.repeatPasswordInput) {
                this.validations[i].options!.compareTo = this.passwordInput?.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const signupResult: SignupResponseType | boolean = await AuthService.signUp({
                name: this.nameInput!.value,
                lastName: this.lastNameInput!.value,
                email: this.emailInput!.value,
                password: this.passwordInput!.value,
                passwordRepeat: this.repeatPasswordInput!.value,
            });

            if (signupResult) {
                const loginResult: LoginResponseType | boolean = await AuthService.logIn({
                    email: this.emailInput!.value,
                    password: this.passwordInput!.value,
                    rememberMe: false
                });

                if (loginResult) {
                    AuthUtils.setAuthInfo((loginResult as LoginResponseType).tokens.accessToken, (loginResult as LoginResponseType).tokens.refreshToken, {
                        id: (loginResult as LoginResponseType).user.id,
                        name: (loginResult as LoginResponseType).user.name,
                        lastName: (loginResult as LoginResponseType).user.lastName
                    });

                    return this.openNewRoute('/');
                }
            }

            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}