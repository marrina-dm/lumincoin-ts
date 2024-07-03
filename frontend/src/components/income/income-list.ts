import {IncomeService} from "../../services/income-service";
import {AuthUtils} from "../../utils/auth-utils";
import {CategoriesInfoType, CategoriesResponseType} from "../../types/categories-response.type";

export class IncomeList {
    private addElementBtn: HTMLElement | null = null;
    private rowElement: HTMLElement | null = null;
    private popupElement: HTMLElement | null = null;
    private confirmBtn: HTMLLinkElement | null = null;
    private cancelBtn: HTMLElement | null = null;
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.findElements();

        this.cancelBtn?.addEventListener('click', () => {
            this.popupElement?.classList.add("d-none");
        });

        this.getCategoriesIncome().then();
    }

    private findElements(): void {
        this.addElementBtn = document.getElementById('addCategory');
        this.rowElement = document.getElementById('categories-list');
        this.popupElement = document.getElementById('delete-popup');
        this.confirmBtn = document.getElementById('confirm-delete') as HTMLLinkElement;
        this.cancelBtn = document.getElementById('cancel-delete');
    }

    private async getCategoriesIncome(): Promise<void> {
        const response: CategoriesResponseType = await IncomeService.getCategories();
        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        this.showCategories(response.categories);
    }

    private showCategories(categories: CategoriesInfoType[] | null): void {
        if (categories && categories.length > 0) {
            for (let i: number = 0; i < categories.length; i++) {
                const colBlock: HTMLElement = document.createElement('div');
                colBlock.classList.add('col');

                const cardBlock: HTMLElement = document.createElement('div');
                cardBlock.className = 'card p-3 h-100 border';

                const cardBodyBlock: HTMLElement = document.createElement('div');
                cardBodyBlock.className = 'card-body p-0';

                const nameCategory: HTMLElement = document.createElement('h3');
                nameCategory.className = 'text-primary-emphasis mb-3';
                nameCategory.innerText = categories[i].title;

                const editLink: HTMLAnchorElement = document.createElement('a');
                editLink.className = 'btn btn-primary me-2 mb-2 fw-medium text-small edit-link';
                editLink.href = '/income/edit?id=' + categories[i].id;
                editLink.innerText = 'Редактировать';

                const deleteLink: HTMLAnchorElement = document.createElement('a');
                deleteLink.className = 'btn btn-danger fw-medium mb-2 text-small delete-link';
                deleteLink.innerText = 'Удалить';
                deleteLink.addEventListener('click', () => {
                    this.popupElement?.classList.remove('d-none');
                    this.deleteCategory(categories[i].id.toString());
                });

                cardBodyBlock.appendChild(nameCategory);
                cardBodyBlock.appendChild(editLink);
                cardBodyBlock.appendChild(deleteLink);
                cardBlock.appendChild(cardBodyBlock);
                colBlock.appendChild(cardBlock);

                this.rowElement?.insertBefore(colBlock, this.addElementBtn);
            }
        }
    }

    private deleteCategory(id: string): void {
        if (this.confirmBtn) {
            this.confirmBtn.href = '/income/delete?id=' + id;
        }
    }
}