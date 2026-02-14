import axios from "axios";
import cheerio from "cheerio";

const stores = {
  ma: [
    {name:"Jumia", url:"https://www.jumia.ma/catalog/?q="},
    {name:"Marjane", url:"https://www.marjane.ma/catalogsearch/result/?q="},
    {name:"Electroplanet", url:"https://www.electroplanet.ma/search?q="}
  ],
  dz: [
    {name:"Jumia", url:"https://www.jumia.dz/catalog/?q="},
    {name:"Ouedkniss", url:"https://www.ouedkniss.com/annonces?keywords="}
  ],
  tn: [
    {name:"Jumia", url:"https://www.jumia.com.tn/catalog/?q="},
    {name:"Tunisianet", url:"https://www.tunisianet.com.tn/recherche?controller=search&s="}
  ],
  eg: [
    {name:"Amazon", url:"https://www.amazon.eg/s?k="},
    {name:"Jumia", url:"https://www.jumia.com.eg/catalog/?q="},
    {name:"Souq", url:"https://egypt.souq.com/eg-en/search?q="}
  ],
  sa: [
    {name:"Amazon", url:"https://www.amazon.sa/s?k="},
    {name:"Noon", url:"https://www.noon.com/saudi-en/search?q="},
    {name:"Jarir", url:"https://www.jarir.com/catalogsearch/result/?q="}
  ],
  ae: [
    {name:"Amazon", url:"https://www.amazon.ae/s?k="},
    {name:"Noon", url:"https://www.noon.com/uae-en/search?q="},
    {name:"Carrefour", url:"https://www.carrefouruae.com/mafuaen/search?text="}
  ],
  kw: [
    {name:"Xcite", url:"https://www.xcite.com/search?q="},
    {name:"Carrefour", url:"https://www.carrefourkuwait.com/kw-en/search?text="}
  ],
  qa: [
    {name:"Carrefour", url:"https://www.carrefourqatar.com/qa-en/search?text="},
    {name:"Lulu", url:"https://www.luluhypermarket.com/en-qa/search?q="}
  ],
  bh: [
    {name:"Lulu", url:"https://www.luluhypermarket.com/en-bh/search?q="},
    {name:"Carrefour", url:"https://www.carrefourbahrain.com/bh-en/search?text="}
  ],
  om: [
    {name:"Lulu", url:"https://www.luluhypermarket.com/en-om/search?q="},
    {name:"Carrefour", url:"https://www.carrefouroman.com/om-en/search?text="}
  ],
  iq: [
    {name:"OpenSooq", url:"https://iq.opensooq.com/ar/search?term="},
    {name:"Miswag", url:"https://miswag.me/search?q="}
  ],
  jo: [
    {name:"Carrefour", url:"https://www.carrefourjo.com/jo-en/search?text="},
    {name:"Souq", url:"https://jo.souq.com/jo-en/search?q="}
  ],
  lb: [
    {name:"Carrefour", url:"https://www.carrefourlebanon.com/lb-en/search?text="},
    {name:"Spinneys", url:"https://www.spinneyslebanon.com/catalogsearch/result/?q="}
  ],
  ly: [
    {name:"Jumia", url:"https://www.jumia.ly/catalog/?q="},
    {name:"Libyana Market", url:"https://www.libyanamarket.com/search?q="}
  ],
  sd: [
    {name:"Souq", url:"https://sd.souq.com/sd-en/search?q="},
    {name:"Sudani Mall", url:"https://www.sudanistore.com/search?q="}
  ],
  ps: [
    {name:"Souq", url:"https://ps.souq.com/ps-en/search?q="},
    {name:"Wadi", url:"https://wadi.ps/search?q="}
  ],
  sy: [
    {name:"Souq", url:"https://sy.souq.com/sy-en/search?q="},
    {name:"SyriaShop", url:"https://www.syriashop.com/search?q="}
  ],
  ye: [
    {name:"Souq", url:"https://ye.souq.com/ye-en/search?q="},
    {name:"YemenMarket", url:"https://www.yemenmarket.com/search?q="}
  ],
  mr: [
    {name:"Jumia", url:"https://www.jumia.mr/catalog/?q="}
  ],
  so: [
    {name:"SomMart", url:"https://www.sommart.com/search?q="}
  ],
  dj: [
    {name:"DjiboutiShop", url:"https://www.djiboutishop.com/search?q="}
  ],
  km: [
    {name:"ComoresMarket", url:"https://www.comoresmarket.com/search?q="}
  ]
};

export default async function handler(req, res){
  const {q,country} = req.query;
  if(!q || !country){return res.status(400).json([]);}
  const list=stores[country]||[];
  let results=[];

  for(const store of list){
    try{
      const {data}=await axios.get(store.url+encodeURIComponent(q),{headers:{"User-Agent":"Mozilla/5.0"}});
      const $=cheerio.load(data);
      $("article, .product, .item").each((i,el)=>{
        if(i>5) return;
        const title=$(el).find("h3,h2,.name").text().trim();
        const price=$(el).find(".price").text().trim();
        const image=$(el).find("img").attr("src");
        const link=$(el).find("a").attr("href");
        if(title) results.push({title,price,image,link,store:store.name});
      });
    }catch(e){
      console.log(store.name+" failed", e.message);
    }
  }

  res.status(200).json(results);
}
