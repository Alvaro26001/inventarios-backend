const express = require('express');
const {getConnection} = require('./db/db-connection-mongo');
require('dotenv').config();

const cors = require('cors');
 

const app = express();
const port = process.env.PORT;

//Implementacion cors
app.use(cors())
 
getConnection();

//Parseo json
app.use(express.json());

app.use('/usuario', require('./router/usuario'));
app.use('/estado-equipo', require('./router/estadoEquipo'));
app.use('/marca', require('./router/marca'));
app.use('/tipo-equipo', require('./router/tipoEquipo'));
app.use('/inventario', require('./router/inventario'));

//Modulo autenticacion y autorizacion
 const auth = require('./router/auth')

//Modulo autenticacion y autorizacion
app.use('/auth',auth)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
