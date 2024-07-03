export type AuthType = {
    accessToken: string,
    refreshToken: string,
    userInfo?: string
}

export type UserInfoType = {
    id: number,
    name: string,
    lastName: string
}