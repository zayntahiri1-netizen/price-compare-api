// api/search.js
import axios from "axios";
import cheerio from "cheerio";
import stores from "./stores.js"; // قائمة المتاجر لكل دولة
import { getCheapest, sortByPrice } from "../utils/price.js";

export default async function handler(req, res) {
  const { q, country } = req.query;

  if (!q || !country) return res.status(400).json({ error: "Missing query or country" });

  const list = stores[country] || [];
  let results = [];

  for (const store of list) {
    try {
      const { data } = await axios.get(store.url + encodeURIComponent(q), {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const $ = cheerio.load(data);

      // جمع المنتجات من الصفحة
      $("article, .product, .item").each((i, el) => {
        if (i >= 5) return; // الحد الأقصى 5 منتجات لكل موقع

        const title = $(el).find("h3,h2,.name").text().trim();
        let price = $(el).find(".price").text().trim();
        const image = $(el).find("img").attr("src");
        const link = $(el).find("a").attr("href");

        // تنظيف السعر قبل تمريره للـ price.js
        if (price) {
          price = price.replace(/[^\d.,]/g, ""); // إزالة أي نصوص أو رموز غير الأرقام والنقاط والفواصل
          price = price.replace(",", ".");       // تحويل الفاصلة العشرية إلى نقطة إذا كانت موجودة
        }

        if (title && price) {
          results.push({ title, price, image, link, store: store.name });
        }
      });
    } catch (e) {
      console.log(`${store.name} failed: ${e.message}`);
    }
  }

  // ترتيب النتائج حسب السعر واختيار الأرخص
  const sortedProducts = sortByPrice(results);
  const cheapest = getCheapest(results);

  res.status(200).json({ all: sortedProducts, cheapest });
}
