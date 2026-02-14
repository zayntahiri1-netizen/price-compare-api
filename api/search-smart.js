// api/search-smart.js
import axios from "axios";
import cheerio from "cheerio";

/*
  API: /api/search-smart?q=iphone&country=ma
  Requires Vercel env: SERPAPI_KEY
*/

const storesByCountry = {
  ma: ["jumia.ma","marjane.ma","electroplanet.ma","carrefour.ma","microchoix.ma"],
  dz: ["jumia.dz","ouedkniss.com","electrodz.com","batolis.com","carrefour.dz"],
  tn: ["jumia.com.tn","tunisianet.com.tn","mytek.tn","electrotunisie.com","carrefour.tn"],
  eg: ["amazon.eg","jumia.com.eg","egypt.souq.com","carrefour.com.eg","spinneys.com.eg"],
  sa: ["amazon.sa","noon.com","jarir.com","extra.com","carrefourksa.com"],
  ae: ["amazon.ae","noon.com","carrefouruae.com","sharafdg.com","luluhypermarket.com"],
  // أضف بقية الدول حسب حاجتك...
};

function normalizePriceText(txt){
  if(!txt) return null;
  const s = String(txt).replace(/\s+/g,"").replace(/[,٬]/g, '.').replace(/[^\d.]/g,"");
  if(!s) return null;
  const n = parseFloat(s);
  return isFinite(n) ? n : null;
}

function resolveUrl(base, url){
  if(!url) return null;
  try {
    if(url.startsWith('//')) return 'https:' + url;
    if(url.startsWith('http')) return url;
    return new URL(url, base).href;
  } catch(e){ return url; }
}

async function fetchAndParseProduct(url, storeDomain){
  try{
    const {data} = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      timeout: 10000
    });
    const $ = cheerio.load(data);
    // Try JSON-LD first
    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || "";
    let image = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || "";
    // Try common selectors for price
    let priceText = $('.price, .product-price, .price-current, .a-price-whole, .offer-price, [itemprop="price"]').first().text().trim();
    if(!priceText){
      // check meta price
      priceText = $('meta[itemprop="price"]').attr('content') || "";
    }
    const price = normalizePriceText(priceText);
    return { title: title.trim(), priceRaw: priceText, price, image: resolveUrl(url, image), link: url, store: storeDomain };
  }catch(err){
    return null;
  }
}

export default async function handler(req, res){
  try{
    const q = (req.query.q || "").trim();
    const country = (req.query.country || "").trim().toLowerCase();
    if(!q || !country) return res.status(400).json({ error: "missing q or country" });

    const serpKey = process.env.SERPAPI_KEY;
    if(!serpKey) return res.status(500).json({ error: "SERPAPI_KEY not configured on server" });

    const allowedDomains = storesByCountry[country] || [];

    // 1) Call SerpAPI to get Google organic results
    const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpKey}&num=10&hl=ar`;
    const serpRes = await axios.get(serpUrl, { timeout: 10000 });
    const organic = (serpRes.data && serpRes.data.organic_results) || [];

    // 2) Filter results to our allowed stores for the country
    const candidates = organic
      .map(o => ({ link: o.link || o.url || o.source, title: o.title || o.snippet }))
      .filter(item => {
        if(!item.link) return false;
        try {
          const host = new URL(item.link).hostname.replace('www.','').toLowerCase();
          return allowedDomains.some(d => host.includes(d.replace('www.','')));
        } catch(e){ return false; }
      });

    // If there are not enough candidates, also add store search URLs directly (fallback)
    if(candidates.length < 5){
      for(const d of allowedDomains){
        const scheme = d.includes('amazon') ? 'https://www.' : 'https://';
        const searchUrl = `${scheme}${d}/s?k=${encodeURIComponent(q)}`; // common pattern for amazon-like sites
        candidates.push({ link: searchUrl, title: `بحث في ${d}` });
      }
    }

    // 3) Visit each candidate (limit concurrency)
    const results = [];
    const limit = 6;
    let i = 0;
    while(i < candidates.length && results.length < 30){
      const batch = candidates.slice(i, i+limit);
      const prom = batch.map(c => fetchAndParseProduct(c.link, new URL(c.link).hostname.replace('www.','')));
      const batchRes = await Promise.all(prom);
      for(const r of batchRes) if(r && r.price) results.push(r);
      i += limit;
    }

    // 4) dedupe by link or title, sort by price asc
    const seen = new Set();
    const unique = results.filter(r => {
      const k = (r.link||r.title).slice(0,300);
      if(seen.has(k)) return false;
      seen.add(k);
      return true;
    }).sort((a,b) => a.price - b.price);

    return res.status(200).json({ results: unique, query: q, country });
  }catch(err){
    console.error("search-smart error:", err.message || err);
    return res.status(500).json({ error: "server error", details: err.message || String(err) });
  }
}
