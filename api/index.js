import express from 'express'
import router1 from '../routes/auth.js'
import router2 from '../routes/fetchAllNotes.js'
import run from '../db.js'
import cors from 'cors'


const app = express()

run()

app.use(express.json())


app.use(cors())

app.use('/auth', router1)
app.use('/notes', router2)
app.listen(3001)