import express from "express";
import path from "node:path";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./db/prisma.js";
import passport from "passport";
// import router(s)
import { CustomNotFoundError } from "./errors/CustomNotFoundError.js";

const app = express();

const __dirname = import.meta.dirname;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 1000 * 60 * 2,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

import "./passportConfig.js";

app.use(passport.session());

app.use((req, res, next) => {
  console.log("Session: ", req.session);
  console.log("Session ID: ", req.session.id);
  console.log("User: ", req.user);
  res.locals.currentUser = req.user;
  next();
});

// prevent 404 errors from missing favicon; remove if favicon is added
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// app.use() / router(s) info

// 404 error
app.use((req, res, next) => {
  next(new CustomNotFoundError("Page not found."));
});

// error handler
app.use((err, req, res, next) => {
  console.log("Request URL:", req.url);
  console.error(err);
  if (err.statusCode) {
    res.status(err.statusCode).send(`${err.statusCode} Error: ${err.message}`);
  } else {
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Listening on port ${PORT}!`);
});
