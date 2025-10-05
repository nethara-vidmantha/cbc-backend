import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";

const app = express();

app.use(express.json()) //act like middle man
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization")
        if(token!= null){
            token =token.replace("Bearer ","")
            

            
            jwt.verify(token,"jwt-secret",      //decrypt the token
                (err,decoded)=>{    
                    if(decoded== null){
                        res.json({
                            message:"Invalid token please login agin"
                        })
                        return
                    }else{
                        req.user = decoded  //meya ilagat ywn nisa userge details tika ywnw
                    }
                }
            )  
        }
        next()
    }
)



const connectionString="mongodb+srv://admin:123@cluster0.sfeetsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(connectionString).then( 
    ()=>{
        console.log("Database connected successfully")
    }
).catch(
    ()=>{
        console.log("Database connection failed")
    }
) 

app.use("/users",userRouter) 
app.use("/products",productRouter)

app.listen(5000,
    ()=>{
    console.log("Server is running on port 5000");    
    }
);
