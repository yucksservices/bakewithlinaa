import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = path.join(__dirname, "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const DIST_DIR = path.join(__dirname, "../dist");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(REVIEWS_FILE);
  } catch {
    await fs.writeFile(REVIEWS_FILE, "[]", "utf8");
  }
}

async function readReviews() {
  await ensureDataFile();

  try {
    const data = await fs.readFile(REVIEWS_FILE, "utf8");
    const reviews = JSON.parse(data);

    if (Array.isArray(reviews)) {
      return reviews;
    }

    return [];
  } catch {
    return [];
  }
}

async function writeReviews(reviews) {
  await ensureDataFile();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
}

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("Missing EMAIL_USER or EMAIL_APP_PASSWORD environment variable.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

function buildOrderText(body) {
  if (body.orderSummary) return body.orderSummary;
  if (body["Order Summary"]) return body["Order Summary"];

  return Object.entries(body)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "BakeWithLinaa backend is running.",
  });
});

app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await readReviews();
    res.json({ reviews });
  } catch (error) {
    console.error("Review read error:", error);
    res.status(500).json({
      ok: false,
      message: "Could not load reviews.",
    });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { name, rating, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({
        ok: false,
        message: "Name and review text are required.",
      });
    }

    const review = {
      id: Date.now(),
      name: String(name).trim(),
      rating: Number(rating) || 5,
      text: String(text).trim(),
      date: new Date().toLocaleDateString(),
    };

    const reviews = await readReviews();
    const updatedReviews = [review, ...reviews];

    await writeReviews(updatedReviews);

    res.json({
      ok: true,
      review,
    });
  } catch (error) {
    console.error("Review save error:", error);
    res.status(500).json({
      ok: false,
      message: "Could not save review.",
    });
  }
});

async function handleOrderRequest(req, res) {
  try {
    const transporter = createTransporter();

    const orderText = buildOrderText(req.body);

    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype,
    }));

    await transporter.sendMail({
      from: `"BakeWithLinaa Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: "BakeWithLinaa Order Request",
      text: orderText,
      attachments,
    });

    res.json({
      ok: true,
      message: "Order request sent successfully.",
    });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({
      ok: false,
      message: "The order could not be sent. Check email settings.",
    });
  }
}

app.post("/api/order", upload.any(), handleOrderRequest);
app.post("/api/send-order", upload.any(), handleOrderRequest);

/*
  Serve the built React website.
  This must be AFTER the API routes.
*/

app.use("/assets", express.static(path.join(DIST_DIR, "assets")));
app.use(express.static(DIST_DIR));

app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`BakeWithLinaa backend running on port ${PORT}`);
});
