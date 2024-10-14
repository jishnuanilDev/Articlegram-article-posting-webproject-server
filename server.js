const express = require('express');
const dotenv  = require('dotenv');
const cors = require('cors');
const userRoute = require('./routes/userRoutes')
const dbConnect = require('./config/db');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: '*'
  }));
dbConnect();
app.use('/',userRoute);

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})

