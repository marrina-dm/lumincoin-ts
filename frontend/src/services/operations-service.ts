import {HttpUtils} from "../utils/http-utils";
import {OperationResponseType, OperationsResponseType, OperationType} from "../types/operations-response.type";
import {OperationsParamsType} from "../types/operations-params.type";
import {ResultRequestType} from "../types/result-request.type";
import {Methods} from "../types/methods.enum";
import {OperationBodyType} from "../types/operation-body.type";

export class OperationsService {
    public static async getOperations(params: OperationsParamsType): Promise<OperationsResponseType> {
        const returnObject: OperationsResponseType = {
            error: false,
            redirect: null,
            operations: null
        }

        let query: string | null = null;
        if (params.dateFrom && params.dateTo) {
            query = '&dateFrom=' + params.dateFrom + '&dateTo=' + params.dateTo;
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

    static async updateOperation(id: string, data: OperationBodyType): Promise<OperationType> {
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