import React, { useEffect, useMemo, useState } from "react";

import heartCakeImg from "./assets/heart-cake.png";
import roundCakeImg from "./assets/round-cake.png";
import dessertsImg from "./assets/desserts.png";
import cookiesImg from "./assets/cookies.png";
import specialCookiesImg from "./assets/special-cookies.png";
import cupcakesImg from "./assets/cupcakes.png";
import meetMeImg from "./assets/meet-me.png";

const API_BASE = import.meta.env.PROD ? "" : "http://localhost:5000";

const business = {
  name: "BakeWithLinaa",
  tagline: "Custom cakes, cupcakes, cookies, and sweet treats made with love.",
  email: "bakewithlinaa@gmail.com",
  pickupArea: "Ontario, California",
  instagram: "@bakewithlinaa",
  depositPercent: 50,
  noticeText: "1 to 3 weeks",
};


const products = [
  {
    id: "heart-cake",
    name: "Heart Cake",
    category: "Cakes",
    badge: "Best Seller",
    description: "A cute custom heart cake with your colors, writing, and decoration style.",
    image: heartCakeImg,
    options: [
      { label: "6 inch Heart Cake", serves: "10-12", price: 45 },
      { label: "8 inch Heart Cake", serves: "15-18", price: 60 },
      { label: "2 tier 6 inch & 8 inch 2 layer heart cake", serves: "35-50", price: 140 },
    ],
  },
  {
    id: "round-cake",
    name: "Round Cake",
    category: "Cakes",
    badge: "Fresh Pick",
    description: "Classic round cake, perfect for birthdays, parties, and simple custom designs.",
    image: roundCakeImg,
    options: [
      { label: "6 inch Round Cake", serves: "10-12", price: 45 },
      { label: "8 inch Round Cake", serves: "15-18", price: 60 },
      { label: "10 inch Round Cake", serves: "20-25", price: 75 },
      { label: "2 tier 6 inch & 8 inch 2 layer round cake", serves: "25-30", price: 120 },
      { label: "2 tier 6 inch & 10 inch 3 layer round cake", serves: "55-75", price: 160 },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    category: "Desserts",
    badge: "Party Ready",
    description: "Sweet dessert trays and specialty treats for pickup orders.",
    image: dessertsImg,
    options: [
      { label: "Churro Cheesecake", serves: "Tray", price: 40 },
      { label: "Churro Cheesecake + Fresh Fruit", serves: "Tray", price: 45 },
    ],
  },
  {
    id: "cookies",
    name: "Cookies",
    category: "Cookies",
    badge: "Trending",
    description: "Classic cookies sold by the dozen. Choose your favorite flavor.",
    image: cookiesImg,
    options: [
      { label: "M&M Cookies - 1 Dozen", serves: "12", price: 25 },
      { label: "Chocolate Chip Cookies - 1 Dozen", serves: "12", price: 25 },
      { label: "Red Velvet Cookies - 1 Dozen", serves: "12", price: 25 },
    ],
  },
  {
    id: "Loaded-cookies",
    name: "Loaded Cookies",
    category: "Loaded Cookies",
    badge: "Smooth & Creamy",
    description: "Loaded specialty cookies with toppings, sold by the dozen.",
    image: specialCookiesImg,
    options: [
      { label: "S'mores Overload - 1 Dozen", serves: "12", price: 30 },
      { label: "Triple Cookie Chaos - 1 Dozen", serves: "12", price: 30 },
      { label: "Peanut Butter Overdrive - 1 Dozen", serves: "12", price: 30 },
    ],
  },
  {
    id: "cupcakes",
    name: "Cupcakes",
    category: "Cupcakes",
    badge: "Rich Flavor",
    description: "Fresh decorated cupcakes sold by the dozen.",
    image: cupcakesImg,
    options: [{ label: "1 Dozen Cupcakes", serves: "12", price: 20 }],
  },
];

const categories = ["All", "Cakes", "Cupcakes", "Cookies", "Desserts"];
const cakeFlavors = ["N/A", "Warm Vanilla", "Rich Fudge Chocolate", "Red Velvet Love", "Birthday Sprinkle", "Spiced Carrot", "Sweet Strawberry"];
const fillings = ["No Filling", "Strawberry +$5", "Nutella +$5", "Cookie Butter +$5", "Bananas +$5", "Cookies of Your Choice +$5"];
const frostings = ["N/A", "Butter Cream", "Whipped Cream"];
const cupcakeFlavors = ["N/A", "Warm Vanilla", "Rich Fudge Chocolate", "Red Velvet Love", "Birthday Sprinkle", "Sweet Strawberry"];
const cupcakeFillings = ["N/A", "No Filling", "Strawberry", "Nutella", "Cookie Butter", "Bananas", "Cookies of Your Choice"];
const cupcakeColors = ["N/A", "Pink", "White", "Gold", "Purple", "Baby Blue", "Red", "Pastel Mix", "Custom Colors"];
const colors = ["Pink", "White", "Gold", "Purple", "Baby Blue", "Red", "Pastel Mix", "Custom Colors"];
const addOns = [
  { label: "No Add Ons", price: 0 },
  { label: "Handmade Bows", price: 0 },
  { label: "Custom Color Bows", price: 5 },
  { label: "White Pearls", price: 0 },
  { label: "Gold Pearls", price: 0 },
  { label: "Edible Image", price: 5 },
  { label: "Edible Glitter", price: 0 },
  { label: "Topper of Your Choice", price: 0, varies: true },
];
function getPickupTimes(dateString) {
  const date = dateString ? new Date(`${dateString}T12:00:00`) : new Date();
  const day = date.getDay();

  // Sunday, Monday, Friday, Saturday: 2:00 PM - 8:00 PM
  if ([0, 1, 5, 6].includes(day)) {
    return ["2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
  }

  // Tuesday, Wednesday, Thursday: 10:00 AM - 6:00 PM
  return ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
}

const faqs = [
  {
    q: "How much notice do I need to order?",
    a: `Please request pickup ${business.noticeText} ahead. Rush orders may be available depending on the schedule.`,
  },
  {
    q: "Is my order confirmed after submitting?",
    a: "Not yet. Your request is sent for review. Lina will confirm availability, design details, final price, and deposit.",
  },
  {
    q: "Do you take deposits?",
    a: `A ${business.depositPercent}% deposit is required to hold your pickup date. The remaining balance is usually due at pickup.`,
  },
  {
    q: "Can I request custom colors, writing, add ons, or inspiration photos?",
    a: "Yes. Use the customization section for flavors, colors, cake message, add ons, and inspiration photos.",
  },
];

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function dateInputValue(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function defaultPickupDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return dateInputValue(date);
}

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(() => Object.fromEntries(products.map((product) => [product.id, 0])));
  const [cart, setCart] = useState([]);
  const [inspirationFiles, setInspirationFiles] = useState([]);
  const [sendStatus, setSendStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  const [liveReviews, setLiveReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: "5", text: "" });
  const [reviewStatus, setReviewStatus] = useState({ type: "", message: "" });

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    instagram: "",
    pickupDate: defaultPickupDate(),
    pickupTime: "12:00 PM",
    notes: "",
  });

  const [custom, setCustom] = useState({
    flavor: cakeFlavors[0],
    filling: fillings[0],
    frosting: frostings[0],
    color: "Pink",
    messageColor: "Pink",
    cupcakeFlavor: cupcakeFlavors[0],
    cupcakeFilling: cupcakeFillings[0],
    cupcakeColor: cupcakeColors[0],
    addOn: addOns[0].label,
    message: "",
  });

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        const response = await fetch(`${API_BASE}/api/reviews`);
        const data = await response.json();
        if (active && response.ok && data.ok) {
          setLiveReviews(data.reviews || []);
        }
      } catch {
        if (active) setReviewStatus({ type: "error", message: "Could not load reviews right now." });
      } finally {
        if (active) setReviewLoading(false);
      }
    }

    loadReviews();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const text = `${product.name} ${product.category} ${product.description} ${product.badge} ${product.options.map((o) => o.label).join(" ")}`.toLowerCase();
      return matchesCategory && text.includes(search.toLowerCase());
    });
  }, [category, search]);

  const cakeQuantity = cart.reduce((sum, item) => (item.category === "Cakes" ? sum + item.quantity : sum), 0);
  const fillingCost = custom.filling === "No Filling" ? 0 : cakeQuantity * 5;
  const selectedAddOn = addOns.find((item) => item.label === custom.addOn) || addOns[0];
  const addOnCost = selectedAddOn.varies ? 0 : selectedAddOn.price;
  const productSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = productSubtotal + fillingCost + addOnCost;
  const deposit = subtotal > 0 ? Math.round(subtotal * (business.depositPercent / 100)) : 0;
  const balance = subtotal - deposit;

  const orderSummary = useMemo(() => {
    const items = cart.map((item) => `- ${item.quantity}x ${item.name} (${item.option}, serves ${item.serves}) - ${money(item.price * item.quantity)}`);
    const photoNames = inspirationFiles.length > 0 ? inspirationFiles.map((file) => `- ${file.name}`) : ["No inspiration photos selected"];
    const addOnText = selectedAddOn.varies
      ? `${custom.addOn} - price varies`
      : selectedAddOn.price > 0
        ? `${custom.addOn} - ${money(selectedAddOn.price)}`
        : `${custom.addOn} - free`;

    return [
      `New ${business.name} Order Request`,
      "",
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Instagram: ${customer.instagram || "Not provided"}`,
      `Pickup: ${customer.pickupDate} at ${customer.pickupTime}`,
      "",
      "Items:",
      ...items,
      "",
      "Customization:",
      `Cake flavor: ${custom.flavor}`,
      `Filling: ${custom.filling}`,
      `Filling add-on total: ${money(fillingCost)}`,
      `Frosting: ${custom.frosting}`,
      `Colors: ${custom.color || "Not provided"}`,
      `Cake message: ${custom.message || "None"}`,
      `Message color: ${custom.messageColor || "Not provided"}`,
      "",
      "Cupcake Customization:",
      `Cupcake flavor: ${custom.cupcakeFlavor || "Not provided"}`,
      `Cupcake filling: ${custom.cupcakeFilling || "Not provided"}`,
      `Cupcake color: ${custom.cupcakeColor || "Not provided"}`,
      "",
      `Add on: ${addOnText}`,
      "",
      "Inspiration Photos:",
      ...photoNames,
      "",
      `Product Subtotal: ${money(productSubtotal)}`,
      `Filling Add-on: ${money(fillingCost)}`,
      `Add-on Cost: ${selectedAddOn.varies ? "Price varies" : money(addOnCost)}`,
      `Subtotal: ${money(subtotal)}`,
      `${business.depositPercent}% Deposit: ${money(deposit)}`,
      `Estimated Balance: ${money(balance)}`,
      "",
      `Notes: ${customer.notes || "None"}`,
    ].join("\n");
  }, [cart, customer, custom, productSubtotal, fillingCost, selectedAddOn, addOnCost, subtotal, deposit, balance, inspirationFiles]);

  function addToCart(product) {
    const selectedOption = product.options[selectedOptions[product.id] || 0];
    const key = `${product.id}-${selectedOption.label}`;

    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) => (item.key === key ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [
        ...current,
        {
          key,
          name: product.name,
          category: product.category,
          option: selectedOption.label,
          serves: selectedOption.serves,
          price: selectedOption.price,
          quantity: 1,
        },
      ];
    });

    setSendStatus({ type: "", message: "" });
  }

  function updateQuantity(key, amount) {
    setCart((current) => current.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)));
  }

  function removeItem(key) {
    setCart((current) => current.filter((item) => item.key !== key));
  }

  async function copyOrder() {
    try {
      await navigator.clipboard.writeText(orderSummary);
      setSendStatus({ type: "success", message: "Order copied!" });
    } catch {
      setSendStatus({ type: "error", message: "Could not copy the order." });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!customer.name || !customer.phone || cart.length === 0) {
      setSendStatus({ type: "error", message: "Please add an item, name, and phone number before sending." });
      return;
    }

    setSending(true);
    setSendStatus({ type: "", message: "" });

    const formData = new FormData();
    formData.append("customerName", customer.name);
    formData.append("customerPhone", customer.phone);
    formData.append("customerInstagram", customer.instagram);
    formData.append("pickupDate", customer.pickupDate);
    formData.append("pickupTime", customer.pickupTime);
    formData.append("notes", customer.notes);
    formData.append("orderSummary", orderSummary);

    inspirationFiles.forEach((file) => {
      formData.append("inspirationPhotos", file);
    });

    try {
      const response = await fetch(`${API_BASE}/api/order`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "The order could not be sent.");
      }

      setSendStatus({ type: "success", message: "Order request sent to BakeWithLinaa!" });
    } catch (error) {
      setSendStatus({ type: "error", message: error.message || "The order could not be sent. Check the backend terminal for details." });
    } finally {
      setSending(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      setReviewStatus({ type: "error", message: "Please enter your name and review." });
      return;
    }

    setReviewStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewForm.name.trim(),
          rating: Number(reviewForm.rating),
          text: reviewForm.text.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Review could not be saved.");
      }

      setLiveReviews((current) => [data.review, ...current]);
      setReviewForm({ name: "", rating: "5", text: "" });
      setReviewStatus({ type: "success", message: "Thank you! Your review was added." });
    } catch (error) {
      setReviewStatus({ type: "error", message: error.message || "Review could not be saved. Please try again." });
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #1c1917; background: #fff8fc; }
        a { color: inherit; text-decoration: none; }
        .page { min-height: 100vh; background: radial-gradient(circle at 20% 10%, rgba(255,255,255,0.85), transparent 18%), radial-gradient(circle at 80% 18%, rgba(255,255,255,0.7), transparent 12%), linear-gradient(180deg, #fff8fc 0%, #fff2f8 40%, #ffeef6 100%); position: relative; overflow: hidden; }
        .container { width: min(1180px, calc(100% - 32px)); margin: 0 auto; position: relative; z-index: 2; }
        .bow-corner { display: none; }
        .sparkles { pointer-events: none; position: fixed; inset: 0; z-index: 1; overflow: hidden; }
        .sparkle { position: absolute; color: rgba(255, 120, 180, 0.55); text-shadow: 0 0 12px rgba(255,255,255,0.9); animation: twinkle 3.8s ease-in-out infinite; user-select: none; }
        .s1 { top: 90px; left: 6%; font-size: 22px; animation-delay: 0s; } .s2 { top: 160px; right: 12%; font-size: 18px; animation-delay: .8s; } .s3 { top: 420px; left: 10%; font-size: 16px; animation-delay: 1.1s; } .s4 { top: 620px; right: 18%; font-size: 20px; animation-delay: 1.6s; } .s5 { top: 980px; left: 20%; font-size: 17px; animation-delay: .5s; } .s6 { top: 1240px; right: 9%; font-size: 24px; animation-delay: 1.9s; } .s7 { top: 1520px; left: 8%; font-size: 15px; animation-delay: 1.3s; } .s8 { top: 1860px; right: 16%; font-size: 19px; animation-delay: 2.2s; }
        @keyframes twinkle { 0%, 100% { opacity: .35; transform: scale(.95) rotate(0deg); } 50% { opacity: 1; transform: scale(1.15) rotate(12deg); } }
        .header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.88); backdrop-filter: blur(14px); border-bottom: 1px solid #ffd8ea; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo { width: 46px; height: 46px; border-radius: 18px; display: grid; place-items: center; background: linear-gradient(135deg, #ff1493, #ff1493); color: white; font-size: 24px; box-shadow: 0 10px 24px rgba(255,93,162,.28); }
        .brand h1 { margin: 0; font-size: 22px; letter-spacing: -.04em; } .brand p { margin: 2px 0 0; color: #8c5a70; font-size: 13px; font-weight: 700; }
        .nav { display: flex; gap: 22px; font-weight: 900; color: #6f4f5e; font-size: 14px; } .nav a:hover { color: #ff1493; }
        .btn { border: 0; cursor: pointer; border-radius: 999px; padding: 13px 20px; font-weight: 900; font-size: 14px; display: inline-flex; justify-content: center; align-items: center; transition: .2s ease; font-family: inherit; }
        .btn-dark { background: #31121f; color: white; } .btn-dark:hover { background: #ff1493; }
        .btn-pink { background: linear-gradient(135deg, #ff1493, #ff1493); color: white; box-shadow: 0 12px 26px rgba(255,93,162,.25); } .btn-pink:hover { transform: translateY(-1px); }
        .btn-white { background: rgba(255,255,255,.95); color: #31121f; border: 1px solid #ffd6e8; } .btn-green { background: #86efac; color: #052e16; }
        .btn:disabled { cursor: not-allowed; background: #d8c7d0; color: white; box-shadow: none; }
        .hero { background: radial-gradient(circle at 20% 0%, rgba(255,255,255,.8), transparent 24%), linear-gradient(135deg, #fff7fb, #fff0f7, #ffe9f3); }
        .hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 44px; padding: 72px 0; align-items: center; }
        .pill { width: fit-content; background: rgba(255,255,255,.95); border: 1px solid #ffd8ea; color: #ff1493; padding: 10px 16px; border-radius: 999px; font-weight: 900; font-size: 14px; }
        .hero h2 { margin: 18px 0 0; font-size: clamp(44px, 7vw, 82px); line-height: .95; letter-spacing: -.07em; color: #ff1493; }
        .hero-text { margin-top: 22px; max-width: 680px; color: #6e5562; font-size: 19px; line-height: 1.8; font-weight: 500; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .stats { margin-top: 32px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 620px; }
        .stat { background: rgba(255,255,255,.95); padding: 18px; border-radius: 26px; text-align: center; box-shadow: 0 10px 24px rgba(255,93,162,.08); border: 1px solid #ffe1ef; } .stat strong { display: block; color: #ff1493; font-size: 30px; } .stat span { color: #8c6777; font-size: 13px; font-weight: 900; }
        .hero-card { position: relative; background: rgba(255,255,255,.96); padding: 12px; border-radius: 34px; box-shadow: 0 22px 60px rgba(255,93,162,.18); border: 1px solid #ffe1ef; overflow: hidden; }
        .hero-card img { width: 100%; height: 530px; object-fit: cover; border-radius: 26px; display: block; }
        .featured-box { position: absolute; left: 28px; right: 28px; bottom: 28px; background: rgba(255,255,255,.9); backdrop-filter: blur(10px); border-radius: 24px; padding: 20px; box-shadow: 0 12px 32px rgba(255,93,162,.12); }
        .featured-box h3 { margin: 0; color: #421627; }
        .featured-box p { margin: 6px 0 0; color: #6e5562; line-height: 1.5; }
        .about-card { overflow: visible; display: flex; flex-direction: column; gap: 14px; }
        .about-card img { height: auto; max-height: none; object-fit: contain; background: white; }
        .about-card .featured-box { position: static; left: auto; right: auto; bottom: auto; margin: 0; background: rgba(255,255,255,.96); max-height: none; overflow: visible; }
        .about-card .featured-box h3 { font-size: 24px; margin-bottom: 8px; }
        .about-card .featured-box p { font-size: 14px; line-height: 1.75; margin: 0 0 12px; } .about-card .featured-box p:last-child { margin-bottom: 0; }
        section { padding: 64px 0; } .white-section { background: rgba(255,255,255,.45); }
        .section-title { text-align: center; margin-bottom: 34px; } .eyebrow { margin: 0; color: #ff1493; font-size: 13px; font-weight: 1000; letter-spacing: .25em; text-transform: uppercase; }
        .section-title h2, .split-title h2 { margin: 8px 0 0; font-size: clamp(34px, 5vw, 48px); letter-spacing: -.05em; color: #421627; } .section-title p, .split-title p { color: #6e5562; line-height: 1.7; max-width: 680px; margin: 12px auto 0; }
        .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; } .step-card { background: rgba(255,255,255,.96); border: 1px solid #ffe1ef; border-radius: 30px; padding: 26px; box-shadow: 0 10px 28px rgba(255,93,162,.08); } .step-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; } .step-icon { font-size: 38px; } .step-num { font-size: 38px; font-weight: 1000; color: #ffe3ef; } .step-card h3 { margin: 0; color: #421627; } .step-card p { color: #6e5562; line-height: 1.6; }
        .menu-head { display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; margin-bottom: 32px; } .split-title { max-width: 720px; } .controls { display: flex; gap: 10px; flex-wrap: wrap; }
        input, select, textarea { width: 100%; border: 1px solid #ffdbe9; background: rgba(255,255,255,.95); color: #421627; border-radius: 18px; padding: 14px 16px; font-size: 15px; font-weight: 700; outline: none; font-family: inherit; } input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 4px #ffd4e6; } textarea { resize: vertical; min-height: 120px; } label span { display: block; margin-bottom: 8px; color: #8c6777; font-size: 12px; font-weight: 1000; text-transform: uppercase; letter-spacing: .12em; }
        .cake-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; } .cake-card { overflow: hidden; background: rgba(255,255,255,.96); border: 1px solid #ffe1ef; border-radius: 34px; box-shadow: 0 10px 28px rgba(255,93,162,.08); transition: .2s ease; } .cake-card:hover { transform: translateY(-4px); box-shadow: 0 18px 38px rgba(255,93,162,.14); } .cake-image { position: relative; } .cake-image img { width: 100%; height: 230px; object-fit: cover; display: block; } .badge { position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,.95); color: #ff1493; border-radius: 999px; padding: 8px 12px; font-size: 12px; font-weight: 1000; }
        .cake-body { padding: 22px; } .cake-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; } .tag { background: #ffe7f1; color: #ff1493; padding: 7px 11px; border-radius: 999px; font-size: 12px; font-weight: 1000; } .from { font-size: 14px; font-weight: 1000; color: #5a3948; } .cake-card h3 { margin: 0; font-size: 25px; color: #421627; } .cake-card p { color: #6e5562; line-height: 1.6; }
        .size-box { background: #fff5fa; border-radius: 24px; padding: 16px; margin-top: 18px; border: 1px solid #ffe3ef; } .size-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-weight: 900; color: #6a4c59; } .price { color: #ff1493; font-size: 24px; font-weight: 1000; } .full { width: 100%; margin-top: 18px; }
        .custom-box { background: rgba(255,245,250,.95); border: 1px solid #ffe1ef; border-radius: 34px; padding: 22px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; box-shadow: 0 10px 24px rgba(255,93,162,.07); } .wide { grid-column: span 2; } .fullwide { grid-column: 1 / -1; } .file-list { margin: 10px 0 0; color: #6e5562; font-size: 13px; line-height: 1.6; }
        .order-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 32px; align-items: start; } .form-card { background: rgba(255,255,255,.96); border: 1px solid #ffe1ef; border-radius: 34px; padding: 24px; box-shadow: 0 10px 28px rgba(255,93,162,.08); display: grid; gap: 18px; } .two { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; } .hint { color: #8c6777; font-size: 12px; font-weight: 800; margin: 8px 0 0; line-height: 1.5; }
        .cart { position: sticky; top: 94px; background: linear-gradient(180deg, #3a1727, #241019); color: white; border-radius: 34px; padding: 24px; box-shadow: 0 18px 44px rgba(58,23,39,.25); } .cart-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,.1); padding-bottom: 18px; } .cart-head p { margin: 0; color: #ffb9d6; font-size: 13px; font-weight: 1000; letter-spacing: .2em; text-transform: uppercase; } .cart-head h2 { margin: 6px 0 0; font-size: 32px; }
        .empty-cart { text-align: center; padding: 48px 0; color: rgba(255,255,255,.65); } .empty-cart div { font-size: 52px; } .empty-cart strong { display: block; color: white; margin-top: 12px; font-size: 18px; } .cart-item { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,.1); } .cart-item-top { display: flex; justify-content: space-between; gap: 16px; } .cart-item h3 { margin: 0; font-size: 17px; } .cart-item p { margin: 6px 0 0; color: rgba(255,255,255,.62); font-size: 14px; }
        .delete-btn { border: 0; background: rgba(255,255,255,.1); color: white; border-radius: 12px; padding: 8px 10px; cursor: pointer; font-weight: 900; } .delete-btn:hover { background: #ff1493; } .quantity-row { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; } .quantity { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.1); padding: 5px; border-radius: 999px; } .quantity button { border: 0; color: white; background: rgba(255,255,255,.1); cursor: pointer; border-radius: 999px; width: 34px; height: 34px; font-size: 20px; } .quantity span { width: 28px; text-align: center; font-weight: 1000; }
        .cart-total-box, .custom-summary { background: rgba(255,255,255,.1); border-radius: 26px; padding: 20px; margin-top: 20px; } .total-line { display: flex; justify-content: space-between; color: rgba(255,255,255,.75); margin-bottom: 12px; gap: 12px; } .grand-total { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.12); padding-top: 16px; margin-top: 16px; font-size: 26px; font-weight: 1000; } .custom-summary { color: rgba(255,255,255,.72); line-height: 1.7; } .custom-summary strong { color: white; }
        .status { border-radius: 20px; padding: 16px; margin-top: 18px; font-weight: 900; line-height: 1.5; } .status.success { background: rgba(34,197,94,.16); color: #dcfce7; border: 1px solid rgba(134,239,172,.35); } .status.error { background: rgba(190,18,60,.35); color: #ffe4e6; border: 1px solid rgba(251,113,133,.55); } .success-actions { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 18px; }
        .review-section-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 22px; align-items: start; } .review-form { background: rgba(255,255,255,.96); border: 1px solid #ffe1ef; border-radius: 30px; padding: 26px; box-shadow: 0 10px 24px rgba(255,93,162,.07); display: grid; gap: 16px; } .reviews { display: grid; grid-template-columns: 1fr; gap: 18px; } .review-card, .empty-reviews { background: rgba(255,255,255,.96); border: 1px solid #ffe1ef; border-radius: 30px; padding: 26px; box-shadow: 0 10px 24px rgba(255,93,162,.07); } .stars { color: #ff1493; letter-spacing: 4px; font-size: 18px; margin-bottom: 18px; } .review-card p, .empty-reviews { line-height: 1.7; color: #5e4552; } .review-card strong { display: block; margin-top: 18px; color: #421627; } .review-date { color: #8c6777; font-size: 12px; font-weight: 800; margin-top: 6px; }
        .faq-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 34px; } details { background: rgba(255,255,255,.96); border: 1px solid #ffe1ef; border-radius: 26px; padding: 20px; margin-bottom: 14px; box-shadow: 0 10px 28px rgba(255,93,162,.06); } summary { cursor: pointer; font-weight: 1000; font-size: 17px; color: #421627; } details p { color: #6e5562; line-height: 1.7; } .warning { background: #fff9fc; color: #78350f; border: 1px solid #ffd8ea; border-radius: 26px; padding: 20px; line-height: 1.6; }
        .contact-box { background: linear-gradient(135deg, #ff1493, #ff1493); color: white; border-radius: 34px; padding: 34px; display: grid; grid-template-columns: .85fr 1.15fr; gap: 24px; box-shadow: 0 18px 44px rgba(255,93,162,.24); } .contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; } .contact-card { background: rgba(255,255,255,.16); border-radius: 24px; padding: 18px; backdrop-filter: blur(8px); } .contact-card div { font-size: 28px; } .contact-card strong { display: block; margin-top: 12px; } .contact-card p { color: rgba(255,255,255,.9); margin-bottom: 0; font-size: 14px; word-break: break-word; line-height: 1.5; }
        .footer { background: rgba(255,255,255,.82); border-top: 1px solid #ffe1ef; padding: 28px 0; } .footer-inner { display: flex; justify-content: space-between; gap: 18px; color: #8c6777; font-weight: 800; font-size: 14px; } .footer-links { display: flex; gap: 16px; flex-wrap: wrap; }

        .mobile-quick-nav { display: none; }

        @media (max-width: 600px) {
          body { padding-bottom: 86px; }
          .page { overflow: visible; }
          .container { width: min(100% - 24px, 1180px); }
          .sparkles { display: none; }
          .header-inner { padding: 10px 0; }
          .logo { width: 40px; height: 40px; border-radius: 15px; font-size: 22px; }
          .brand h1 { font-size: 19px; }
          .header .btn-dark { padding: 10px 14px; font-size: 12px; }
          section { padding: 36px 0; }
          .hero-grid { padding: 34px 0; gap: 22px; }
          .pill { font-size: 12px; padding: 8px 12px; }
          .hero h2 { font-size: 40px; line-height: 1; letter-spacing: -0.055em; }
          .hero-text { font-size: 15px; line-height: 1.55; margin-top: 14px; }
          .hero-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
          .stats { grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 18px; }
          .stat { padding: 12px 6px; border-radius: 18px; }
          .stat strong { font-size: 18px; line-height: 1.1; }
          .stat span { font-size: 10px; }
          .about-card { border-radius: 24px; padding: 10px; gap: 10px; }
          .about-card img { max-height: 360px; width: 100%; object-fit: contain; }
          .about-card .featured-box { padding: 16px; border-radius: 20px; }
          .about-card .featured-box h3 { font-size: 21px; }
          .about-card .featured-box p { font-size: 13px; line-height: 1.55; }
          .about-card .featured-box p:nth-of-type(n+2) { display: none; }
          .section-title { margin-bottom: 20px; }
          .section-title h2, .split-title h2 { font-size: 30px; }
          .section-title p, .split-title p { font-size: 14px; line-height: 1.55; }
          .steps { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .step-card { padding: 16px; border-radius: 22px; }
          .step-top { margin-bottom: 10px; }
          .step-icon { font-size: 28px; }
          .step-num { font-size: 24px; }
          .step-card h3 { font-size: 15px; }
          .step-card p { display: none; }
          .menu-head { margin-bottom: 20px; }
          .controls input, .controls select { padding: 12px 14px; }
          .cake-grid { gap: 14px; }
          .cake-card { border-radius: 24px; }
          .cake-image img { height: 165px; }
          .badge { top: 12px; left: 12px; padding: 7px 10px; font-size: 11px; }
          .cake-body { padding: 16px; }
          .cake-meta { margin-bottom: 8px; }
          .cake-card h3 { font-size: 21px; }
          .cake-card p { display: none; }
          .size-box { margin-top: 12px; padding: 12px; border-radius: 18px; }
          .size-bottom { margin-top: 8px; font-size: 13px; }
          .price { font-size: 20px; }
          .full { margin-top: 12px; }
          .custom-box { padding: 16px; border-radius: 24px; gap: 12px; }
          input, select, textarea { padding: 12px 14px; font-size: 14px; border-radius: 15px; }
          textarea { min-height: 92px; }
          .order-grid { gap: 20px; }
          .form-card { padding: 18px; border-radius: 24px; gap: 14px; }
          .cart { padding: 18px; border-radius: 24px; }
          .cart-head { padding-bottom: 14px; }
          .cart-head h2 { font-size: 26px; }
          .empty-cart { padding: 28px 0; }
          .cart-item { padding: 14px 0; }
          .cart-item h3 { font-size: 16px; }
          .cart-total-box { padding: 16px; border-radius: 20px; }
          .custom-summary { display: none; }
          .grand-total { font-size: 22px; }
          .review-form, .review-card, .empty-reviews { padding: 18px; border-radius: 22px; }
          .faq-grid { gap: 18px; }
          details { padding: 16px; border-radius: 20px; }
          .contact-box { padding: 22px; border-radius: 24px; gap: 16px; }
          .contact-box h2 { font-size: 30px !important; }
          .contact-card { padding: 14px; border-radius: 18px; }
          .footer-inner { flex-direction: column; text-align: center; align-items: center; }
          .mobile-quick-nav { position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 200; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px; border-radius: 999px; background: rgba(255,255,255,0.94); border: 1px solid #ffd8ea; box-shadow: 0 12px 34px rgba(255, 20, 147, 0.22); backdrop-filter: blur(12px); }
          .mobile-quick-nav a { display: flex; align-items: center; justify-content: center; min-height: 44px; border-radius: 999px; background: #ff1493; color: white; font-size: 13px; font-weight: 1000; }
          .mobile-quick-nav a:nth-child(2) { background: #31121f; }
        }

        @media (max-width: 900px) { .nav { display: none; } .hero-grid, .order-grid, .faq-grid, .contact-box, .review-section-grid { grid-template-columns: 1fr; } .steps, .cake-grid { grid-template-columns: repeat(2, 1fr); } .contact-cards { grid-template-columns: repeat(3, 1fr); } .custom-box { grid-template-columns: 1fr 1fr; } .hero-card img { height: 420px; } .about-card img { height: auto; } .cart { position: static; } }
        @media (max-width: 600px) { .brand p { display: none; } .steps, .cake-grid, .contact-cards, .custom-box, .two, .stats { grid-template-columns: 1fr; } .wide, .fullwide { grid-column: span 1; } .menu-head { align-items: stretch; flex-direction: column; } .controls { flex-direction: column; } .hero h2 { font-size: 46px; } .hero-card img { height: 340px; } .about-card img { height: auto; } .btn { padding: 12px 16px; } .bow-corner { display: none; } }
      `}</style>

      <div className="page">
        <div className="sparkles">
          <span className="sparkle s1">✦</span><span className="sparkle s2">✦</span><span className="sparkle s3">✦</span><span className="sparkle s4">✦</span><span className="sparkle s5">✦</span><span className="sparkle s6">✦</span><span className="sparkle s7">✦</span><span className="sparkle s8">✦</span>
        </div>

        <header className="header">
          <div className="container header-inner">
            <a href="#top" className="brand">
              <div className="logo">🎀</div>
              <div><h1>{business.name}</h1><p>{business.tagline}</p></div>
            </a>
            <nav className="nav"><a href="#menu">Menu</a><a href="#customize">Customize</a><a href="#reviews">Reviews</a><a href="#faq">FAQ</a></nav>
            <a href="#order" className="btn btn-dark">Order Now</a>
          </div>
        </header>

        <main id="top">
          <section className="hero">
            <div className="container hero-grid">
              <div>
                <div className="pill">✨ Now accepting custom pickup orders</div>
                <h2>Sweet Treats Made Fresh To Order</h2>
                <p className="hero-text">Choose your treat, pick a size or flavor, customize your cake details, select your pickup day, and send Lina your order request in minutes.</p>
                <div className="hero-actions"><a href="#menu" className="btn btn-pink">Browse Menu</a><a href="#how" className="btn btn-white">How It Works</a></div>
                <div className="stats"><div className="stat"><strong>1-3</strong><span>Weeks notice</span></div><div className="stat"><strong>Pick up</strong><span>Only</span></div><div className="stat"><strong>{business.depositPercent}%</strong><span>Deposit required</span></div></div>
              </div>
              <div className="hero-card about-card">
                <img src={meetMeImg} alt="Meet your baker Angelina" />
                <div className="featured-box about-box">
                  <h3>About Me</h3>
                  <p>So nice to meet you, I’m Angelina. I started baking in 2021 with nothing but a passion and a dream. What began as something small quickly turned into something so much bigger than I ever imagined. Baking became my escape, my peace, and the way I express love when words don’t always feel like enough.</p>
                  <p>Every cake I make holds a piece of me — my time, my creativity, my heart. Seeing the smiles, the celebrations, and the memories my work gets to be a part of means everything to me. This isn’t just baking… it’s my love language.</p>
                  <p>I’ve poured so much into this journey, and I’m still growing, still learning, and still chasing the dream I’ve had since the very beginning. To everyone who has supported me, trusted me, or even just followed along… thank you from the bottom of my heart.</p>
                  <p>This is only the beginning! More facts about me: my favorite color is pink, my grandmother is my biggest inspiration for what I love to do, and my birthday is June 19th!</p>
                </div>
              </div>
            </div>
          </section>

          <section id="how">
            <div className="container">
              <div className="section-title"><p className="eyebrow">Easy ordering</p><h2>How it works</h2></div>
              <div className="steps">
                {[["🍰", "Pick your treat", "Choose a cake, cupcakes, cookies, special cookies, or dessert."], ["🎨", "Customize it", "Select cake flavor, filling, frosting, colors, add ons, message, and inspiration photos."], ["📅", "Choose pickup", "Pick your pickup day and time. Please order 1 to 3 weeks ahead."], ["✅", "Send request", "Lina confirms availability, deposit, and final details."]].map((step, index) => (
                  <div className="step-card" key={step[1]}><div className="step-top"><div className="step-icon">{step[0]}</div><div className="step-num">0{index + 1}</div></div><h3>{step[1]}</h3><p>{step[2]}</p></div>
                ))}
              </div>
            </div>
          </section>

          <section id="menu">
            <div className="container">
              <div className="menu-head">
                <div className="split-title"><p className="eyebrow">Menu</p><h2>Choose your treat</h2><p>Select what you want, choose the size or flavor option, then add it to your order summary.</p></div>
                <div className="controls"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu..." /><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
              </div>
              <div className="cake-grid">
                {filteredProducts.map((product) => {
                  const selectedOption = product.options[selectedOptions[product.id] || 0];
                  return (
                    <article className="cake-card" key={product.id}>
                      <div className="cake-image"><img src={product.image} alt={product.name} /><span className="badge">{product.badge}</span></div>
                      <div className="cake-body">
                        <div className="cake-meta"><span className="tag">{product.category}</span><span className="from">From {money(product.options[0].price)}</span></div>
                        <h3>{product.name}</h3><p>{product.description}</p>
                        <div className="size-box">
                          <label><span>Choose option</span><select value={selectedOptions[product.id] || 0} onChange={(event) => setSelectedOptions((current) => ({ ...current, [product.id]: Number(event.target.value) }))}>{product.options.map((option, index) => <option key={option.label} value={index}>{option.label} • {money(option.price)}</option>)}</select></label>
                          <div className="size-bottom"><span>Serves {selectedOption.serves}</span><span className="price">{money(selectedOption.price)}</span></div>
                        </div>
                        <button className="btn btn-dark full" onClick={() => addToCart(product)}>Add to Order</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="customize" className="white-section">
            <div className="container">
              <div className="section-title"><p className="eyebrow">Make it yours</p><h2>Customize your cake</h2><p>Choose cake details, cupcake details, add-ons, colors, message, and inspiration photos.</p></div>
              <div className="custom-box">
                <label><span>Cake flavor</span><select value={custom.flavor} onChange={(event) => setCustom({ ...custom, flavor: event.target.value })}>{cakeFlavors.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Filling</span><select value={custom.filling} onChange={(event) => setCustom({ ...custom, filling: event.target.value })}>{fillings.map((item) => <option key={item}>{item}</option>)}</select><p className="hint">Each filling adds $5 per cake item.</p></label>
                <label><span>Frosting</span><select value={custom.frosting} onChange={(event) => setCustom({ ...custom, frosting: event.target.value })}>{frostings.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Colors</span><input value={custom.color} onChange={(event) => setCustom({ ...custom, color: event.target.value })} placeholder="Example: pink, white, gold, pastel blue" /></label>
                <label><span>Cupcake flavor</span><select value={custom.cupcakeFlavor} onChange={(event) => setCustom({ ...custom, cupcakeFlavor: event.target.value })}>{cupcakeFlavors.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Cupcake filling</span><select value={custom.cupcakeFilling} onChange={(event) => setCustom({ ...custom, cupcakeFilling: event.target.value })}>{cupcakeFillings.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Cupcake color</span><select value={custom.cupcakeColor} onChange={(event) => setCustom({ ...custom, cupcakeColor: event.target.value })}>{cupcakeColors.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="wide"><span>Add ons</span><select value={custom.addOn} onChange={(event) => setCustom({ ...custom, addOn: event.target.value })}>{addOns.map((item) => <option key={item.label} value={item.label}>{item.label} • {item.varies ? "Price varies" : item.price === 0 ? "Free" : money(item.price)}</option>)}</select><p className="hint">Topper of your choice price varies and will be confirmed before payment.</p></label>
                <label className="wide"><span>Cake message</span><input value={custom.message} onChange={(event) => setCustom({ ...custom, message: event.target.value })} placeholder="Example: Happy Birthday Lina" /></label>
                <label className="wide"><span>Message color</span><input value={custom.messageColor} onChange={(event) => setCustom({ ...custom, messageColor: event.target.value })} placeholder="Example: pink, gold, white, black" /></label>
                <label className="fullwide"><span>Inspiration photos</span><input type="file" accept="image/*" multiple onChange={(event) => setInspirationFiles(Array.from(event.target.files || []))} /><p className="hint">Photos are sent to BakeWithLinaa with the order. Keep total photo size under 10MB.</p>{inspirationFiles.length > 0 && <div className="file-list"><strong>Selected photos:</strong>{inspirationFiles.map((file) => <div key={file.name}>• {file.name}</div>)}</div>}</label>
              </div>
            </div>
          </section>

          <section id="order">
            <div className="container order-grid">
              <div>
                <div className="split-title"><p className="eyebrow">Order Details</p><h2>Pickup information</h2><p>Fill this out after adding treats. Lina will confirm availability, final design details, and payment.</p></div>
                <form className="form-card" onSubmit={handleSubmit}>
                  <div className="two"><label><span>Name *</span><input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Your name" /></label><label><span>Phone *</span><input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Your phone number" /></label></div>
                  <label><span>Instagram</span><input value={customer.instagram} onChange={(event) => setCustomer({ ...customer, instagram: event.target.value })} placeholder="@yourinstagram" /></label>
                  <div className="two"><label><span>Pickup date *</span><input type="date" value={customer.pickupDate} onChange={(event) => { const nextDate = event.target.value; const times = getPickupTimes(nextDate); setCustomer({ ...customer, pickupDate: nextDate, pickupTime: times.includes(customer.pickupTime) ? customer.pickupTime : times[0] }); }} /><p className="hint">Please order {business.noticeText} ahead.</p></label><label><span>Pickup time</span><select value={customer.pickupTime} onChange={(event) => setCustomer({ ...customer, pickupTime: event.target.value })}>{getPickupTimes(customer.pickupDate).map((time) => <option key={time}>{time}</option>)}</select></label></div>
                  <label><span>Extra notes</span><textarea value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} placeholder="Example: Theme is butterflies, add gold details, send me payment link." /></label>
                  <button type="submit" className="btn btn-pink" disabled={sending || !customer.name || !customer.phone || cart.length === 0}>{sending ? "Sending..." : "Send Email Request"}</button>
                  <p className="hint">This sends the request directly to {business.email}. Final pickup availability and payment should be confirmed by {business.name}.</p>
                </form>
              </div>

              <aside className="cart">
                <div className="cart-head"><div><p>Summary</p><h2>Your order</h2></div><div style={{ fontSize: 34 }}>🛒</div></div>
                {cart.length === 0 ? <div className="empty-cart"><div>🍰</div><strong>Your order is empty</strong><p>Add something from the menu to get started.</p></div> : <div>{cart.map((item) => <div className="cart-item" key={item.key}><div className="cart-item-top"><div><h3>{item.name}</h3><p>{item.option} • Serves {item.serves}</p><p style={{ color: "#ffb9d6", fontWeight: 900 }}>{money(item.price)} each</p></div><button className="delete-btn" onClick={() => removeItem(item.key)}>Delete</button></div><div className="quantity-row"><div className="quantity"><button onClick={() => updateQuantity(item.key, -1)}>-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.key, 1)}>+</button></div><strong>{money(item.price * item.quantity)}</strong></div></div>)}</div>}
                <div className="cart-total-box"><div className="total-line"><span>Product subtotal</span><span>{money(productSubtotal)}</span></div><div className="total-line"><span>Filling add-on</span><span>{money(fillingCost)}</span></div><div className="total-line"><span>Add-on cost</span><span>{selectedAddOn.varies ? "Price varies" : money(addOnCost)}</span></div><div className="total-line"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="total-line"><span>Required {business.depositPercent}% deposit</span><span>{money(deposit)}</span></div><div className="total-line"><span>Estimated balance</span><span>{money(balance)}</span></div><div className="grand-total"><span>Total</span><span>{money(subtotal)}</span></div></div>
                <div className="custom-summary"><p><strong>Cake flavor:</strong> {custom.flavor}</p><p><strong>Filling:</strong> {custom.filling}</p><p><strong>Frosting:</strong> {custom.frosting}</p><p><strong>Colors:</strong> {custom.color || "Not provided"}</p><p><strong>Message color:</strong> {custom.messageColor || "Not provided"}</p><p><strong>Cupcake flavor:</strong> {custom.cupcakeFlavor}</p><p><strong>Cupcake filling:</strong> {custom.cupcakeFilling}</p><p><strong>Cupcake color:</strong> {custom.cupcakeColor}</p><p><strong>Add on:</strong> {custom.addOn}{selectedAddOn.varies ? " (price varies)" : ""}</p><p><strong>Inspiration photos:</strong> {inspirationFiles.length} selected</p></div>
                <div className="success-actions"><button className="btn btn-green" onClick={copyOrder}>Copy Order</button></div>
                {sendStatus.message && <div className={`status ${sendStatus.type}`}>{sendStatus.message}</div>}
              </aside>
            </div>
          </section>

          <section id="reviews" className="white-section">
            <div className="container">
              <div className="section-title"><p className="eyebrow">Reviews</p><h2>Real customer reviews</h2><p>Customers can leave a review right here after ordering from BakeWithLinaa.</p></div>
              <div className="review-section-grid">
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <label><span>Your name</span><input value={reviewForm.name} onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })} placeholder="Your name" /></label>
                  <label><span>Rating</span><select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}><option value="5">★★★★★ 5 stars</option><option value="4">★★★★☆ 4 stars</option><option value="3">★★★☆☆ 3 stars</option><option value="2">★★☆☆☆ 2 stars</option><option value="1">★☆☆☆☆ 1 star</option></select></label>
                  <label><span>Your review</span><textarea value={reviewForm.text} onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })} placeholder="Tell us what you thought about your order." /></label>
                  <button className="btn btn-pink" type="submit">Post Review</button>
                  {reviewStatus.message && <div className={`status ${reviewStatus.type}`}>{reviewStatus.message}</div>}
                </form>
                <div className="reviews">
                  {reviewLoading ? <div className="empty-reviews">Loading reviews...</div> : liveReviews.length === 0 ? <div className="empty-reviews">No reviews yet. Once customers post reviews, they will show up here.</div> : liveReviews.map((review) => <div className="review-card" key={review.id}><div className="stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div><p>“{review.text}”</p><strong>{review.name}</strong><div className="review-date">{review.date}</div></div>)}
                </div>
              </div>
            </div>
          </section>

          <section id="faq"><div className="container faq-grid"><div className="split-title"><p className="eyebrow">FAQ & Policies</p><h2>Before you order</h2><p>These sections help customers understand pickup, deposits, and custom requests before they submit an order.</p></div><div>{faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}<div className="warning"><strong>⚠️ Allergy notice</strong><p>Products may contain or come into contact with milk, eggs, wheat, soy, peanuts, tree nuts, and other allergens.</p></div></div></div></section>

          <section id="contact"><div className="container"><div className="contact-box"><div><p className="eyebrow" style={{ color: "rgba(255,255,255,0.78)" }}>Contact</p><h2 style={{ fontSize: 42, marginTop: 8, marginBottom: 0 }}>Questions before ordering?</h2></div><div className="contact-cards"><div className="contact-card"><div>✉️</div><strong>Email</strong><p>{business.email}</p></div><div className="contact-card"><div>📸</div><strong>Instagram</strong><p>{business.instagram}</p></div><div className="contact-card"><div>📍</div><strong>Pickup</strong><p>{business.pickupArea}</p></div></div></div></div></section>
        </main>

        <footer className="footer"><div className="container footer-inner"><div>© {new Date().getFullYear()} {business.name}. All rights reserved.</div><div className="footer-links"><a href="#menu">Menu</a><a href="#customize">Customize</a><a href="#order">Order</a><a href="#contact">Contact</a></div></div></footer>

        <nav className="mobile-quick-nav" aria-label="Mobile quick navigation"><a href="#menu">Menu</a><a href="#customize">Customize</a><a href="#order">Order</a></nav>
      </div>
    </>
  );
}
