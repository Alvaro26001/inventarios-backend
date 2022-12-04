const { Schema, model } = require('mongoose');

const usuarioSchema = (add) =>{
    const schema= Schema ({
        nombre:
        {
            type: String,
            required:true,
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
        },
        estado:
        {
            type: String,
            default:'Activo',
            required: true,
            enum:
            [
                'Activo',
                'Inactivo'
            ]
        },
        fechaCreacion:
        {
            type: Date,
            default: new Date()  
        },
        fechaActualizacion:
        {
            type: Date,
            default: new Date() 
        }
    });
    if(add){
        schema.add(add)

    }

    
    return schema
}

const UsuarioSchema = usuarioSchema()

const UsuarioSysSchema = usuarioSchema({
    password:{
        type:String,
        required:[true,'Password requerido']
    },
    rol:{
        type: String,
        required: true,
        enum: ['ADMIN','DOCENTE']

    }
})

module.exports = model('Usuario', UsuarioSchema)
module.exports = model('UsuarioSys', UsuarioSysSchema)
