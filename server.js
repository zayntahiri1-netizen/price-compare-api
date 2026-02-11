const express = require("express");
const app = express();

app.get("/search", (req,res)=>{
  const q = req.query.q;

  res.json([
    {name:"Laptop HP",price:3500,store:"Demo Store",link:"#",image:"https://via.placeholder.com/150"},
    {name:"Laptop Dell",price:3200,store:"Demo Store",link:"#",image:"https://via.placeholder.com/150"}
  ]);
});

app.listen(10000, ()=> console.log("Server running"));
