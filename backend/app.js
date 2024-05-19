const express = require("express");
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();
// Connection DB
const ConnectionDB = require("./config/connectToDb")
const {errorHandler, notFound} = require("./middlewares/error");
ConnectionDB()
const app = express();
//Middlewares
app.use(express.json());
//routers
const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))
// app.use(cors({
//     origin: "http://localhost:3002/"
// }))
app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/users", require("./routes/usersRoute"))
app.use("/api/products", require("./routes/productRoute"))
app.use("/api/categorise", require("./routes/categoriesRoute"))
app.use("/api/orders", require("./routes/orderRoute"))
app.use(notFound)
app.use(errorHandler)
//run server
const PORT = process.env.PORT
app.listen(PORT,()=>{
console.log("SERVER WORKING")
})