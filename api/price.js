export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    res.status(200).json({
      success: true,
      length: html.length
    });
  } catch (err) {
    res.status(500).json({
      error: "Fetch failed",
      details: err.message
    });
  }
}
