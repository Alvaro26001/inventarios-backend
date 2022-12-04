const { Router } = require('express');
const Marca = require('../models/Marca');

const {validarMarca} = require('../helpers/validar-marca');
const validarJwt = require('../middlewares/validarJwt');
const { esAdmin } = require('../middlewares/validarRol');

const  router = Router();

router.get('/', validarJwt ,async function(req, res){
    try
    {
        const marcas = await Marca.find();
        res.send(marcas);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");

    }

});

router.post('/',validarJwt, esAdmin,  async function(req, res){
    try
    {
        const validaciones = validarMarca(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }


        let marca = new Marca();


        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();
        
        marca = await marca.save();
        res.send(marca);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.put('/:marcaId',validarJwt, esAdmin, async function(req, res){
    try
    {
        const validaciones = validarMarca(req);

        if(validaciones.length > 0)
        {
            return res.status(400).send(validaciones);
        }

        let marca = await Marca.findById(req.params.marcaId);

        if(!marca)
        {
            return res.status(400).send("Marca no existe");
        }

        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();
        
        marca = await marca.save();
        res.send(marca);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Ocurrio un error");
    }
});

router.get('/:marcaId', validarJwt, async function(req, res){
    try
    {
        const marca = await Marca.findById(req.params.marcaId);
        if(!marca)
        {
            return res.status(404).send('marca no existe');
        }
        res.send(marca);
    }
    catch(error)
    {
        console.log(error);
        res.send.status(500).send("Ocurrio un erro al consultar inventarios");
    }
    
});

module.exports = router;