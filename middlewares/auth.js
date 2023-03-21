import jwt from 'jsonwebtoken'

export function checkToken(req, res, next){

    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).send('Access Rejected')
    }

    try{
        const decodeToken = jwt.verify(token, 'privateKey')
        req.user = decodeToken;
        next()
    }catch(e){
        res.status(400).send('Wrong Token')
    }
    
}
