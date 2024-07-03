import {HttpUtils} from "../utils/http-utils";
import {CategoriesResponseType, CategoryResponseType, CategoryType} from "../types/categories-response.type";
import {ResultRequestType} from "../types/result-request.type";
import {Methods} from "../types/methods.enum";
import {CategoryBodyType} from "../types/category-body.type";

export class ExpenseService {
    public static async getCategories(): Promise<CategoriesResponseType> {
        const returnObject: CategoriesResponseType = {
            error: false,
            redirect: null,
            categories: null
        }

        const result: ResultRequestType = await HttpUtils.request('/categories/expense');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категорий расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    static async getCategory(id: string): Promise<CategoryResponseType> {
        const returnObject: CategoryResponseType = {
            error: false,
            redirect: null,
            category: null
        }

        const result: ResultRequestType = await HttpUtils.request('/categories/expense/' + id);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при запросе категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    static async createCategory(data: CategoryBodyType): Promise<CategoryType> {
        const returnObject: CategoryType = {
            error: false,
            redirect: null
        }

        const result: ResultRequestType = await HttpUtils.request('/categories/expense', Methods.post, true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при создании категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async updateCategory(id: string, data: CategoryBodyType): Promise<CategoryType> {
        const returnObject: CategoryType = {
            error: false,
            redirect: null
        }

        const result: ResultRequestType = await HttpUtils.request('/categories/expense/' + id, Methods.put, true, data);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id || !result.response.title))) {
            returnObject.error = 'Возникла ошибка при редактировании категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async deleteCategory(id: string): Promise<CategoryType> {

        const returnObject: CategoryType = {
            error: false,
            redirect: null
        }

        const result: ResultRequestType = await HttpUtils.request('/categories/expense/' + id, Methods.delete, true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении категории расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}