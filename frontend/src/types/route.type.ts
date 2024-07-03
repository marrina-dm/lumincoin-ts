export type RouteType = {
    route: string,
    title?: string,
    template?: string,
    styles?: string[],
    scripts?: string[],
    useLayout?: string | boolean,
    load(): void
}