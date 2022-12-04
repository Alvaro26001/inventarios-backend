const { Router } = require('express');
const { get } = require('mongoose');
const TipoEquipo = require('../models/TipoEquipo');

const {validarTipoEquipo} = require('../helpers/validar-tipoEquipo');
const validarJwt = require('../middlewares/validarJwt');
const { esAdmin } = require('../middlewares/validarRol');


const router = Router();

router.get('/', validarJwt, async function(req, res){
    try
    {
        const tipos = await TipoEquipo.find();
        res.send(tipos);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.post('/', validarJwt, esAdmin, async function(req, res){
    try
    {
        const validaciones = validarTipoEquipo(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        let tipoEquipo = new TipoEquipo();

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();
        res.send(tipoEquipo);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.put('/:tipoEquipoId', validarJwt, esAdmin, async function(req, res){
    try
    {
        const validaciones = validarTipoEquipo(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();
        res.send(tipoEquipo);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.get('/:tipoId',validarJwt,  async function(req, res){
    try
    {
        const tipo = await TipoEquipo.findById(req.params.tipoId);
        if(!tipo)
        {
            return res.status(404).send('Tipo Equipo no existe');
        }
        res.send(tipo);
    }
    catch(error)
    {
        console.log(error);
        res.send.status(500).send("Ocurrio un erro al consultar inventarios");
    }
    
});

module.exports = router;