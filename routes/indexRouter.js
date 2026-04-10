import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index", {
    title: "File Uploader",
  });
});

export default indexRouter;
