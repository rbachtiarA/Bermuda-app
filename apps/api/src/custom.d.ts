type IUserAuth = {
    id: number,
    role: string
}

declare namespace Express {
    export interface Request {
        userAuth?: IUserAuth
    }
}