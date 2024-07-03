import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {CategoryType} from "../../types/categories-response.type";

export class IncomeDelete {
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
        const response: CategoryType = await IncomeService.deleteCategory(id);

        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        return this.openNewRoute('/income');
    }
}