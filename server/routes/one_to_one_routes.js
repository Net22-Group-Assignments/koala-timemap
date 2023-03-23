const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const PageService = require("../service/one_to_one_service");

const cache = apicache.middleware;
router
  .route("/pages/:pageId", cache("5 minutes"))
  .get(async (req, res) => {
    req.apicacheGroup = req.params.pageId;
    res.json(await PageService.RetrievePage(req.params.pageId));
  })
  .patch(async (req, res) => {
    apicache.clear();
    res.json(await PageService.UpdatePage(req.params.pageId, req.body));
  });

module.exports = router;
