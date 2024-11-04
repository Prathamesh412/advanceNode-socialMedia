const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

mongoose.connect("mongodb+srv://prathprabhu:pAtkmnDN8NkZwfns@cluster0.ugnip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(console.log("Database connected")).catch(err=>console.log(err))

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const cookieParser = require('cookie-parser')
const path = require('path')
app.use(express.json())
app.use(cookieParser())
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)


app.get('/', (req, res) => res.send('Hello World!'))

const posts = [
    {id:1,title:"First Post", content:"This is the first post"},
    {id:2,title:"Second Post", content:"This is the second post"},
    {id:3,title:"Third Post", content:"This is the third post"},
]

app.get('/posts', (req, res) => res.json(posts))

app.get('/posts/:id', (req, res) =>{
    
    const postId = req.params.id

    const post = posts.find(post => post.id===postId)

    if(!post) return res.json({message: "Posts don't exist"})

    res.json(post)
})

app.post("/post", (req,res) =>{
    const title = "new Post"
    const content ="New content"

    const newPost = {id: posts.length+1, tilte,content}
    posts.push(newPost)

    res.json(posts)
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//prathprabhu
//pAtkmnDN8NkZwfns