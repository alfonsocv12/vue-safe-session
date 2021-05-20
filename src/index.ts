import { SessionCookie } from "./types";
import { SHA256, AES } from 'crypto-js'

class cookieHandler {

    key: string;
    #sessionObject: SessionCookie = {
        token: undefined,
        exp: undefined,
        refreshToken: undefined
    }

    constructor(secretKey: string) {
        this.key = SHA256(secretKey).toString();
    }

    updateSessionObject(
        token: string,
        expiration: string | undefined,
        refreshToken: string | undefined
    ): void {
        this.#sessionObject = {
            token: token,
            exp: expiration,
            refreshToken: refreshToken
        }
    }

    setSessionCookie(
        token: string,
        expiration: string | undefined,
        refreshToken: string | undefined
    ): void {
        this.updateSessionObject(token, expiration, refreshToken)
        const sessionCookie = AES.encrypt(
            JSON.stringify(this.#sessionObject), this.key
        )
        document.cookie = `session=${sessionCookie};`
    }
}

export default cookieHandler