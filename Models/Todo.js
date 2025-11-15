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
  },
  completedAt: {
      type: Date,
      default: null,
    },



  // ⭐ TTL Index: deletes doc 24 hours after completedAt
  expireAt: {
    type: Date,
    default: function () {
      return this.completedAt;
    },
    index: {
      expireAfterSeconds: 86400, // 24 hours
    },
  },

},{timestamps:true})

const todModel =mongoose.models.ToDo || mongoose.model("ToDo",todoSchema)
export default todModel