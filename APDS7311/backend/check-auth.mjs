import jwt from "jsonwebtoken"

const checkauth = (req,res,next)=>
{
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IlF3ZXJ0eTEyMzQiLCJpYXQiOjE3MjM0NDUxMDYsImV4cCI6MTcyMzQ0ODcwNn0.Aw0ngdfUtu63zCsNDNYY7t1Y7PrnLfmk_6aesrIt6Ik")
        next();
    }
    catch(error)
    {
        res.status(401).json({
            messge: "Token invalid"
        });
    }
};

export default checkauth