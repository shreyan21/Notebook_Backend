import { Router } from "express";
import verifyToken from "../middleware/middle.js";
import Notes from "../models/Notes.js";

const router = Router()

router.post('/addNotes', verifyToken, async (req, res) => {
   const note = new Notes({ title: req.body.title, description: req.body.description, user: req.userid, tag: req.body.tag })
   try {

       await note.save()
       const note1=await Notes.find({user:req.userid})
      return res.json({note1})
   }
   catch (error) {
      return res.json(error)
   }


})

router.delete('/deleteNotes/:id', verifyToken, async (req, res) => {
   const note = await Notes.findById({ _id: req.params.id }).catch(err => { return res.json({ message: "Server error" }) })
   if (!note) {
      return res.json({ message: "Note does not exist" })
   }

   if (req.userid !== note.user.toString()) {
      return res.json({ message: "You are not authorized" })

   }
   await Notes.findByIdAndDelete(req.params.id)
   return res.json("Successfully deleted")

})


router.get('/fetchNotes', verifyToken, async (req, res) => {

      const notes = await Notes.find({ user: req.userid }).catch(err => res.json(err))
      
      return res.json({ notes})
   


})


router.put('/updateNotes/:id', verifyToken, async (req, res) => {
   try {
      const note = await Notes.findById({ _id: req.params.id }).catch(error => { return res.json({ message: "Server error" }) })
      if (!note) {
         return res.json({ message: "note does not exist" })
      }
      if (note.user.toString() !== req.userid) {
         return res.json({ message: "You are not authorized" })
      }


      await Notes.updateOne({ _id: req.params.id }, { $set: { title: req.body.title, description: req.body.description, tag: req.body.tag } }, { upsert: true })

      let notes=await Notes.find({user:req.userid})
      return res.json({notes})
   }
   catch (err) {
      return res.json(err)
   }


})

export default router