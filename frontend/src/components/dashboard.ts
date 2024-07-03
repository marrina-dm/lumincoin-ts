import {Chart, PieController, ArcElement, Legend, Colors, Tooltip} from "chart.js";
import {AuthUtils} from "../utils/auth-utils";
import moment from "moment/moment";
import {ValidationUtils} from "../utils/validation-utils";
import {OperationsService} from "../services/operations-service";
import {ValidationType} from "../types/validation.type";
import {OperationsParamsType} from "../types/operations-params.type";
import {OperationsInfoType, OperationsResponseType} from "../types/operations-response.type";
import {Period} from "../types/period.enum";

export class Dashboard {
    private calendarFromElement: HTMLInputElement | null = null;
    private linkFromElement: HTMLLinkElement | null = null;
    private calendarToElement: HTMLInputElement | null = null;
    private linkToElement: HTMLLinkElement | null = null;
    readonly validations: ValidationType[];
    readonly openNewRoute: (url: string) => Promise<void>;
    private incomeChart: Chart<"pie", number[], string> | null = null;
    private expenseChart: Chart<"pie", number[], string> | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.findElements();
        this.validations = [
            {element: this.calendarFromElement},
            {element: this.calendarToElement}
        ];

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
            return;
        }

        this.openNewRoute = openNewRoute;
        Chart.register(PieController, ArcElement, Legend, Colors, Tooltip);

        this.initCalendar();
        this.initPie();


        this.getOperations({period: Period['today']}).then();
        this.initFilter();
    }

    private findElements(): void {
        this.calendarFromElement = document.getElementById("calendar-from") as HTMLInputElement;
        this.linkFromElement = document.getElementById('from') as HTMLLinkElement;

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

    private initPie(): void {
        this.incomeChart = new Chart(document.getElementById('income-chart') as HTMLCanvasElement, {
            type: 'pie',
            data: {
                labels: [
                    'Нет данных',
                ],
                datasets: [{
                    data: [1],
                    hoverOffset: 1
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15
                        }
                    },
                    colors: {
                        forceOverride: true
                    }
                }
            }
        });

        this.expenseChart = new Chart(document.getElementById('expense-chart') as HTMLCanvasElement, {
            type: 'pie',
            data: {
                labels: [
                    'Нет данных',
                ],
                datasets: [{
                    data: [1],
                    hoverOffset: 1
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15
                        }
                    },
                    colors: {
                        forceOverride: true
                    }
                }
            }
        });
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
            response.redirect ? this.openNewRoute(response.redirect) : null;
            return;
        }

        this.showOperations(response.operations);
    }

    private showOperations(operations: OperationsInfoType[] | null): void {
        let incomeData: OperationsInfoType[] = [];
        let expenseData: OperationsInfoType[] = [];
        if (operations) {
            incomeData = operations.filter((op: OperationsInfoType) => op.type === 'income');
            expenseData = operations.filter((op: OperationsInfoType) => op.type === 'expense');
        }

        this.updateChart(incomeData, this.incomeChart);
        this.updateChart(expenseData, this.expenseChart);
    }

    private updateChart(data: OperationsInfoType[], element: Chart<"pie", number[], string> | null): void {
        if (data.length > 0) {
            let categories: string[] = [];
            let amount: number[] = [];

            for (let i: number = 0; i < data.length; i++) {
                categories.push(data[i].category);
            }
            categories = categories.filter((item: string, i: number, ar: string[]) => ar.indexOf(item) === i);

            if (element) {
                element.data.labels = categories;


                for (let i: number = 0; i < categories.length; i++) {
                    const sum: number = data.filter((item: OperationsInfoType) => item.category === categories[i]).map((item: OperationsInfoType) => item.amount).reduce((acc: number, item: number) => acc + item);
                    amount.push(sum);
                }


                element.data.datasets[0].data = amount;
                element.update();
            }
        }
    }
}