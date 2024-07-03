import moment from "moment";
import {ValidationUtils} from "../../utils/validation-utils";
import {OperationsService} from "../../services/operations-service";
import {AuthUtils} from "../../utils/auth-utils";
import {OperationsEnum} from "../../types/operations.enum";
import {ValidationType} from "../../types/validation.type";
import {Period} from "../../types/period.enum";
import {OperationsParamsType} from "../../types/operations-params.type";
import {OperationsInfoType, OperationsResponseType} from "../../types/operations-response.type";

export class OperationsList {
    private calendarFromElement: HTMLInputElement | null = null;
    private linkFromElement: HTMLLinkElement | null = null;
    private calendarToElement: HTMLInputElement | null = null;
    private linkToElement: HTMLLinkElement | null = null;
    readonly validations: ValidationType[];
    private popupElement: HTMLElement | null = null;
    private confirmBtn: HTMLLinkElement | null = null;
    private cancelBtn: HTMLElement | null = null;
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            {element: this.calendarFromElement},
            {element: this.calendarToElement}
        ];

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.initCalendar();

        this.cancelBtn?.addEventListener('click', () => {
            this.popupElement?.classList.add("d-none");
        });

        this.getOperations({period: Period['today']}).then();
        this.initFilter();
    }

    private findElements(): void {
        this.calendarFromElement = document.getElementById("calendar-from") as HTMLInputElement;
        this.linkFromElement = document.getElementById('from') as HTMLLinkElement;
        this.popupElement = document.getElementById('delete-popup');
        this.confirmBtn = document.getElementById('confirm-delete') as HTMLLinkElement;
        this.cancelBtn = document.getElementById('cancel-delete');
        this.calendarToElement = document.getElementById("calendar-to") as HTMLInputElement;
        this.linkToElement = document.getElementById('to') as HTMLLinkElement;
    }

    private initCalendar(): void {
        if (this.calendarFromElement) {
            $(this.calendarFromElement).datetimepicker({
                format: 'L',
                locale: 'ru',
                useCurrent: false
            });

            if (this.linkFromElement) {
                this.linkFromElement.addEventListener('click', () => {
                    $(this.calendarFromElement!).datetimepicker('toggle');
                });


                $(this.calendarFromElement).on("change.datetimepicker", (e) => {
                    this.linkFromElement!.innerText = moment(e.date).format('DD-MM-YYYY');
                    $(this.calendarFromElement!).datetimepicker('hide');
                    if (this.calendarToElement) {
                        $(this.calendarToElement).datetimepicker('minDate', e.date);
                        if (ValidationUtils.validateForm(this.validations)) {
                            this.getOperations({
                                period: Period["interval"],
                                dateFrom: this.calendarFromElement!.value,
                                dateTo: this.calendarToElement!.value
                            }).then();
                        }
                    }
                });
            }
        }

        if (this.calendarToElement) {
            $(this.calendarToElement).datetimepicker({
                format: 'L',
                locale: 'ru',
                useCurrent: false
            });

            if (this.linkToElement) {
                this.linkToElement.addEventListener('click', () => {
                    $(this.calendarToElement!).datetimepicker('toggle');
                })

                $(this.calendarToElement).on("change.datetimepicker", (e) => {
                    this.linkToElement!.innerText = moment(e.date).format('DD-MM-YYYY');
                    $(this.calendarToElement!).datetimepicker('hide');
                    if (this.calendarFromElement) {
                        $(this.calendarFromElement).datetimepicker('maxDate', e.date);
                        if (ValidationUtils.validateForm(this.validations)) {
                            this.getOperations({
                                period: Period["interval"],
                                dateFrom: this.calendarFromElement!.value,
                                dateTo: this.calendarToElement!.value
                            }).then();
                        }
                    }
                });
            }
        }
    }

    private initFilter(): void {
        if (this.linkFromElement) {
            this.linkFromElement.disabled = true;
        }

        if (this.linkToElement) {
            this.linkToElement.disabled = true;
        }

        document.querySelectorAll('input[type="radio"][name="filter"]').forEach((radio: Element) => {
            radio.addEventListener('change', () => {
                if ((radio as HTMLInputElement).checked && radio.id === 'interval') {
                    if (this.linkFromElement) {
                        this.linkFromElement.disabled = false;
                    }
                    if (this.linkToElement) {
                        this.linkToElement.disabled = false;
                    }

                    if (ValidationUtils.validateForm(this.validations)) {
                        this.getOperations({
                            period: Period[radio.id],
                            dateFrom: this.calendarFromElement!.value,
                            dateTo: this.calendarToElement!.value
                        }).then();
                    }
                } else {
                    if (this.calendarFromElement) {
                        $(this.calendarFromElement).datetimepicker('hide');
                    }
                    if (this.calendarToElement) {
                        $(this.calendarToElement).datetimepicker('hide');
                    }
                    if (this.linkFromElement) {
                        this.linkFromElement.disabled = true;
                    }
                    if (this.linkToElement) {
                        this.linkToElement.disabled = true;
                    }

                    this.getOperations({period: Period[(radio.id) as Period]}).then();
                }
            });
        });
    }

    private async getOperations(params: OperationsParamsType): Promise<void> {
        const response: OperationsResponseType = await OperationsService.getOperations(params);
        if (response.error) {
            alert(response.error);
            response.redirect ? this.openNewRoute(response.redirect).then() : null;
            return;
        }

        this.showOperations(response.operations);
    }

    private showOperations(operations: OperationsInfoType[] | null): void {
        const table: HTMLElement | null = document.getElementById('records');
        if (table) {

            table.innerHTML = "";
            if (operations) {
                for (let i: number = 0; i < operations.length; i++) {
                    const trElement: HTMLElement = document.createElement('tr');

                    const thElement: HTMLTableCellElement = document.createElement('th');
                    thElement.scope = 'row';
                    thElement.innerText = (i + 1).toString();

                    const typeOperation: HTMLElement = document.createElement('td');
                    typeOperation.className = operations[i].type === OperationsEnum.income ? 'text-success' : 'text-danger';
                    typeOperation.innerText = operations[i].type === OperationsEnum.income ? 'доход' : 'расход';

                    const categoryElement: HTMLElement = document.createElement('td');
                    categoryElement.innerText = operations[i].category;

                    const amountElement: HTMLElement = document.createElement('td');
                    amountElement.innerText = operations[i].amount + '$';

                    const dateElement: HTMLElement = document.createElement('td');
                    dateElement.innerText = new Date(operations[i].date).toLocaleDateString();

                    trElement.appendChild(thElement);
                    trElement.appendChild(typeOperation);
                    trElement.appendChild(categoryElement);
                    trElement.appendChild(amountElement);
                    trElement.appendChild(dateElement);

                    const commentElement: HTMLElement = document.createElement('td');
                    commentElement.innerText = operations[i].comment ? operations[i].comment : '';
                    trElement.appendChild(commentElement);

                    const tdElement: HTMLElement = document.createElement('td');

                    const tools: HTMLElement = document.createElement('div');
                    tools.className = 'operations-tools';

                    const linkDelete: HTMLAnchorElement = document.createElement('a');
                    linkDelete.style.cursor = 'pointer';
                    linkDelete.addEventListener('click', () => {
                        this.popupElement?.classList.remove('d-none');
                        this.deleteOperation(operations[i].id.toString());
                    });

                    const imageTrash: HTMLImageElement = document.createElement('img');
                    imageTrash.src = '/img/trash.svg';
                    linkDelete.appendChild(imageTrash);

                    const linkEdit: HTMLAnchorElement = document.createElement('a');
                    linkEdit.href = '/operations/edit?id=' + operations[i].id;

                    const imagePen: HTMLImageElement = document.createElement('img');
                    imagePen.src = '/img/pen.svg';
                    linkEdit.appendChild(imagePen);

                    tools.appendChild(linkDelete);
                    tools.appendChild(linkEdit);
                    tdElement.appendChild(tools);
                    trElement.appendChild(tdElement);
                    table.appendChild(trElement);
                }
            }
        }
    }

    private deleteOperation(id: string): void {
        if (this.confirmBtn) {
            this.confirmBtn.href = '/operations/delete?id=' + id;
        }
    }
}