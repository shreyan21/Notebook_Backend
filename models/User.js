import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({ name: { type: String, required: true },

   email:{type:String,unique:true,required:true},

   password:{type:String,required:true},
   
   date:{type:Date,default:Date.now}
}) 

UserSchema.pre('remove', function(next) {
   const user = this;
   // Remove all notes that belong to this user
   Note.deleteMany({ user: user._id }, (err) => {
       if (err) {
           return next(err);
       }
       next();
   });
});

export default mongoose.model('User',UserSchema)