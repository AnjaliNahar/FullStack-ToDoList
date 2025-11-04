import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title:{
    type:String
  },
  desc:{
    type:String
  },
  completed: {
    type: Boolean,
    default: false
   },
    dueDate: {
    type: Date, // ⏰ Time till the task should be completed
  }

},{timestamps:true})

const todModel =mongoose.models.ToDo || mongoose.model("ToDo",todoSchema)
export default todModel