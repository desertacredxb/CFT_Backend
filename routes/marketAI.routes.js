const express = require("express");
const Parser = require("rss-parser");
const router = express.Router();
const parser = new Parser({ timeout: 7000, headers: { "User-Agent": "MasterTraderMarketInfo/1.0" } });
let cache = null;

router.get("/public-news", async (_req, res) => {
  if (cache && Date.now() - cache.cachedAt < 300000) return res.json(cache.data);
  try {
    const feed = await parser.parseURL("https://www.sebi.gov.in/sebirss.xml");
    const items = (feed.items || []).filter(item => {
      try {
        const url = new URL(item.link);
        return item.title && url.protocol === "https:" && (url.hostname === "sebi.gov.in" || url.hostname.endsWith(".sebi.gov.in")) && Number.isFinite(Date.parse(item.isoDate || item.pubDate));
      } catch { return false; }
    }).slice(0, 12).map(item => ({
      title: item.title.trim(),
      url: item.link,
      source: "SEBI",
      publishedAt: new Date(item.isoDate || item.pubDate).toISOString(),
    }));
    if (!items.length) throw new Error("No valid items in official feed");
    const data = { status: "available", updatedAt: new Date().toISOString(), items };
    cache = { cachedAt: Date.now(), data };
    return res.json(data);
  } catch {
    return res.status(503).json({ status: "unavailable", updatedAt: null, items: [] });
  }
});
module.exports = router;
