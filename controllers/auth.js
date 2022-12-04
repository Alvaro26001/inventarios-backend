const UsuarioSys = require('../models/Usuario');
const { request,response  } = require('express');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


//crear usuarios con roles

const register = async (req = request, 
    res = response) => {
         //destructuring
         const {email,password} = req.body;
     try{
       const usuariSysBD = await UsuarioSys.findOne({email})

       //respuesta personalizada cuando emil existe
       if(usuariSysBD)
       {
        return res.status(400).json({

            msg:"ya exite usuario"
        })
       }

       const usuarioSys = new UsuarioSys(req.body)

       //cifrar la comtraseña antes de guardar
       const salt = await bcryptjs.genSalt()
       const passwordEnc = bcryptjs.hashSync(password,salt)

       usuarioSys.password = passwordEnc;
       //guardo


       const usuarioSysSaved = await usuarioSys.save()
       return res.status(201).json(usuarioSysSaved)
    }catch(e){
        console.log(e)
        return res.status(500).json({e})
    }
}

const login = async (req = request, 
    res = response) => {
        const {email,password} = req.body;
        
    try{
        const usuariSys = await UsuarioSys.findOne({email})

        //respuesta personalizada cuando emil existe
        if(!usuariSys)
        {
         return res.status(404).json({
 
            msg:"NO exite usuario"
         })
        }
        if(!usuariSys.estado)
        {
            return res.status(401).json({
 
                msg:"Usuario inactivo"
            })  
        }
        const esPassword = bcryptjs.compareSync(password,usuariSys.password)
        if(!esPassword)
        {
            return res.status(401).json({
 
                msg:"Credenciales incorrectas"
            })  
        }

        const payload =  {
            usurio:usuariSys.email,
            nombre:usuariSys.nombre,
            rol:usuariSys.rol
        }

        const token = jwt.sign(
            payload,
            process.env.SECRET_KEY,{
                expiresIn:'1h'
            }
        );
           

        

        return res.json({usuariSys, token})
    }catch(e){
        return res.status(500).json({msj: e})
    }
}

module.exports = {
    register,
    login
}