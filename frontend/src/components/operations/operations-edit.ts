import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {OperationsService} from "../../services/operations-service";
import {ValidationType} from "../../types/validation.type";
import {OperationResponseType, OperationsInfoType, OperationType} from "../../types/operations-response.type";
import {CategoriesResponseType} from "../../types/categories-response.type";
import {OperationsEnum} from "../../types/operations.enum";
import {OperationBodyType} from "../../types/operation-body.type";

export class OperationsEdit {
    private typeSelect: HTMLInputElement | null = null;
    private categorySelect: HTMLInputElement | null = null;
    private amountInput: HTMLInputElement | null = null;
    private dateInput: HTMLInputElement | null = null;
    private commentInput: HTMLInputElement | null = null;
    readonly validations: ValidationType[];
    private operationOriginalData: OperationsInfoType | null = null;
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

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

        if (this.dateInput) {
            this.dateInput.max = new Date().toISOString().split('T')[0];
        }

        this.init(id).then();

        this.typeSelect?.addEventListener('change', (e: Event) => this.getCategories((e.target as HTMLInputElement).value));

        document.getElementById('saveButton')?.addEventListener('click', this.updateOperation.bind(this));
    }

    private findElements(): void {
        this.typeSelect = document.getElementById('typeSelect') as HTMLInputElement;
        this.categorySelect = document.getElementById('categorySelect') as HTMLInputElement;
        this.amountInput = document.getElementById('amountInput') as HTMLInputElement;
        this.dateInput = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInput = document.getElementById('commentInput') as HTMLInputElement;
    }

    private async init(id: string): Promise<void> {
        const operationData: OperationsInfoType | null | void = await this.getOperation(id);
        if (operationData) {
            this.showRecords(operationData);

            if (operationData.type) {
                await this.getCategories(operationData.type, operationData.category);
            }
        }
    }

    private async getOperation(id: string): Promise<OperationsInfoType | null | void> {
        const response: OperationResponseType = await OperationsService.getOperation(id);

        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        this.operationOriginalData = response.operation;
        return response.operation;
    }

    private showRecords(data: OperationsInfoType): void {
        if (this.amountInput) {
            this.amountInput.value = data.amount.toString();
        }

        if (this.commentInput) {
            this.commentInput.value = data.comment;
        }

        if (this.dateInput) {
            this.dateInput.value = data.date;
        }

        this.typeSelect!.value = data.type;
    }

    private async getCategories(type: string, category?: string): Promise<void> {
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
                    const option: HTMLOptionElement= document.createElement("option");
                    option.value = response.categories[i].id.toString();
                    option.innerText = response.categories[i].title;
                    if (category === response.categories[i].title) {
                        option.selected = true;
                    }

                    this.categorySelect.appendChild(option);
                }
            }
        }
    }

    private async updateOperation(e: Event): Promise<void> {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData: OperationBodyType = {
                amount: parseInt(this.amountInput!.value),
                type: OperationsEnum[this.typeSelect!.value as OperationsEnum],
                category_id: parseInt(this.categorySelect!.value),
                date: this.dateInput!.value,
                comment: this.commentInput!.value
            };

            if (Object.keys(changedData).length > 0) {
                const response: OperationType = await OperationsService.updateOperation(this.operationOriginalData!.id.toString(), changedData);

                if (response.error) {
                    alert(response.error);
                    response.redirect ? this.openNewRoute(response.redirect).then() : null;
                    return;
                }

                return this.openNewRoute('/operations');
            }
        }
    }
}