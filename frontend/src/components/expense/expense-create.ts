import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {AuthUtils} from "../../utils/auth-utils";
import {ValidationType} from "../../types/validation.type";
import {CategoryType} from "../../types/categories-response.type";

export class ExpenseCreate {
    readonly nameInput: HTMLInputElement | null;
    readonly validations: ValidationType[];
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.nameInput = document.getElementById('nameInput') as HTMLInputElement;
        this.validations = [
            {element: this.nameInput}
        ];

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        document.getElementById('saveButton')?.addEventListener('click', this.saveCategory.bind(this));
    }

    private async saveCategory(): Promise<void> {
        if (ValidationUtils.validateForm(this.validations)) {
            const response: CategoryType = await ExpenseService.createCategory({title: this.nameInput!.value});

            if (response.error) {
                alert(response.error);
                response.redirect ? this.openNewRoute(response.redirect).then() : null;
                return;
            }

            return this.openNewRoute('/expense');
        }
    }
}