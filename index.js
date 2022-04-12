const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var _ = require('lodash');
const alert=require('alert')
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/Sparks");

const alertMessage="Insufficient balance";

const customerSchema = new mongoose.Schema({
    customerId:{
       type:String,
       required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
       
    },
    mobile: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true,
       
    }
     
});



const transactionSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true,
       
    },
    amount: {
        type: Number,
        required: true
    }
     
});

const Customers = new mongoose.model("Customers", customerSchema);
const Transactions = new mongoose.model("Transactions", transactionSchema);

const customer1=new Customers({
    customerId:"C001",
    name:"Praanjala Kamath",
    email:"praanjala@gmail.com",
    mobile:9447893371,
    balance:100000
});
const customer2=new Customers({
    customerId:"C002",
    name:"Prajwal Kamath",
    email:"prajwal@gmail.com",
    mobile:8296702707,
    balance:50500
});
const customer3=new Customers({
    customerId:"C003",
    name:"Dev Kamath",
    email:"devkamath@gmail.com",
    mobile:9972416004,
    balance:95000
});
const customer4=new Customers({
    customerId:"C004",
    name:"Prathiksha",
    email:"prathiksha@gmail.com",
    mobile:8050821890,
    balance:62000
});

const customer5=new Customers({
    customerId:"C005",
    name:"Amulya",
    email:"ammu@gmail.com",
    mobile:997242726,
    balance:50000
});

const customer6=new Customers({
    customerId:"C006",
    name:"Adithi",
    email:"adithinayak@gmail.com",
    mobile:9447811271,
    balance:12000
});

const customer7=new Customers({
    customerId:"C007",
    name:"Dithya",
    email:"dithya@gmail.com",
    mobile:9217893371,
    balance:15000
});
const customer8=new Customers({
    customerId:"C008",
    name:"Sonu",
    email:"shri@gmail.com",
    mobile:9123443371,
    balance:12000
});

const customer9=new Customers({
    customerId:"C009",
    name:"Nidhi",
    email:"shrinidhi@gmail.com",
    mobile:8447897002,
    balance:45000
});

const customer10=new Customers({
    customerId:"C010",
    name:"Aira",
    email:"airaa@gmail.com",
    mobile:9447805080,
    balance:55000
});

// Customers.insertMany([customer1,customer2,customer3,customer4,customer5,customer6,customer7,customer8,customer9,customer10, ], function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("inserted");
//     }
// })



app.get("/", function (req, res) {
    res.sendFile(__dirname+"/Home.html");
});

app.get("/customers", function (req, res) {
   Customers.find({}, function(err, allcustomers){
       if(err){
           console.log(err);
       } else {
           res.render("Customers",{customers: allcustomers})
       }
   })
});


app.get("/customers/:individualcustomer", function (req, res) {

  const requestedCustomer=req.params.individualcustomer;
 
  const var1=_.lowerCase(requestedCustomer)
  
    Customers.find({}, function(err, allcustomers){
        if(err){
            console.log(err);
        } else {
           
           allcustomers.forEach(function(cust){
              
               const var2=_.lowerCase(cust.name)
              if(var1==var2){
                  res.render("EachCustomer",{
                    name:cust.name,
                    email:cust.email,
                    mobile:cust.mobile,
                    balance:cust.balance,
                    message:"",

                    display:"none"
                })
              }
           })
        }
    })
   
});

app.post("/customers/:individualcustomer",async(req,res)=>{

    try {

        const custid=req.body.custid;
        const rec=req.body.recipient;
        const amt=req.body.amount;
    
        const cust=await Customers.findOne({customerId:custid})
        const cust2=await Customers.findOne({name:rec})
        if(amt>=cust.balance)
        {
            
            res.render("EachCustomer",{
                name:cust.name,
                email:cust.email,
                mobile:cust.mobile,
                balance:cust.balance,
                message:alertMessage,
                display:"block"
                
            })
        }
        else{

            const transaction=new Transactions({
                sender:cust.name,
                recipient:rec,
                amount:amt
               });
               const sendernewAmount=cust.balance-amt;
               const recipientnewAmount=Number(cust2.balance)+Number(amt);
              
               Customers.updateOne({customerId:custid},{balance:sendernewAmount},function(err){
                   if(err){
                       console.log(err);
                   }else{
                       console.log("updated");
                   }
               });
               Customers.updateOne({name:rec},{balance:recipientnewAmount},function(err){
                 if(err){
                     console.log(err);
                 }else{
                     console.log("updated");
                 }
             });
               transaction.save();
               res.redirect("/customers");
        }
       
    } catch (error) {
        console.log(error);
        
    }
})

app.get("/transactions", function (req, res) {
    Transactions.find({}, function(err, alltransactions){
        if(err){
            console.log(err);
        } else {
            res.render("Transactions",{transactions: alltransactions})
        }
    })
});


app.listen(3000, function () {
    console.log("server running at 3000");
})

