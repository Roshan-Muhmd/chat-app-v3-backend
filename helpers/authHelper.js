import jwt from "jsonwebtoken"

export const generateToken = (userData) => {
    const {email, userName} = userData
    
   
    const token = jwt.sign({email, userName},"jwt_secret_key_roshan",{ expiresIn: '1day' })
    return token
}