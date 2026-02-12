const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // مهم: يسمح لأي موقع بالوصول للسيرفر

const PORT = process.env.PORT || 3000;

app.get("/search", (req,res)=>{
  const q = req.query.q;
  const country = req.query.country;

  // بيانات تجريبية مؤقتة
  res.json([
    {name:"Laptop HP",price:3500,store:"Demo Store",link:"#",image:"https://via.placeholder.com/150"},
    {name:"Laptop Dell",price:3200,store:"Demo Store",link:"#",image:"https://via.placeholder.com/150"}
  ]);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
