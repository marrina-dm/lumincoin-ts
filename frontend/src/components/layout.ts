import {AuthUtils} from "../utils/auth-utils";
import {BalanceService} from "../services/balance-service";
import {ValidationUtils} from "../utils/validation-utils";
import {BalanceResponseType} from "../types/balance-response.type";
import {ValidationType} from "../types/validation.type";

export class Layout {
    private balanceElement: HTMLElement | null = null;
    private balancePopupElement: HTMLElement | null = null;
    private balanceInput: HTMLInputElement | null = null;
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.findElements();

        this.getBalance().then();


        if (this.balanceElement) {
            this.balanceElement.addEventListener("click", () => {
                if (this.balancePopupElement) {
                    this.balancePopupElement.classList.remove("d-none");
                }
            });
        }

        const confirmButton: HTMLElement | null = document.getElementById('confirm');
        const cancelButton: HTMLElement | null = document.getElementById('cancel');
        if (confirmButton) {
            confirmButton.addEventListener('click', this.updateBalance.bind(this));
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                if (this.balancePopupElement) {
                    this.balancePopupElement.classList.add("d-none");
                }
                if (this.balanceInput) {
                    this.balanceInput.classList.remove('is-invalid');
                }
            });
        }
    }

    private findElements(): void {
        this.balanceElement = document.getElementById("balance");
        this.balancePopupElement = document.getElementById("balance-popup");
        this.balanceInput = document.getElementById("balanceInput") as HTMLInputElement;
    }

    private async getBalance(): Promise<void> {
        const response: BalanceResponseType = await BalanceService.getBalance();
        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect) : null;
            return;
        }

        this.showBalance(response.balance);
    }

    private async updateBalance(): Promise<void> {
        const validations: ValidationType[] = [
            {element: this.balanceInput}
        ];

        if (ValidationUtils.validateForm(validations)) {
            const response: BalanceResponseType = await BalanceService.updateBalance({
                newBalance: Number(this.balanceInput!.value)
            });

            if (response.error) {
                alert(response.error);
                response.redirect ? this.openNewRoute(response.redirect) : null;
                return;
            }

            this.showBalance(response.balance);
            this.balancePopupElement?.classList.add("d-none");
        }
    }

    private showBalance(balance: number | null): void {
        if (this.balanceElement && balance) {
            this.balanceElement.innerText = balance + '$';
        }
    }
}