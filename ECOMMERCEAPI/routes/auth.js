const router=require("express").Router();
const User=require("../models/User");
var CryptoJS = require("crypto-js");
const jwt=require("jsonwebtoken");
//register
router.post("/register",async (req,res)=>
{    //from user frontend
    const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try{
        //save in db
        const savedUser= await newUser.save();
        res.status(201).json(savedUser);
      }catch(err){
       res.status(500).json(err);
      }
});
//login
router.post("/login",async (req,res)=>{
try{
    
    const user=await User.findOne({username:req.body.username});
    //if statement
    !user && res.status(401).json("Wrong credentails!")
    const hashedPassword=CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPassword=hashedPassword.toString(CryptoJS.enc.Utf8);
    originalPassword !==req.body.password && 
    res.status(401).json("Wrong credentails!");
 //after login i create jwt
 const accessToken=jwt.sign({
    id:user._id,
    isAdmin:user.isAdmin,
},
   process.env.JWT_SEC,
   {expiresIn:"3d"}
    );


    ///to hide password 
    const { password, ...others } = user._doc;
    res.status(200).json({...others,accessToken});
 }catch(err){
    res.status(500).json(err);
}
})


module.exports=router;