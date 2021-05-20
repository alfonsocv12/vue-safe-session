import { SessionCookie } from "./types";
import { AES, enc } from 'crypto-js'

class CookieHandler {

    key: string;
    #sessionObject: SessionCookie = {
        token: undefined,
        exp: undefined,
        refreshToken: undefined
    }

    /**Constructor function */
    constructor(secretKey: string) {
        this.key = secretKey;
    }

    /**This is the install function for vue to become a plugin */
    install(Vue) {
        Vue.prototype.$safeSession = this;
        Vue.prototype.$safeSession['config'] = this;
        Vue.$safeSession = this;
    }

    /** Update the session object with the data that you send*/
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

    /**Set the session cookie hash with you data */
    setSessionCookie(
        token: string,
        expiration: string | undefined,
        refreshToken: string | undefined
    ): void {
        this.updateSessionObject(token, expiration, refreshToken)
        const sessionCookie = AES.encrypt(
            JSON.stringify(this.#sessionObject), this.key
        ).toString()
        document.cookie = `session=${encodeURIComponent(sessionCookie)};`
    }

    /**This functions clears the session cookie from cokies */
    clear(): void {
        document.cookie = 'session=;'
    }

    /** get the session cooki dehash and returns the object inside the hash*/
    getSessionObject(): Record<string, unknown> {
        const sessionHash = this.getCookie('session')
        const sessionObjectString = AES.decrypt(sessionHash, this.key).toString(enc.Utf8)
        return JSON.parse(sessionObjectString)
    }

    /** Get cookie value by name*/
    getCookie(name: string): string | undefined {
        // Split to get all the cookies in array
        const cookieArray = document.cookie.split(";")

        let cookieValue = undefined
        
        cookieArray.forEach((cookieKeyValueString) => {
            // Split cookie string and get all individual name=value pairs in an array
            const cookiePair = cookieKeyValueString.split('=')
            
            if (name.trim() === cookiePair[0].trim())  {
                cookieValue = decodeURIComponent(cookiePair[1])
                return cookieValue
            }
        })

        return cookieValue
    }
}

export default (function(secretKey: string) {
    return new CookieHandler(secretKey)
})