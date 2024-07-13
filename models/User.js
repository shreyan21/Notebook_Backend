import mongoose, { Schema } from "mongoose";
import Notes from "./Notes";
const UserSchema = new Schema({ name: { type: String, required: true },

   email:{type:String,unique:true,required:true},

   password:{type:String,required:true},
   
   date:{type:Date,default:Date.now}
}) 

UserSchema.pre('deleteOne',{document:false,query:true}, async function(next) {

    const data=await this.model.findOne(this.getQuery())
    await Notes.deleteMany({user:data._id})
    next()
    

});

export default mongoose.model('User',UserSchema)