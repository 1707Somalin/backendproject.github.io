const mongoose=require("mongoose");


// mongoose.connect("mongodb://localhost:27017/registration")
//     // useNewUrlParser:true,
//     // useUnifiedTopology:true
//     // useFindAndModify:false
// .then((success)=> console.log(`Connection successful`))
// .catch((err)=>console.log(`Connection failed`));


// const { MongoClient } = require('mongodb')

// // Create Instance of MongoClient for mongodb
// const client = new MongoClient('mongodb://localhost:27017')

// // Connect to database
// client.connect()
//     .then(() => console.log('Connected Successfully'))
//     .catch(error => console.log('Failed to connect', error))

// const connectDb=()=>{
//   const url = "mongodb://127.0.0.1/registration_db";
 
//   try {
//     mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
//   const dbConnection = mongoose.connection;
//   dbConnection.once("open", (_) => {
//     console.log(`Database connected: ${url}`);
//   });
 
//   dbConnection.on("error", (err) => {
//     console.error(`connection error: ${err}`);
//   });
//   return;
// }



// ***********************************************************

mongoose.set("strictQuery",false);
const connectDb = async()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);

    
  } catch (error) {
    console.log(error);
    process.exit(1);
    
  }

};
module.exports=connectDb;