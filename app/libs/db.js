// import mongoose from "mongoose";

// const DBCon = async() =>{
//    try {
//      await mongoose.connect(process.env.MONGODBURL)
//     console.log("Mongo db is connected")
//    } catch (error) {
//       console.log("Mongodb err" , error)
//    }
// }

// export default DBCon

import mongoose from "mongoose";

const DBCon = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
  }
};

export default DBCon;