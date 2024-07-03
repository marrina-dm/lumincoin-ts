export type DefaultResponseType = {
    error: boolean,
    message: string,
    validation?: ErrorDetailsType[],
}

export type ErrorDetailsType = {
    key: string | null,
    message: string,
}