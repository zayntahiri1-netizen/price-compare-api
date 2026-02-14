import axios from "axios";
import cheerio from "cheerio";

const stores={
  ma:[
    {
      name:"Jumia",
      type:"html",
      url:q=>`https://www.jumia.ma/catalog/?q=${q}`,
      parser:($,store)=>{
        let arr=[];
        $(".prd").each((i,el)=>{
          if(i>=5) return false;
          arr.push({
            title:$(el).find(".name").text().trim(),
            price:$(el).find(".prc").text().trim(),
            image:$(el).find("img").attr("data-src"),
            link:"https://www.jumia.ma"+$(el).find("a").attr("href"),
            store:store.name
          });
        });
        return arr;
      }
    },

    {
      name:"Microchoix",
      type:"html",
      url:q=>`https://www.microchoix.ma/search?q=${q}`,
      parser:($,store)=>{
        let arr=[];
        $(".product").each((i,el)=>{
          if(i>=5) return false;
          arr.push({
            title:$(el).find("h3").text().trim(),
            price:$(el).find(".price").text().trim(),
            image:$(el).find("img").attr("src"),
            link:$(el).find("a").attr("href"),
            store:store.name
          });
        });
        return arr;
      }
    }
  ]
};

async function fetchHTML(store,q){
  try{
    const {data}=await axios.get(store.url(q),{
      headers:{ "User-Agent":"Mozilla/5.0" },
      timeout:6000
    });
    const $=cheerio.load(data);
    return store.parser($,store);
  }catch{
    return [];
  }
}

export default async function handler(req,res){
  const {q,country}=req.query;
  if(!q || !country) return res.json([]);

  const countryStores=stores[country]||[];

  const tasks=countryStores.map(store=>fetchHTML(store,q));

  const results=(await Promise.all(tasks)).flat();

  res.json({
    success:true,
    count:results.length,
    results
  });
}
