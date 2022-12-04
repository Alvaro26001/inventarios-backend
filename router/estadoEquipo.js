const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');

const {validarEstadoEquipo} = require('../helpers/validar-estadoEquipo');
const validarJwt = require('../middlewares/validarJwt');
const { esAdmin } = require('../middlewares/validarRol');

const router = Router();

router.get('/', validarJwt, async function(req,res) {
    try
    {
        const tipos = await EstadoEquipo.find();
        res.send(tipos);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.post('/',validarJwt, esAdmin, async function(req,res) {
    try
    {
        const validaciones = validarEstadoEquipo (req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        let estadoEquipo = new EstadoEquipo();

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fehaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.put('/:estadoEquipoId',validarJwt, esAdmin, async function(req,res) {
    try
    {
        const validaciones = validarEstadoEquipo (req);
        
        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);

        if(!estadoEquipo)
        {
            return res.status(400).send("No existe estado");
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fehaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.get('/:estadoId', validarJwt, async function(req, res){
    try
    {
        const estado = await EstadoEquipo.findById(req.params.estadoId);
        if(!estado)
        {
            return res.status(404).send('estado no existe');
        }
        res.send(estado);
    }
    catch(error)
    {
        console.log(error);
        res.send.status(500).send("Ocurrio un erro al consultar inventarios");
    }
    
});

module.exports = router;