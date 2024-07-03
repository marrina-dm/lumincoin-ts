import {OperationsEnum} from "./operations.enum";

export type OperationsInfoType = {
    id: number,
    type: OperationsEnum,
    amount: number,
    date: string,
    comment: string,
    category: string
}

export type OperationType = {
    error: boolean | string,
    redirect: string | null
}

export type OperationsResponseType = {
    error: boolean | string,
    redirect: string | null,
    operations: OperationsInfoType[] | null
}

export type OperationResponseType = {
    error: boolean | string,
    redirect: string | null,
    operation: OperationsInfoType | null
}