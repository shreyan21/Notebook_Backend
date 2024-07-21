import { Router } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import verifyToken from '../middleware/middle.js'
import { validationResult, body } from 'express-validator'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { upload } from '../utils/cloudinary.js'

const router = Router()
dotenv.config()
const validateInputs = [
    body('name', 'Name is required').notEmpty().isString(),
    body('email', 'Invalid email address').isEmail(),
    body('password', 'Password must be atleast 8 characters long').isLength({ min: 8 }),
];

router.post('/create', upload.single('image'),  async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const x = await User.findOne({ email: req.body.email })
    if (x) {
        return res.status(409).json({ message: "email already exists" })
    }
    // const user = new User(req.body)  
    // const result = await uploadToCloudinary(req.file.path)

    const user = await User.create({ name: req.body.name, email: req.body.email, password: secPass,avatar:{
        url:req.file.path,publicId:req.file.filename
    } })
    let code;
    let message;
    try {
        await user.save()

        code = 201
        message = "Created"

    }
    catch (e) {
        code = 500
        message = "Server error"
        return res.json(message)

    }
    return res.json({ message: "User created successfully" })



})

router.post('/resetPassword', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    const errors = validationResult(req);
    await User.updateOne({ email: req.body.email }, { $set: { password: secPass } }, { upsert: true })
    return res.send('Succesfully updated password')


})

router.post('/login', [body('email', 'Enter valid email').isEmail()

    , body('password', 'Password cannot be blank').exists()], async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.json({ error: errors.array() })
        }
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ message: "User with this email does not exist" })
            }
            const password1 = await bcrypt.compare(req.body.password, user.password)
            if (password1) {
                const data = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: req.body.email,
                        avatar:user.avatar.url
                    }
                }
                const authtoken = jwt.sign(data, process.env.JWT_SECRET)
                return res.status(200).json({ 'authtoken': authtoken })
            }
            else {

                return res.status(401).json({ message: "Invalid credentials" })
            }
        } catch (e) {
            return res.status(400).json({ error: e })
        }


    })

router.post('/checkmail', async (req, res) => {
    const x = await User.findOne({ email: req.body.email })
    if (x) {
        res.json({ exists: true })

    }
    else {
        res.json({ exists: false })
    }
})


router.delete('/remove', verifyToken, async (req, res) => {
    try {




        await User.deleteOne({ _id: req.body.id })
        res.status(200).json({ message: "User deleted" })


    }
    catch (err) {
        return res.status(500).json({ err })
    }
})

router.get('/view', async (req, res) => {
    let a = await User.find({}).select()
    return res.send(a)

})

export default router