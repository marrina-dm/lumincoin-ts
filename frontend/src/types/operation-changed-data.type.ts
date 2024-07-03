import {OperationsEnum} from "./operations.enum";

export type OperationChangedDataType = {
    type?: OperationsEnum,
    amount?: number,
    date?: string,
    comment?: string,
    category_id?: number
}