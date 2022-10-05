const mongoose = require('mongoose');

const getConnection = async () => {
    try
    {
        const url = 'mongodb://userBD:3VOmkXlbtJFCpd2b@ac-naf2wtb-shard-00-00.ggmxblw.mongodb.net:27017,ac-naf2wtb-shard-00-01.ggmxblw.mongodb.net:27017,ac-naf2wtb-shard-00-02.ggmxblw.mongodb.net:27017/inventarios-app?ssl=true&replicaSet=atlas-lcoaha-shard-0&authSource=admin&retryWrites=true&w=majority';

        await mongoose.connect(url);
    
        console.log("conexion exitosa");

    }
    catch (error)
    {
        console.log(error);
    }
}

module.exports =
{
    getConnection,
}