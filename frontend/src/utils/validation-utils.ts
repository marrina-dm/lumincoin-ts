import {OptionsType, ValidationType} from "../types/validation.type";

export class ValidationUtils {
    public static validateForm(validations: ValidationType[]): boolean {
        let isValid: boolean = true;

        for (let i: number = 0; i < validations.length; i++) {
            if (!this.validateField(validations[i].element, validations[i].options)) {
                isValid = false;
            }
        }

        return isValid;
    }

    private static validateField(element: HTMLInputElement | null, options: OptionsType | undefined): boolean {
        if (!element) {
            return false;
        }

        let condition: boolean = Boolean(element.value);
        if (options) {
            if (options.hasOwnProperty('pattern') && options.pattern) {
                condition = Boolean(element.value && element.value.match(options.pattern));
            } else if (options.hasOwnProperty('compareTo')) {
                condition = Boolean(element.value && element.value === options.compareTo);
            }
        }

        if (condition) {
            element.classList.remove('is-invalid');
            return true;
        }

        element.classList.add('is-invalid');
        return false;
    }
}