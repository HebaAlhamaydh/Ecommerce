const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require("dotenv");
const userRoute=require("./routes/user");
const authRoute=require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
 const stripeRoute = require("./routes/stripe");
// const cors = require("cors");
dotenv.config();

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{console.log("dbconnection Sucess")})
.catch((err)=>{console.log(err);});

//to take json object from request(to send any json file from forontend)
// app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5080,()=>{
    console.log("Backend server is running!");
});