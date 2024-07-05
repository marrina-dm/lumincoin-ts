import {UrlUtils} from "../../utils/url-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {ExpenseService} from "../../services/expense-service";
import {AuthUtils} from "../../utils/auth-utils";
import {ValidationType} from "../../types/validation.type";
import {CategoriesInfoType, CategoryResponseType, CategoryType} from "../../types/categories-response.type";

export class ExpenseEdit {
    readonly nameInput: HTMLInputElement | null;
    readonly validations: ValidationType[];
    readonly openNewRoute: (url: string) => Promise<void>;
    private categoryOriginalData: CategoriesInfoType | null = null;

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

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

        document.getElementById('saveButton')?.addEventListener('click', this.updateCategory.bind(this));

        this.showCategory(id).then();
    }

    private async showCategory(id: string): Promise<void> {
        const categoryData: CategoriesInfoType | void | null = await this.getCategory(id);
        if (categoryData && this.nameInput) {
            this.nameInput.value = categoryData.title;
        }
    }

    private async getCategory(id: string): Promise<CategoriesInfoType | void | null> {
        const response: CategoryResponseType = await ExpenseService.getCategory(id);

        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        this.categoryOriginalData = response.category;
        return response.category;
    }

    private async updateCategory(e: Event): Promise<void> {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            if (this.nameInput!.value !== this.categoryOriginalData!.title) {
                const response: CategoryType = await ExpenseService.updateCategory(this.categoryOriginalData!.id.toString(), {title: this.nameInput!.value});

                if (response.error) {
                    alert(response.error);
                    response.redirect ? this.openNewRoute(response.redirect).then() : null;
                    return;
                }
            }
            return this.openNewRoute('/expense');
        }
    }
}