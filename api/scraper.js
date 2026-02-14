import axios from "axios";
import cheerio from "cheerio";
import {normalizeProduct} from "../utils/parser.js";

export async function scrapeStore(store, query){
  try{
    const {data} = await axios.get(store.url + encodeURIComponent(query), {headers:{"User-Agent":"Mozilla/5.0"}});
    const $ = cheerio.load(data);
    let results = [];

    $("article, .product, .item").each((i, el) => {
      if(i >= 5) return false; // فقط أول 5 منتجات
      const title = $(el).find("h3,h2,.name").text().trim();
      const price = $(el).find(".price").text().trim();
      const image = $(el).find("img").attr("src") || "";
      const link = $(el).find("a").attr("href") || "";
      if(title) results.push(normalizeProduct({title, price, image, link, store: store.name}));
    });
    return results;
  }catch(e){
    console.log(`${store.name} failed: ${e.message}`);
    return [];
  }
}
