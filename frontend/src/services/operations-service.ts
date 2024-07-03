import {HttpUtils} from "../utils/http-utils";
import moment from "moment/moment";
import {OperationResponseType, OperationsResponseType, OperationType} from "../types/operations-response.type";
import {OperationsParamsType} from "../types/operations-params.type";
import {ResultRequestType} from "../types/result-request.type";
import {Methods} from "../types/methods.enum";
import {OperationBodyType} from "../types/operation-body.type";
import {OperationChangedDataType} from "../types/operation-changed-data.type";

export class OperationsService {
    public static async getOperations(params: OperationsParamsType): Promise<OperationsResponseType> {
        const returnObject: OperationsResponseType = {
            error: false,
            redirect: null,
            operations: null
        }

        let query: string | null = null;
        if (params.dateFrom && params.dateTo) {
            let dateFromArr: number[] = params.dateFrom.split('.').map((item: string) => Number(item));
            const dateFrom: string = moment(new Date(dateFromArr[2], dateFromArr[1] - 1, dateFromArr[0])).format('YYYY-MM-DD');

            let dateToArr: number[] = params.dateTo.split('.').map((item: string) => Number(item));
            const dateTo: string = moment(new Date(dateToArr[2], dateToArr[1] - 1, dateToArr[0])).format('YYYY-MM-DD');

            query = '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        }

        const result: ResultRequestType = await HttpUtils.request('/operations?period=' + params.period + (query ? query : ''));

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе операций. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    public static async getOperation(id: string): Promise<OperationResponseType> {
        const returnObject: OperationResponseType = {
            error: false,
            redirect: null,
            operation: null
        }

        const result: ResultRequestType = await HttpUtils.request('/operations/' + id);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            returnObject.error = 'Возникла ошибка при запросе операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operation = result.response;
        return returnObject;
    }

    static async createOperation(data: OperationBodyType): Promise<OperationType> {
        const returnObject: OperationType = {
            error: false,
            redirect: null
        }

        const result: ResultRequestType = await HttpUtils.request('/operations', Methods.post, true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при создании операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async updateOperation(id: string, data: OperationChangedDataType): Promise<OperationType> {
        const returnObject: OperationType = {
            error: false,
            redirect: null
        }

        const result: ResultRequestType = await HttpUtils.request('/operations/' + id, Methods.put, true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            returnObject.error = 'Возникла ошибка при редактировании операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async deleteOperation(id: string): Promise<OperationType> {

        const returnObject: OperationType = {
            error: false,
            redirect: null
        }

        const result: ResultRequestType = await HttpUtils.request('/operations/' + id, Methods.delete, true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}