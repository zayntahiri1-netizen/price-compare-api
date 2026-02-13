export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const priceMatch = html.match(/\d+[.,]?\d*/);

    res.json({
      success: true,
      price: priceMatch ? priceMatch[0] : "Not found"
    });

  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
}
