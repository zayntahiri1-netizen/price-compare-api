import axios from "axios";
import cheerio from "cheerio";

export async function scrapeStore(store, query){
  try{
    const {data}=await axios.get(
      store.url + encodeURIComponent(query),
      {headers:{ "User-Agent":"Mozilla/5.0" }}
    );

    const $=cheerio.load(data);
    let items=[];

    $("article,.product,.item").each((i,el)=>{
      if(i>=5) return false;

      items.push({
        title:$(el).find("h3,h2,.name").text().trim(),
        price:$(el).find(".price").text().trim(),
        image:$(el).find("img").attr("src"),
        link:$(el).find("a").attr("href"),
        store:store.name
      });
    });

    return items;

  }catch(e){
    return [];
  }
}
