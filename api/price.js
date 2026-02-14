import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req,res){
  const {q,country}=req.query;
  if(!q || !country) return res.status(400).json([]);

  const stores={
    ma:[
      {name:"Jumia",url:"https://www.jumia.ma/catalog/?q="},
      {name:"Microchoix",url:"https://www.microchoix.ma/search?q="}
    ],
    dz:[
      {name:"Ouedkniss",url:"https://www.ouedkniss.com/annonces?keywords="}
    ]
  };

  const list=stores[country]||[];
  let results=[];

  await Promise.all(
    list.map(async(store)=>{
      try{
        const {data}=await axios.get(store.url+encodeURIComponent(q),{
          headers:{
            "User-Agent":"Mozilla/5.0",
            "Accept-Language":"en-US,en;q=0.9"
          },
          timeout:5000
        });

        const $=cheerio.load(data);

        $("article, .product, .item, .prd").each((i,el)=>{
          if(i>=5) return false;

          const title=$(el).find("h3,h2,.name").text().trim();
          const price=$(el).find(".price").text().trim();
          const img=$(el).find("img").attr("src");
          const linkRaw=$(el).find("a").attr("href");

          if(!title) return;

          const link=linkRaw?.startsWith("http")
            ? linkRaw
            : store.url+linkRaw;

          results.push({
            title,
            price,
            image:img,
            link,
            store:store.name
          });
        });

      }catch(e){
        console.log(store.name,"error:",e.message);
      }
    })
  );

  res.status(200).json(results);
}
