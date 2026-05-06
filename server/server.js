import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json({ limit: "1mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});

function escapeHtml(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanText(value, maxLength = 500) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

async function ensureReviewFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    await fs.writeFile(REVIEWS_FILE, "[]\n", "utf8");
  }
}

async function readReviews() {
  await ensureReviewFile();

  try {
    const raw = await fs.readFile(REVIEWS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Review read error:", error);
    return [];
  }
}

async function writeReviews(reviews) {
  await ensureReviewFile();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
}

function makeHtmlEmail(fields) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#2b1220;">
      <h2 style="color:#e93d88;">New BakeWithLinaa Order Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(fields.customerName)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(fields.customerPhone)}</p>
      <p><strong>Instagram:</strong> ${escapeHtml(fields.customerInstagram || "Not provided")}</p>
      <p><strong>Pickup:</strong> ${escapeHtml(fields.pickupDate)} at ${escapeHtml(fields.pickupTime)}</p>
      <hr />
      <h3>Order Summary</h3>
      <pre style="white-space:pre-wrap;background:#fff2f8;border:1px solid #ffd8ea;border-radius:12px;padding:14px;">${escapeHtml(fields.orderSummary)}</pre>
      <p style="font-size:13px;color:#777;">This email was sent from the BakeWithLinaa website order form.</p>
    </div>
  `;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "BakeWithLinaa backend is running." });
});

app.get("/api/reviews", async (req, res) => {
  const reviews = await readReviews();
  res.json({ ok: true, reviews });
});

app.post("/api/reviews", async (req, res) => {
  try {
    const name = cleanText(req.body.name, 60);
    const text = cleanText(req.body.text, 600);
    const rating = Math.min(5, Math.max(1, Number.parseInt(req.body.rating, 10) || 5));

    if (!name || !text) {
      return res.status(400).json({
        ok: false,
        message: "Please include a name and review.",
      });
    }

    const review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      rating,
      text,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    const currentReviews = await readReviews();
    const updatedReviews = [review, ...currentReviews].slice(0, 200);
    await writeReviews(updatedReviews);

    res.json({ ok: true, review });
  } catch (error) {
    console.error("Review save error:", error);
    res.status(500).json({
      ok: false,
      message: "Review could not be saved.",
    });
  }
});

app.post("/api/order", upload.array("inspirationPhotos", 5), async (req, res) => {
  try {
    const { customerName, customerPhone, pickupDate, pickupTime, orderSummary } = req.body;

    if (!customerName || !customerPhone || !pickupDate || !pickupTime || !orderSummary) {
      return res.status(400).json({
        ok: false,
        message: "Missing required order information.",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return res.status(500).json({
        ok: false,
        message: "Email backend is missing EMAIL_USER or EMAIL_APP_PASSWORD in .env.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype,
    }));

    await transporter.sendMail({
      from: `"BakeWithLinaa Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `BakeWithLinaa Order Request - ${customerName}`,
      text: orderSummary,
      html: makeHtmlEmail(req.body),
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
      message: "The order could not be sent. Check the backend terminal for details.",
    });
  }
});
const DIST_DIR = path.join(__dirname, "../dist");

app.use(express.static(DIST_DIR));

app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});
app.listen(PORT, () => {
  console.log(`BakeWithLinaa backend running on http://localhost:${PORT}`);
});
