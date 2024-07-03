import {UrlUtils} from "../../utils/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {CategoryType} from "../../types/categories-response.type";

export class ExpenseDelete {
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

        this.deleteCategory(id).then();
    }

    private async deleteCategory(id: string): Promise<void> {
        const response: CategoryType = await ExpenseService.deleteCategory(id);

        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        return this.openNewRoute('/expense');
    }
}