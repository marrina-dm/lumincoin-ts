export type ValidationType = {
    element: HTMLInputElement | null,
    options?: OptionsType
}

export type OptionsType = {
    pattern?: RegExp,
    compareTo?: string
}