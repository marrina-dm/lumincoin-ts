export type CategoriesInfoType = {
    id: number,
    title: string
}

export type CategoryType = {
    error: boolean | string,
    redirect: string | null
}

export type CategoriesResponseType = {
    error: boolean | string,
    redirect: string | null,
    categories: CategoriesInfoType[] | null
}

export type CategoryResponseType = {
    error: boolean | string,
    redirect: string | null,
    category: CategoriesInfoType | null
}