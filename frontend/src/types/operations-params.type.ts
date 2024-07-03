import {Period} from "./period.enum";

export type OperationsParamsType = {
    period: Period,
    dateFrom?: string,
    dateTo?: string
}