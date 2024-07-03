import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-service";
import {OperationType} from "../../types/operations-response.type";

export class OperationsDelete {
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

        this.deleteOperation(id).then();
    }

    private async deleteOperation(id: string): Promise<void> {
        const response: OperationType = await OperationsService.deleteOperation(id);

        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        return this.openNewRoute('/operations');
    }
}