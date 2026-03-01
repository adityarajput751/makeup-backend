import mongoose from "mongoose";

const connectDB =async()=>{
    mongoose.connection.on('connected',()=>console.log('dadtabase connected'))
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
  ssl: true,
  tls: true,
}).catch((err)=>{
    console.log('database connection error',err)
})}

export default connectDB