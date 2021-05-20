export interface SessionCookie {
    token: string | undefined,
    exp: string | undefined,
    refreshToken: string | undefined
}