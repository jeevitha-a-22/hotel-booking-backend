const mongoose=require("mongoose");
const connectDB=async()=>{if(!process.env.MONGO_URI)throw new Error("MONGO_URI is not configured");const c=await mongoose.connect(process.env.MONGO_URI);console.log(`MongoDB connected: ${c.connection.host}`)};
module.exports=connectDB;
