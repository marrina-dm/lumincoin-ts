import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";
import {ValidationType} from "../../types/validation.type";
import {CategoriesResponseType} from "../../types/categories-response.type";
import {OperationType} from "../../types/operations-response.type";
import {OperationsEnum} from "../../types/operations.enum";

export class OperationsCreate {
    private typeSelect: HTMLInputElement | null = null;
    private categorySelect: HTMLInputElement | null = null;
    private amountInput: HTMLInputElement | null = null;
    private dateInput: HTMLInputElement | null = null;
    private commentInput: HTMLInputElement | null = null;
    readonly validations: ValidationType[];
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.findElements();
        this.validations = [
            {element: this.categorySelect},
            {element: this.amountInput},
            {element: this.dateInput}
        ];

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        const type: string | null = UrlUtils.getUrlParam('type');
        if (!type) {
            this.openNewRoute('/').then();
            return;
        }

        if (this.typeSelect) {
            this.typeSelect.value = type;
            this.typeSelect.addEventListener('change', (e: Event) => this.getCategories((e.target as HTMLInputElement).value));
        }

        this.getCategories(type).then();

        if (this.dateInput) {
            this.dateInput.max = new Date().toISOString().split('T')[0];
        }

        document.getElementById('saveButton')?.addEventListener('click', this.saveOperation.bind(this));
    }

    private findElements(): void {
        this.typeSelect = document.getElementById('typeSelect') as HTMLInputElement;
        this.categorySelect = document.getElementById('categorySelect') as HTMLInputElement;
        this.amountInput = document.getElementById('amountInput') as HTMLInputElement;
        this.dateInput = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInput = document.getElementById('commentInput') as HTMLInputElement;
    }

    private async getCategories(type: string): Promise<void> {
        const response: CategoriesResponseType = type === 'income' ? await IncomeService.getCategories() : await ExpenseService.getCategories();
        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        if (this.categorySelect) {
            this.categorySelect.innerHTML = '';
            const disableOption: HTMLOptionElement = document.createElement("option");
            disableOption.disabled = true;
            disableOption.selected = true;
            disableOption.innerText = 'Категория...';
            disableOption.value = '';
            this.categorySelect.appendChild(disableOption);


            if (response.categories) {
                for (let i: number = 0; i < response.categories.length; i++) {
                    const option: HTMLOptionElement = document.createElement("option");
                    option.value = response.categories[i].id.toString();
                    option.innerText = response.categories[i].title;

                    this.categorySelect.appendChild(option);
                }
            }
        }
    }

    private async saveOperation(): Promise<void> {
        if (ValidationUtils.validateForm(this.validations)) {
            const response: OperationType = await OperationsService.createOperation({
                type: OperationsEnum[this.typeSelect!.value as OperationsEnum],
                amount: +this.amountInput!.value,
                date: this.dateInput!.value,
                comment: this.commentInput?.value ? this.commentInput!.value : ' ',
                category_id: parseInt(this.categorySelect!.value)
            });

            if (response.error) {
                alert(response.error);
                response.redirect ? this.openNewRoute(response.redirect).then() : null;
                return;
            }

            return this.openNewRoute('/operations');
        }
    }
}