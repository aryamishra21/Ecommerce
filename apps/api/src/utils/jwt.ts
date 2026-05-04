import jwt from "jsonwebtoken";
import { type SignOptions, type Secret } from "jsonwebtoken";
import { env } from "../config/env.js"

const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES as any
}
const optionsRef: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES as any
}
export const signAccessToken=(payload: object)=>{
    return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, options)
}
export const signRefreshToken=(payload:object)=>{
    return jwt.sign(payload,env.JWT_REFRESH_SECRET as Secret,optionsRef)
}
export const verifyAccessToken=(token:string)=>{
    return jwt.verify(token,env.JWT_ACCESS_SECRET);
}
export const verifyRefreshToken=(token:string)=>{
    return jwt.verify(token,env.JWT_REFRESH_SECRET);
}