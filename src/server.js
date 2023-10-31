require('dotenv').config();
const express=require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const connectDb=require('./db/conn');
connectDb();


const Register = require("./models/registers");
const Reservation = require("./models/reservations");
const { json } =require("express");


// const bodyParser= require("body-parser");

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
// app.use(bodyParser.urlencoded({ extended: true}));

const port=process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");


app.use(express.static(static_path ));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


// console.log(process.env.SECRET_KEY);
app.get("/",(req,res)=>{
    res.render("index");

});
app.get("/events", auth, (req,res)=>{
    // without login , user cannot go to reservation page 
    // when authorised user logins and checks out the events , I get the secret key from the cookie 
    // when unauthorised user checks out the event list , I get undefined as my secret key 
    // console.log(`this is the cookie awesome ${req.cookies.jwt} `);
    res.render("events");

});

app.get('/register' , (req,res)=>{
    res.render("register");

})
app.get('/login' , (req,res)=>{
    res.render("login");

})
app.get('/logout' , auth , async (req,res)=>{
   try {
    // without login logout page cant be open 
    console.log(req.user);


    // for single logout 
    // req.user.tokens = req.user.tokens.filter((currentElement)=>{

        // return currentElement.token!==req.token
        //req.token -- latest token

    // })


    // for logout from all devices 
    req.user.tokens=[];


    res.clearCookie("jwt"); // the cookie is cleared and logout becomes succesful 
    console.log("logout successful");
    await req.user.save();
    res.render("login");
    
   } catch (error) {
    res.status(500).send(error);
    
   }

})
app.get('/reservation' ,auth, (req,res)=>{
    res.render("reservation");

})

// creating new user in database 


app.post("/register", async (req,res)=>{
    
       try {
      const password= req.body.password;
      const cpassword= req.body.confirmpassword;
      if (password===cpassword){
        // getting the data 
        const registerUser= new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword
        })

       

        // Concept of middleware 
        console.log("the success part" + registerUser);
       const token = await registerUser.generateAuthToken();
       console.log("the token part" + token);

    //    setting cookies 
    res.cookie("jwt" , token,{
        expires:new Date(Date.now() + 900000),
        httpOnly:true
    });


    // const cookies = cookie;
    // console.log( "Cookie is : " + cookies);



        // password hash 



        // saving into database 




        const registered= await registerUser.save();
        res.status(201).render('login');

      }else{
        res.send("Password  is not matching, Please check again");
        
      }
        
       } catch (error) {
        res.status(400).send(error);
        
       }   
   

})


// login check 


app.post("/login", async (req,res)=>{
    try {
        const firstname=req.body.firstname;
        const email = req.body.email;
        const password = req.body.password;
        // console.log(`name is ${firstname}, email is ${email} and password is ${password}`);

        const useremail=  await Register.findOne({email:email});
        // res.send(useremail);
        // console.log(useremail)


        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part " + token);
        

        // storing cookies 
        res.cookie("jwt" , token,{
            expires:new Date(Date.now() + 900000),
            httpOnly:true,
            // secure:true 
        });
       

    

        if(isMatch){
            res.status(201).render("reservation");
        }
        else{
            res.send("invalid login details");
        }

        
    } catch (error) {
        res.status(400).send("invalid login details");
        
    }

})




// Hashing 

// const securePassword = async (password)=>{
//     const passwordHash= await bcrypt.hash(password, 10);
//     console.log(passwordHash);
//     const passwordMatch= await bcrypt.compare("sumo", passwordHash); //login password, registrn password
    
//     console.log(passwordMatch);
// }
// securePassword("soma");




// creating token 







app.post("/reservation", async (req,res)=>{
    try {
        const firstname=req.body.firstname;
        const phone = req.body.phone;
        const userphone=  await Register.findOne({phone:phone});
        if(userphone.phone==phone && userphone.firstname==firstname ){
            const reservation=  new Reservation({
                firstname: req.body.firstname,
                phone: req.body.phone,
                date: req.body.date,
                hours: req.body.hours,
                persons: req.body.persons
                
            })
            console.log( reservation);
            const reserVed= await reservation.save();
            res.status(201).render('index');
            
            
        

        }
        else{
            res.send("Invalid details");
        }


        
    } catch (error) {
        res.status(400).send("invalid login details");
        
    }
   


})




app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
});