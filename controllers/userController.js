import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function createUser(req,res){

        const hashPassword = bcrypt.hashSync(req.body.password,10)  //hash 10times

        const user = new User(
            {
                email :req.body.email,
                firstName :req.body.firstName,
                lastName :req.body.lastName,
                password : hashPassword
            } 
        )
        user.save().then(
            ()=>{
                res.json(
                    {
                        Message:"User created succecsfully"
                    }
                )
            }
        ).catch(
            ()=>{
                res.json(
                    {
                        Message:"User creation failed"
                    }
                )
            }
        )
}

export function loginUser(req,res){

    User.findOne(         //email ekt samana user kenek innwd kyl balnw
        {
            email : req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){   //user kenek na
                res.json(
                    {
                        message:"User not found"
                    }
                )
            }
            else{
                const isPasswordMatching = bcrypt.compareSync(req.body.password,user.password) 
                //user.password kynne dB eke tyena pwd eka

                if(isPasswordMatching){

                    const token = jwt.sign(
                        {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified
                        },
                        process.env.JWT  //this is the key
                    )

                    res.json(
                        {
                            message:"Login successfull",
                            token:token
                        }
                    )
                }else{
                    res.status(401).json({
                        message:"Invalid password"
                    })
                }
            }
        }
    )

}


export function getUser(req,res){
        User.find().then(
            (users)=>{
                res.json(
                    users
                )
            }
        ).catch(
            ()=>{

            }
        )     
}

export function deleteUser(req,res){
        console.log("Delete request received")    
}

export function updateUser(req,res){
        console.log("Put request received")    
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role != "admin"){
        return;
    }
    return true;
}

export function isCustomer(req){
    if(req.user == null){
        return false
    }
    if(req.user.role != "user"){
        return false
    }

    return true;
}