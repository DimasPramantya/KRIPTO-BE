require('dotenv').config();
const express = require('express');
const association = require('./util/assoc_db');
const userRoutes = require('./routes/user');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});


app.use(express.json());

app.use('/users', userRoutes);

app.use('/', (req,res,next)=>{
  res.status(404).json({
    status: "NOT FOUND",
    message: "RESOURCE NOT FOUND"
  })
})

association()
.then(()=>{
  app.listen(PORT, ()=>{
    console.log("Server is listening on PORT 5000");
  });
})
