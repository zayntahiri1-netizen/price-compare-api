export default function handler(req, res) {

const { q, country } = req.query;

if(!q){
return res.status(400).json({error:"missing query"});
}

res.status(200).json([
{
name: q + " نسخة تجريبية",
price: 100,
image:"https://via.placeholder.com/200",
store:"متجر تجريبي",
link:"#"
}
]);

}
