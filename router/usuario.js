const { Router } = require('express');
const { startSession } = require('../models/Usuario');

const {validarUsuario} = require('../helpers/validar-usuario');


const router = Router();
const Usuario = require('../models/Usuario');
const validarJwt = require('../middlewares/validarJwt');
const { esAdmin } = require('../middlewares/validarRol');

router.post('/', validarJwt, esAdmin, async function(req, res){

    try
    {
        const validaciones = validarUsuario(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        console.log("Objeto recibido",req.body);

        const existeUsuario = await Usuario.findOne({email: req.body.email});

        console.log("Respuesta existe usuario ",existeUsuario);

        if(existeUsuario)
        {
            return res.status(400).send("Email ya existe");
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        res.send(usuario);

    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
    
});  

router.get('/', validarJwt,  async function(req, res){
    
    try
    {
        const usuarios = await Usuario.find();
        res.send(usuarios);
    }
    catch(error)
    {
        console.log(error);
        res.send("Ocurrio un error");
    }

});

router.put('/:usuarioId', validarJwt, esAdmin , async function(req, res){
    try
    {
        const validaciones = validarUsuario(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        let usuario = await Usuario.findById(req.params.usuarioId);

        if(!usuario)
        {
            return res.status(400).send("Marca no existe");
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.fechaActualizacion = new Date();
        
        usuario = await usuario.save();
        res.send(usuario);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.get('/:usuarioId', validarJwt, async function(req, res){
    try
    {
        const usuario = await Usuario.findById(req.params.usuarioId);
        if(!usuario)
        {
            return res.status(404).send('Inventario no existe');
        }
        res.send(usuario);
    }
    catch(error)
    {
        console.log(error);
        res.send.status(500).send("Ocurrio un erro al consultar inventarios");
    }
    
});



module.exports = router;