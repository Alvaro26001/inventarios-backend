const { response, request } = require("express");


const esAdmin = (req = request, res = response, next) =>{

    if(!req.user)
    {
        return res.status(500).json({
            msg:"Debe validar el token"
        })
    }
    const {rol} = req.user
    if(rol!=='ADMIN')
    {
        return res.status(500).json({
            msg:"No tiene los permisos"
        })
    }

    next()
}

module.exports = {
    esAdmin
}