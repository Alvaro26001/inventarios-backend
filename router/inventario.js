const { Router } = require('express');
const Inventario = require('../models/Inventario');

const {validarInventario} = require('../helpers/validar-inventario');
const validarJwt = require('../middlewares/validarJwt');
const { esAdmin } = require('../middlewares/validarRol');

const router = Router();

router.get('/', validarJwt, async function(req,res){
    try
    {
        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado'
            },

            {
                path: 'marca', select: 'nombre estado'
            },

            {
                path: 'tipoEquipo', select:'nombre estado'
            },

            {
                path: 'estadoEquipo', select: 'nombre estado'
            }
        ]);

        res.send(inventarios);
    }
    catch(error)
    {
        console.log(error);
        res.send.status(500).send("Ocurrio un erro al consultar inventarios");
    }
});

router.post('/', validarJwt, esAdmin, async function(req,res){
    try
    {

        const validaciones = validarInventario(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        const existeInventarioPorSerial = await Inventario.findOne({ serial: req.body.serial });

        if(existeInventarioPorSerial)
        {
            return res.status(400).send("Ya existe el serial para otro equipo");
        }

        let inventario = new Inventario();

        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.color = req.body.color;
        inventario.foto = req.body.foto;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();
        inventario = await inventario.save();

        res.send(inventario);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un erro al crear un inventario");
    }
});

router.put('/:inventarioId', validarJwt, esAdmin, async function(req,res){
    try
    {
        const validaciones = validarInventario(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        let inventario = await Inventario.findById(req.params.inventarioId);

        if(!inventario)
        {
            return res.status(400).send("Inventario no existe");
        }

        const existeInventarioPorSerial = await Inventario.findOne({ serial: req.body.serial, _id: { $ne: inventario._id } });

        if(existeInventarioPorSerial)
        {
            return res.status(400).send("Ya existe el serial para otro equipo");
        }

        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.color = req.body.color;
        inventario.foto = req.body.foto;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaActualizacion = new Date();
        inventario = await inventario.save();
        res.send(inventario);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un erro al actualizar un inventario");
    }
}); 


router.put('/:usuarioId',validarJwt, esAdmin, async function(req, res){
    try
    {
        const validaciones = validarUsuario(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        console.log("Objeto recibido",req.body, req.params);

        let usuario = await Usuario.findById(req.params.usuarioId);

        if(!usuario)
        {
            return res.status(400).send("Usuario no existe");
        }

        const existeUsuario = await Usuario.findOne({email: req.body.email, _id: { $ne: usuario._id }});

        console.log("Respuesta existe usuario ",existeUsuario);

        if(existeUsuario)
        {
            return res.status(400).send("Email ya existe");
        }

        usuario.email = req.body.email;
        usuario.nombre = req.body.nombre;
        usuario.estado = req.body.estado;
        usuario.fechaActualizacion = new Date();



        usuario =  await usuario.save();

        res.send(usuario);

    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.get('/:inventarioId',validarJwt, async function(req, res){
    try
    {
        const inventario = await Inventario.findById(req.params.inventarioId);
        if(!inventario)
        {
            return res.status(404).send('Inventario no existe');
        }
        res.send(inventario);
    }
    catch(error)
    {
        console.log(error);
        res.send.status(500).send("Ocurrio un erro al consultar inventarios");
    }
    
});

module.exports = router;