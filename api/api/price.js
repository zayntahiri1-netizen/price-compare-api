import axios from "axios";
import cheerio from "cheerio";

const stores = {
  ma: [
    {name:"Jumia", url:"https://www.jumia.ma/catalog/?q="},
    {name:"Marjane", url:"https://www.marjane.ma/catalogsearch/result/?q="},
    {name:"Electroplanet", url:"https://www.electroplanet.ma/search?q="},
    {name:"Carrefour", url:"https://www.carrefour.ma/catalogsearch/result/?q="},
    {name:"Microchoix", url:"https://www.microchoix.ma/search?q="}
  ],
  dz: [
    {name:"Jumia", url:"https://www.jumia.dz/catalog/?q="},
    {name:"Ouedkniss", url:"https://www.ouedkniss.com/annonces?keywords="},
    {name:"Electro DZ", url:"https://www.electrodz.com/search?q="},
    {name:"Batolis", url:"https://www.batolis.com/search?q="},
    {name:"Carrefour DZ", url:"https://www.carrefour.dz/catalogsearch/result/?q="}
  ],
  tn: [
    {name:"Jumia", url:"https://www.jumia.com.tn/catalog/?q="},
    {name:"Tunisianet", url:"https://www.tunisianet.com.tn/recherche?controller=search&s="},
    {name:"MyTek", url:"https://www.mytek.tn/recherche?controller=search&s="},
    {name:"ElectroTunisie", url:"https://www.electrotunisie.com/search?q="},
    {name:"Carrefour TN", url:"https://www.carrefour.tn/search?q="}
  ],
  eg: [
    {name:"Amazon", url:"https://www.amazon.eg/s?k="},
    {name:"Jumia", url:"https://www.jumia.com.eg/catalog/?q="},
    {name:"Souq", url:"https://egypt.souq.com/eg-en/search?q="},
    {name:"Carrefour EG", url:"https://www.carrefour.com.eg/search?q="},
    {name:"Spinneys", url:"https://www.spinneys.com.eg/search?q="}
  ],
  sa: [
    {name:"Amazon", url:"https://www.amazon.sa/s?k="},
    {name:"Noon", url:"https://www.noon.com/saudi-en/search?q="},
    {name:"Jarir", url:"https://www.jarir.com/catalogsearch/result/?q="},
    {name:"Extra", url:"https://www.extra.com/en-sa/search?q="},
    {name:"Carrefour SA", url:"https://www.carrefourksa.com/search?q="}
  ],
  ae: [
    {name:"Amazon", url:"https://www.amazon.ae/s?k="},
    {name:"Noon", url:"https://www.noon.com/uae-en/search?q="},
    {name:"Carrefour AE", url:"https://www.carrefouruae.com/mafuaen/search?text="},
    {name:"Sharaf DG", url:"https://www.sharafdg.com/search?q="},
    {name:"Lulu AE", url:"https://www.luluhypermarket.com/en-ae/search?q="}
  ],
  kw: [
    {name:"Xcite", url:"https://www.xcite.com/search?q="},
    {name:"Carrefour KW", url:"https://www.carrefourkuwait.com/kw-en/search?text="},
    {name:"Lulu KW", url:"https://www.luluhypermarket.com/en-kw/search?q="},
    {name:"Best Al-Yousifi", url:"https://www.bestyousifi.com.kw/search?q="},
    {name:"Techno", url:"https://www.technokuwait.com/search?q="}
  ],
  qa: [
    {name:"Carrefour QA", url:"https://www.carrefourqatar.com/qa-en/search?text="},
    {name:"Lulu QA", url:"https://www.luluhypermarket.com/en-qa/search?q="},
    {name:"Jumia QA", url:"https://www.jumia.com.qa/catalog/?q="},
    {name:"Jarir QA", url:"https://www.jarir.com/catalogsearch/result/?q="},
    {name:"Salla", url:"https://www.salla.qa/search?q="}
  ],
  bh: [
    {name:"Lulu BH", url:"https://www.luluhypermarket.com/en-bh/search?q="},
    {name:"Carrefour BH", url:"https://www.carrefourbahrain.com/bh-en/search?text="},
    {name:"Xcite BH", url:"https://www.xcite.com/bh/search?q="},
    {name:"Bahrain Electronics", url:"https://www.bahrain-electronics.com/search?q="},
    {name:"Jarir BH", url:"https://www.jarir.com/catalogsearch/result/?q="}
  ],
  om: [
    {name:"Lulu OM", url:"https://www.luluhypermarket.com/en-om/search?q="},
    {name:"Carrefour OM", url:"https://www.carrefouroman.com/om-en/search?text="},
    {name:"Sharaf DG OM", url:"https://www.sharafdg.com/om-en/search?q="},
    {name:"Al Fair OM", url:"https://www.alfair.com/om/search?q="},
    {name:"Extra OM", url:"https://www.extra.com/en-om/search?q="}
  ],
  iq: [
    {name:"OpenSooq", url:"https://iq.opensooq.com/ar/search?term="},
    {name:"Miswag", url:"https://miswag.me/search?q="},
    {name:"Babilon", url:"https://www.babilon.com.iq/search?q="},
    {name:"Carrefour IQ", url:"https://www.carrefouriq.com/search?q="},
    {name:"Jarir IQ", url:"https://www.jarir.com/catalogsearch/result/?q="}
  ],
  jo: [
    {name:"Carrefour JO", url:"https://www.carrefourjo.com/jo-en/search?text="},
    {name:"Souq JO", url:"https://jo.souq.com/jo-en/search?q="},
    {name:"Jarir JO", url:"https://www.jarir.com/catalogsearch/result/?q="},
    {name:"Lulu JO", url:"https://www.luluhypermarket.com/en-jo/search?q="},
    {name:"Techno JO", url:"https://www.technojo.com/search?q="}
  ],
  lb: [
    {name:"Carrefour LB", url:"https://www.carrefourlebanon.com/lb-en/search?text="},
    {name:"Spinneys LB", url:"https://www.spinneyslebanon.com/catalogsearch/result/?q="},
    {name:"Lulu LB", url:"https://www.luluhypermarket.com/en-lb/search?q="},
    {name:"ABC LB", url:"https://www.abc.com.lb/search?q="},
    {name:"Techno LB", url:"https://www.techno-lb.com/search?q="}
  ],
  ly: [
    {name:"Jumia LY", url:"https://www.jumia.ly/catalog/?q="},
    {name:"Libyana Market", url:"https://www.libyanamarket.com/search?q="},
    {name:"Carrefour LY", url:"https://www.carrefour.ly/catalogsearch/result/?q="},
    {name:"Techno LY", url:"https://www.techno.ly/search?q="},
    {name:"Electro LY", url:"https://www.electro.ly/search?q="}
  ],
  sd: [
    {name:"Souq SD", url:"https://sd.souq.com/sd-en/search?q="},
    {name:"Sudani Mall", url:"https://www.sudanistore.com/search?q="},
    {name:"Carrefour SD", url:"https://www.carrefour.sd/catalogsearch/result/?q="},
    {name:"Jumia SD", url:"https://www.jumia.sd/catalog/?q="},
    {name:"Techno SD", url:"https://www.techno.sd/search?q="}
  ],
  ps: [
    {name:"Souq PS", url:"https://ps.souq.com/ps-en/search?q="},
    {name:"Wadi PS", url:"https://wadi.ps/search?q="},
    {name:"Carrefour PS", url:"https://www.carrefour.ps/search?q="},
    {name:"Techno PS", url:"https://www.techno.ps/search?q="},
    {name:"Palestine Mall", url:"https://www.palestinemall.com/search?q="}
  ],
  sy: [
    {name:"Souq SY", url:"https://sy.souq.com/sy-en/search?q="},
    {name:"SyriaShop", url:"https://www.syriashop.com/search?q="},
    {name:"Carrefour SY", url:"https://www.carrefouresyria.com/search?q="},
    {name:"Techno SY", url:"https://www.techno.sy/search?q="},
    {name:"Electro SY", url:"https://www.electro.sy/search?q="}
  ],
  ye: [
    {name:"Souq YE", url:"https://ye.souq.com/ye-en/search?q="},
    {name:"YemenMarket", url:"https://www.yemenmarket.com/search?q="},
    {name:"Carrefour YE", url:"https://www.carrefourye.com/search?q="},
    {name:"Techno YE", url:"https://www.techno.ye/search?q="},
    {name:"Electro YE", url:"https://www.electro.ye/search?q="}
  ],
  mr: [
    {name:"Jumia MR", url:"https://www.jumia.mr/catalog/?q="},
    {name:"Carrefour MR", url:"https://www.carrefour.mr/catalogsearch/result/?q="},
    {name:"Techno MR", url:"https://www.techno.mr/search?q="},
    {name:"Electro MR", url:"https://www.electro.mr/search?q="},
    {name:"Market MR", url:"https://www.market.mr/search?q="}
  ],
  so: [
    {name:"SomMart", url:"https://www.sommart.com/search?q="},
    {name:"Carrefour SO", url:"https://www.carrefour.so/search?q="},
    {name:"Techno SO", url:"https://www.techno.so/search?q="},
    {name:"Electro SO", url:"https://www.electro.so/search?q="},
    {name:"Market SO", url:"https://www.market.so/search?q="}
  ],
  dj: [
    {name:"DjiboutiShop", url:"https://www.djiboutishop.com/search?q="},
    {name:"Techno DJ", url:"https://www.techno.dj/search?q="},
    {name:"Electro DJ", url:"https://www.electro.dj/search?q="},
    {name:"Carrefour DJ", url:"https://www.carrefour.dj/search?q="},
    {name:"Market DJ", url:"https://www.market.dj/search?q="}
  ],
  km: [
    {name:"ComoresMarket", url:"https://www.comoresmarket.com/search?q="},
    {name:"Techno KM", url:"https://www.techno.km/search?q="},
    {name:"Electro KM", url:"https://www.electro.km/search?q="},
    {name:"Market KM", url:"https://www.market.km/search?q="},
    {name:"Carrefour KM", url:"https://www.carrefour.km/search?q="}
  ]
};

export default async function handler(req,res){
  const {q,country}=req.query;
  if(!q || !country) return res.status(400).json([]);
  const list=stores[country]||[];
  let results=[];
  for(const store of list){
    try{
      const {data}=await axios.get(store.url+encodeURIComponent(q), {headers:{"User-Agent":"Mozilla/5.0"}});
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
};
