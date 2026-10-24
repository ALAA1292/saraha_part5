import { UnauthorizedException } from "../Utils/Security/Errors/exceptions.error.js"




export const authorize=(allowedRoles)=>{
return(req,res,next)=>{
    const loggedinRoles=req.authUser.role
    // console.log(loggedinRoles,allowedRoles,allowedRoles.includes(loggedinRoles))
    if(!allowedRoles.includes(loggedinRoles)){
        throw new UnauthorizedException('user is not authorized to access this resource',null,'FORBIDEN')
    }
    next()
}
}