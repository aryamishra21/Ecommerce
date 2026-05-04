import type { UserRole } from "shared/dist/index.js"

declare global {
    namespace Express{
        interface Request{
            user?:{
                userId:string,
                role:UserRole
            }
        }
    }
}