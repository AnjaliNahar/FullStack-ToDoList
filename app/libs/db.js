import mongoose from "mongoose";

const DBCon = async() =>{
   try {
     await mongoose.connect(process.env.MONGODBURL)
    console.log("Mongo db is connected")
   } catch (error) {
      console.log("Mongodb err" , error)
   }
}

export default DBCon