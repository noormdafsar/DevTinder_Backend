const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://mdafsar786noor:Nooruddin786@nooruddin.ifqxp.mongodb.net/devTinder',
            // {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            // }
        );
    }
    catch(err) {
        console.log('Error while connecting to the database', err);
    }
}

module.exports = connectDB;