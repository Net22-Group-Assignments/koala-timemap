const express = require("express");
const router = express.Router();
// const apicache = require("apicache");
const PageService = require("../service/one_to_one_service");

// const cache = apicache.middleware;
router
  .route(
    "/pages/:pageId" //cache("5 minutes")
  )
  .get(async (req, res, next) => {
    //req.apicacheGroup = req.params.pageId;
    try {
      res.json(await PageService.retrievePage(req.params.pageId, req.token));
    } catch (e) {
      next(e);
    }
  })
  .patch(async (req, res, next) => {
    //apicache.clear();
    try {
      res.json(
        await PageService.updatePage(req.params.pageId, req.body, req.token)
      );
    } catch (e) {
      next(e);
    }
  });

module.exports = router;
