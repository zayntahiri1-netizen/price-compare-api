// api/scraper.js
import axios from "axios";
import { parsePrice } from "../utils/parser.js";

// جلب المنتجات من SerpAPI
export async function fetchProducts(query, country) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error("SERPAPI_KEY غير مضبوط في Environment Variables");

  try {
    // إعداد رابط SerpAPI (Google Shopping)
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&engine=google_shopping&gl=${country.toUpperCase()}&api_key=${apiKey}`;

    const { data } = await axios.get(url);
    const products = [];

    // بيانات المنتجات من SerpAPI
    if (data.shopping_results) {
      for (let i = 0; i < Math.min(5, data.shopping_results.length); i++) {
        const item = data.shopping_results[i];
        products.push({
          title: item.title || "",
          price: parsePrice(item.price || item.raw_price || ""),
          link: item.link || "",
          image: item.thumbnail || "",
          store: item.source || "Unknown",
        });
      }
    }

    return products;
  } catch (error) {
    console.error("خطأ في fetchProducts:", error.message);
    return [];
  }
}
