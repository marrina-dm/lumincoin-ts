import {Methods} from "./methods.enum";

export type ParamsRequestType = {
    method: Methods,
    headers: {
        'Content-Type': string,
        'Accept': string,
        'x-auth-token'?: string
    },
    body?: any
}