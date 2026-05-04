import type { NextFunction,Request,Response } from "express";
import type { UserRole } from "shared/dist/index.js";
import { ApiError } from "../utils/ApiError.js";

export const authorize = (...roles: UserRole[]) => {
    return (req:Request,res:Response,next:NextFunction)=>{
        if(!req.user){
            throw new ApiError(401, "Not authorized");
        }
        if(!roles.includes(req.user.role)){
            throw new ApiError(403,"Forbidden: insufficient permissions");
        }
        next();
    }
};
