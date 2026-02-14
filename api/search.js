import {stores} from "./stores.js";
import {scrapeStore} from "./scraper.js";

export default async function handler(req, res){
  const {q, country} = req.query;
  if(!q || !country) return res.status(400).json([]);

  const list = stores[country] || [];
  let results = [];

  for(const store of list){
    const storeResults = await scrapeStore(store, q);
    results.push(...storeResults);
  }

  // ترتيب حسب السعر
  results.sort((a,b)=> (a.price || 0) - (b.price || 0));

  res.status(200).json(results);
};
