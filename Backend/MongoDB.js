const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.DB_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log('connected to MongoDB') }).catch(err => { console.log(err) });
}