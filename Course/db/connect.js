const mongoose = require('mongoose');
const connectDB = async (MONGO_URI) => {
    try {
        mongoose.set('strictQuery',false);
        await mongoose.connect(MONGO_URI, {});
        console.log('connected to DB');
    } catch (err) {
        console.log('err', err);
    }
}
module.exports=connectDB;