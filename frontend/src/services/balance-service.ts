import {HttpUtils} from "../utils/http-utils";
import {ResultRequestType} from "../types/result-request.type";
import {BalanceResponseType} from "../types/balance-response.type";
import {Methods} from "../types/methods.enum";
import {BalanceBodyType} from "../types/balance-body.type";

export class BalanceService {
    public static async getBalance(): Promise<BalanceResponseType> {
        const returnObject: BalanceResponseType = {
            error: false,
            redirect: null,
            balance: null
        }

        const result: ResultRequestType = await HttpUtils.request('/balance');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе баланса. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.balance = result.response.balance;
        return returnObject;
    }

    static async updateBalance(data: BalanceBodyType): Promise<BalanceResponseType> {
        const returnObject: BalanceResponseType = {
            error: false,
            redirect: null,
            balance: null
        }

        const result: ResultRequestType = await HttpUtils.request('/balance', Methods.put, true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при обновлении баланса. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.balance = result.response.balance;
        return returnObject;
    }
}