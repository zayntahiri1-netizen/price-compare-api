import axios from "axios";
import { parsePrice } from "../utils/parser.js";
import { sortByPrice, getCheapest } from "../utils/price.js";
import { stores } from "./stores.js";

// مفتاح SerpAPI من Environment Variables
const SERPAPI_KEY = process.env.SERPAPI_KEY;

// دالة البحث في SerpAPI Google Shopping
async function searchProductSerp(query, storeUrl) {
  try {
    const res = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: query,
        gl: "ma", // يمكنك تغييره حسب الدولة
        google_domain: "google.com",
        hl: "ar",
        api_key: SERPAPI_KEY,
      },
    });

    // جلب المنتجات من النتائج
    const items = res.data.shopping_results || [];
    return items.map(item => ({
      title: item.title,
      price: parsePrice(item.price || item.raw_price || ""),
      link: item.link,
      image: item.thumbnail,
      store: item.merchant_name || storeUrl
    }));
  } catch (err) {
    console.log("SerpAPI failed:", err.message);
    return [];
  }
}

// نقطة دخول API
export default async function handler(req, res) {
  const { q, country } = req.query;
  if (!q || !country) return res.status(400).json([]);

  const countryStores = stores[country] || [];
  let allResults = [];

  // البحث في كل متجر عبر SerpAPI
  for (const store of countryStores) {
    const results = await searchProductSerp(q, store.name);
    allResults = allResults.concat(results.slice(0, 5)); // أقصى 5 منتجات لكل متجر
  }

  // ترتيب واختيار الأرخص
  const sorted = sortByPrice(allResults);
  const cheapest = getCheapest(allResults);

  res.status(200).json({ all: sorted, cheapest });
}
