import {OperationsEnum} from "./operations.enum";

export type OperationBodyType = {
    type: OperationsEnum,
    amount: number,
    date: string,
    comment: string,
    category_id: number
}