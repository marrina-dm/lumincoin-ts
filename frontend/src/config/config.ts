import {ConfigType} from "../types/config.type";

const host: string = 'http://localhost:3000';

const config: ConfigType = {
    host: host,
    api: host + '/api'
}

export default config;