// تنظيف السعر واستخراج رقم صالح للمقارنة
export function parsePrice(priceString){

  if(!priceString) return null;

  let clean = priceString
    .replace(/,/g,"")
    .replace(/\s/g,"")
    .replace(/[^\d.]/g,"");

  const num = parseFloat(clean);

  if(isNaN(num)) return null;

  return num;
}


// استخراج العملة من النص
export function detectCurrency(priceString){

  if(!priceString) return "UNKNOWN";

  if(priceString.includes("د.م") || priceString.includes("MAD"))
    return "MAD";

  if(priceString.includes("SAR") || priceString.includes("ر.س"))
    return "SAR";

  if(priceString.includes("EGP") || priceString.includes("ج.م"))
    return "EGP";

  if(priceString.includes("$"))
    return "USD";

  if(priceString.includes("€"))
    return "EUR";

  return "UNKNOWN";
}


// توحيد النتيجة
export function normalizeProduct(item){

  return {
    title: item.title || "بدون اسم",
    price_raw: item.price || "",
    price: parsePrice(item.price),
    currency: detectCurrency(item.price),
    image: item.image || "",
    link: item.link || "",
    store: item.store || ""
  };
}
