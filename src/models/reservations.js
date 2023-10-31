const mongoose = require("mongoose");

const reservationSchema= new mongoose.Schema({
        firstname:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true,
            unique:true
        },
        date:{
            type:String,
            required:true,
            
        },
        hours:{
            type:Number,
            required:true
           
        },
        persons:{
            type:Number,
            required:true,
            
           
        }
    })



    const Reservation = new mongoose.model("Reservation",reservationSchema);
    module.exports=Reservation;
    
    




