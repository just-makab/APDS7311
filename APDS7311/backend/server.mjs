import express from "express";
const PORT = 3000;
const app = express();

app.use(express.json());

app.get('/',(req, res)=>{
    res.send("Whats up buddy")
})

app.get('/test',(req, res)=>{
res.send('Testing the /test thing')
})


app.listen(PORT);