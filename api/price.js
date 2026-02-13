// api/price.js
export default async function handler(req, res) {
  // سماح CORS لأي موقع — مهم لعمل الطلب من بلوجر
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const q = req.query.q || '';
  const country = req.query.country || '';

  // تحقق بسيط
  if (!q || !country) {
    return res.status(400).json({ error: 'Missing q or country parameter' });
  }

  try {
    // ===== هنا يجب أن تكون منطق البحث الحقيقي (scraping/API) =====
    // الآن نرجع بيانات تجريبية لعرضها على الواجهة حتى تتأكد من الربط:
    const demo = [
      { name: `${q} - Model A (${country})`, price: 3500, priceRaw: '3500', store: 'DemoShop', link: '#', image: 'https://via.placeholder.com/400x300?text=Demo+A' },
      { name: `${q} - Model B (${country})`, price: 3200, priceRaw: '3200', store: 'DemoStore', link: '#', image: 'https://via.placeholder.com/400x300?text=Demo+B' },
      { name: `${q} - Model C (${country})`, price: 3700, priceRaw: '3700', store: 'ShopC', link: '#', image: 'https://via.placeholder.com/400x300?text=Demo+C' }
    ];

    // فرز حسب السعر رقمي
    demo.sort((a,b)=> parseFloat(a.price) - parseFloat(b.price));

    return res.status(200).json(demo);
  } catch (err) {
    console.error('API error', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
