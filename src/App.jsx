import React, { useMemo, useState } from "react";

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
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80",
    options: [
      { label: "6 inch Heart Cake", serves: "6-8", price: 40 },
      { label: "8 inch Heart Cake", serves: "10-14", price: 55 },
    ],
  },
  {
    id: "round-cake",
    name: "Round Cake",
    category: "Cakes",
    badge: "Fresh Pick",
    description: "Classic round cake, perfect for birthdays, parties, and simple custom designs.",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80",
    options: [
      { label: "6 inch Round Cake", serves: "6-8", price: 40 },
      { label: "8 inch Round Cake", serves: "10-14", price: 55 },
      { label: "10 inch Round Cake", serves: "18-24", price: 65 },
    ],
  },
  {
    id: "cupcakes",
    name: "Cupcakes",
    category: "Cupcakes",
    badge: "Rich Flavor",
    description: "Fresh decorated cupcakes sold by the dozen.",
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80",
    options: [
      { label: "1 Dozen Cupcakes", serves: "12", price: 20 },
    ],
  },
  {
    id: "cookies",
    name: "Cookies",
    category: "Cookies",
    badge: "Trending",
    description: "Classic cookies sold by the dozen. Choose your favorite flavor.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
    options: [
      { label: "M&M Cookies - 1 Dozen", serves: "12", price: 25 },
      { label: "Chocolate Chip Cookies - 1 Dozen", serves: "12", price: 25 },
      { label: "Red Velvet Cookies - 1 Dozen", serves: "12", price: 25 },
    ],
  },
  {
    id: "special-cookies",
    name: "Special Cookies",
    category: "Cookies",
    badge: "Smooth & Creamy",
    description: "Loaded specialty cookies with toppings, sold by the dozen.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80",
    options: [
      { label: "S'mores Overload - 1 Dozen", serves: "12", price: 30 },
      { label: "Triple Cookie Chaos - 1 Dozen", serves: "12", price: 30 },
      { label: "Peanut Butter Overdrive - 1 Dozen", serves: "12", price: 30 },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    category: "Desserts",
    badge: "Party Ready",
    description: "Sweet dessert trays and specialty treats for pickup orders.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    options: [
      { label: "Churro Cheesecake", serves: "Tray", price: 40 },
      { label: "Churro Cheesecake + Fresh Fruit", serves: "Tray", price: 45 },
    ],
  },
];

const categories = ["All", "Cakes", "Cupcakes", "Cookies", "Desserts"];
const cakeFlavors = ["Warm Vanilla", "Rich Fudge Chocolate", "Red Velvet Love", "Birthday Sprinkle", "Spiced Carrot", "Sweet Strawberry"];
const fillings = ["No Filling", "Strawberry +$5", "Nutella +$5", "Cookie Butter +$5", "Bananas +$5", "Cookies of Your Choice +$5"];
const frostings = ["Butter Cream", "Whipped Cream"];
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
const pickupTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const starterReviews = [];

const faqs = [
  { q: "How much notice do I need to order?", a: `Please request pickup ${business.noticeText} ahead. Rush orders may be available depending on the schedule.` },
  { q: "Is my order confirmed after submitting?", a: "Not yet. Your request is sent for review. Lina will confirm availability, design details, final price, and deposit." },
  { q: "Do you take deposits?", a: `A ${business.depositPercent}% deposit is required to hold your pickup date. The remaining balance is usually due at pickup.` },
  { q: "Can I request custom colors, writing, add ons, or inspiration photos?", a: "Yes. Use the customization section for flavors, colors, cake message, add ons, and inspiration photos. If you use the email button, attach the inspiration photos before sending." },
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
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inspirationFiles, setInspirationFiles] = useState([]);
  const [liveReviews, setLiveReviews] = useState(() => {
    try {
      const savedReviews = localStorage.getItem("bakewithlinaa_reviews");
      return savedReviews ? JSON.parse(savedReviews) : starterReviews;
    } catch {
      return starterReviews;
    }
  });
  const [reviewForm, setReviewForm] = useState({ name: "", rating: "5", text: "" });
  const [reviewMessage, setReviewMessage] = useState("");

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
    color: colors[0],
    message: "",
    addOn: addOns[0].label,
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const text = `${product.name} ${product.category} ${product.description} ${product.badge} ${product.options.map((o) => o.label).join(" ")}`.toLowerCase();
      return matchesCategory && text.includes(search.toLowerCase());
    });
  }, [category, search]);

  const cakeQuantity = cart.reduce((sum, item) => item.category === "Cakes" ? sum + item.quantity : sum, 0);
  const fillingCost = custom.filling === "No Filling" ? 0 : cakeQuantity * 5;
  const selectedAddOn = addOns.find((item) => item.label === custom.addOn) || addOns[0];
  const addOnCost = selectedAddOn.price;
  const productSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = productSubtotal + fillingCost + addOnCost;
  const deposit = subtotal > 0 ? Math.round(subtotal * (business.depositPercent / 100)) : 0;
  const balance = subtotal - deposit;

  const orderSummary = useMemo(() => {
    const items = cart.map((item) => `- ${item.quantity}x ${item.name} (${item.option}, serves ${item.serves}) - ${money(item.price * item.quantity)}`);
    const photoNames = inspirationFiles.length > 0 ? inspirationFiles.map((file) => `- ${file.name}`) : ["No inspiration photos selected"];

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
      fillingCost > 0 ? `Filling add-on total: ${money(fillingCost)}` : "Filling add-on total: $0.00",
      `Frosting: ${custom.frosting}`,
      `Colors: ${custom.color}`,
      `Cake message: ${custom.message || "None"}`,
      `Add on: ${custom.addOn}${selectedAddOn.varies ? " - price varies" : selectedAddOn.price > 0 ? ` - ${money(selectedAddOn.price)}` : " - free"}`,
      "",
      "Inspiration Photos:",
      ...photoNames,
      "Reminder: If inspiration photos were selected, please attach them to this email before sending.",
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
        return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item);
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

    setSubmitted(false);
  }

  function updateQuantity(key, amount) {
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
  }

  function removeItem(key) {
    setCart((current) => current.filter((item) => item.key !== key));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!customer.name || !customer.phone || cart.length === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("order-success")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  function handleReviewSubmit(event) {
    event.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;

    const newReview = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      rating: Number(reviewForm.rating),
      text: reviewForm.text.trim(),
      date: new Date().toLocaleDateString(),
    };

    const updatedReviews = [newReview, ...liveReviews];
    setLiveReviews(updatedReviews);
    localStorage.setItem("bakewithlinaa_reviews", JSON.stringify(updatedReviews));
    setReviewForm({ name: "", rating: "5", text: "" });
    setReviewMessage("Thank you! Your review was added.");
    setTimeout(() => setReviewMessage(""), 2500);
  }

  async function copyOrder() {
    try {
      await navigator.clipboard.writeText(orderSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: radial-gradient(circle at top left, rgba(255,255,255,0.95), transparent 30%), linear-gradient(180deg, #fff8fc 0%, #fff2f8 40%, #ffeef6 100%);
          color: #1c1917;
        }
        a { color: inherit; text-decoration: none; }
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at 20% 10%, rgba(255,255,255,0.85), transparent 18%), radial-gradient(circle at 80% 18%, rgba(255,255,255,0.7), transparent 12%), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.45), transparent 12%), linear-gradient(180deg, #fff8fc 0%, #fff2f8 40%, #ffeef6 100%);
          position: relative;
          overflow: hidden;
        }
        .container { width: min(1180px, calc(100% - 32px)); margin: 0 auto; position: relative; z-index: 2; }
        .bow-corner { position: fixed; top: 14px; right: 16px; z-index: 120; width: 58px; height: 58px; display: grid; place-items: center; border-radius: 18px; background: linear-gradient(135deg, #ff7db7, #ff1493); color: white; font-size: 28px; box-shadow: 0 10px 25px rgba(255, 93, 162, 0.35); border: 2px solid rgba(255,255,255,0.75); }
        .sparkles { pointer-events: none; position: fixed; inset: 0; z-index: 1; overflow: hidden; }
        .sparkle { position: absolute; color: rgba(255, 120, 180, 0.55); text-shadow: 0 0 12px rgba(255,255,255,0.9); animation: twinkle 3.8s ease-in-out infinite; user-select: none; }
        .s1 { top: 90px; left: 6%; font-size: 22px; animation-delay: 0s; } .s2 { top: 160px; right: 12%; font-size: 18px; animation-delay: 0.8s; } .s3 { top: 420px; left: 10%; font-size: 16px; animation-delay: 1.1s; } .s4 { top: 620px; right: 18%; font-size: 20px; animation-delay: 1.6s; } .s5 { top: 980px; left: 20%; font-size: 17px; animation-delay: 0.5s; } .s6 { top: 1240px; right: 9%; font-size: 24px; animation-delay: 1.9s; } .s7 { top: 1520px; left: 8%; font-size: 15px; animation-delay: 1.3s; } .s8 { top: 1860px; right: 16%; font-size: 19px; animation-delay: 2.2s; }
        @keyframes twinkle { 0%, 100% { opacity: 0.35; transform: scale(0.95) rotate(0deg); } 50% { opacity: 1; transform: scale(1.15) rotate(12deg); } }
        .header { position: sticky; top: 0; z-index: 50; background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(14px); border-bottom: 1px solid #ffd8ea; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo { width: 46px; height: 46px; border-radius: 18px; display: grid; place-items: center; background: linear-gradient(135deg, #ff7db7, #ff1493); color: white; font-size: 24px; box-shadow: 0 10px 24px rgba(255, 93, 162, 0.28); }
        .brand h1 { margin: 0; font-size: 22px; letter-spacing: -0.04em; }
        .brand p { margin: 2px 0 0; color: #8c5a70; font-size: 13px; font-weight: 700; }
        .nav { display: flex; gap: 22px; font-weight: 900; color: #6f4f5e; font-size: 14px; }
        .nav a:hover { color: #ff1493; }
        .btn { border: 0; cursor: pointer; border-radius: 999px; padding: 13px 20px; font-weight: 900; font-size: 14px; display: inline-flex; justify-content: center; align-items: center; transition: 0.2s ease; font-family: inherit; }
        .btn-dark { background: #31121f; color: white; } .btn-dark:hover { background: #ff1493; }
        .btn-pink { background: linear-gradient(135deg, #ff1493, #ff1493); color: white; box-shadow: 0 12px 26px rgba(255, 93, 162, 0.25); }
        .btn-pink:hover { background: linear-gradient(135deg, #ff1493, #f93d89); transform: translateY(-1px); }
        .btn-white { background: rgba(255,255,255,0.95); color: #31121f; border: 1px solid #ffd6e8; } .btn-white:hover { border-color: #ff99c7; color: #ff1493; }
        .btn-green { background: #86efac; color: #052e16; }
        .btn:disabled { cursor: not-allowed; background: #d8c7d0; color: white; box-shadow: none; }
        .hero { background: radial-gradient(circle at 20% 0%, rgba(255,255,255,0.8), transparent 24%), linear-gradient(135deg, #fff7fb, #fff0f7, #ffe9f3); }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 44px; padding: 72px 0; align-items: center; }
        .pill { width: fit-content; display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.95); border: 1px solid #ffd8ea; color: #ff1493; padding: 10px 16px; border-radius: 999px; font-weight: 900; font-size: 14px; box-shadow: 0 10px 24px rgba(255, 93, 162, 0.08); }
        .hero h2 { margin: 18px 0 0; font-size: clamp(44px, 7vw, 82px); line-height: 0.95; letter-spacing: -0.07em; color: #ff1493; }
        .hero-text { margin-top: 22px; max-width: 680px; color: #6e5562; font-size: 19px; line-height: 1.8; font-weight: 500; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .stats { margin-top: 32px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 620px; }
        .stat { background: rgba(255,255,255,0.95); padding: 18px; border-radius: 26px; text-align: center; box-shadow: 0 10px 24px rgba(255, 93, 162, 0.08); border: 1px solid #ffe1ef; }
        .stat strong { display: block; color: #ff1493; font-size: 30px; } .stat span { color: #8c6777; font-size: 13px; font-weight: 900; }
        .hero-card { position: relative; background: rgba(255,255,255,0.96); padding: 12px; border-radius: 34px; box-shadow: 0 22px 60px rgba(255, 93, 162, 0.18); border: 1px solid #ffe1ef; }
        .hero-card img { width: 100%; height: 530px; object-fit: cover; border-radius: 26px; display: block; }
        .featured-box { position: absolute; left: 28px; right: 28px; bottom: 28px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-radius: 24px; padding: 20px; box-shadow: 0 12px 32px rgba(255, 93, 162, 0.12); }
        .featured-box h3 { margin: 0; font-size: 18px; color: #421627; } .featured-box p { margin: 6px 0 0; color: #6e5562; line-height: 1.5; }
        section { padding: 64px 0; }
        .section-title { text-align: center; margin-bottom: 34px; }
        .eyebrow { margin: 0; color: #ff1493; font-size: 13px; font-weight: 1000; letter-spacing: 0.25em; text-transform: uppercase; }
        .section-title h2, .split-title h2 { margin: 8px 0 0; font-size: clamp(34px, 5vw, 48px); letter-spacing: -0.05em; color: #421627; }
        .section-title p, .split-title p { color: #6e5562; line-height: 1.7; max-width: 680px; margin: 12px auto 0; }
        .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .step-card { background: rgba(255,255,255,0.96); border: 1px solid #ffe1ef; border-radius: 30px; padding: 26px; box-shadow: 0 10px 28px rgba(255, 93, 162, 0.08); }
        .step-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; } .step-icon { font-size: 38px; } .step-num { font-size: 38px; font-weight: 1000; color: #ffe3ef; }
        .step-card h3 { margin: 0; font-size: 20px; color: #421627; } .step-card p { color: #6e5562; line-height: 1.6; margin-bottom: 0; }
        .menu-head { display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; margin-bottom: 32px; } .split-title { max-width: 720px; } .controls { display: flex; gap: 10px; flex-wrap: wrap; }
        input, select, textarea { width: 100%; border: 1px solid #ffdbe9; background: rgba(255,255,255,0.95); color: #421627; border-radius: 18px; padding: 14px 16px; font-size: 15px; font-weight: 700; outline: none; font-family: inherit; }
        input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 4px #ffd4e6; }
        textarea { resize: vertical; min-height: 120px; }
        label span { display: block; margin-bottom: 8px; color: #8c6777; font-size: 12px; font-weight: 1000; text-transform: uppercase; letter-spacing: 0.12em; }
        .cake-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .cake-card { overflow: hidden; background: rgba(255,255,255,0.96); border: 1px solid #ffe1ef; border-radius: 34px; box-shadow: 0 10px 28px rgba(255, 93, 162, 0.08); transition: 0.2s ease; }
        .cake-card:hover { transform: translateY(-4px); box-shadow: 0 18px 38px rgba(255, 93, 162, 0.14); }
        .cake-image { position: relative; } .cake-image img { width: 100%; height: 230px; object-fit: cover; display: block; }
        .badge { position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.95); color: #ff1493; border-radius: 999px; padding: 8px 12px; font-size: 12px; font-weight: 1000; box-shadow: 0 8px 18px rgba(255, 93, 162, 0.12); }
        .cake-body { padding: 22px; } .cake-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
        .tag { background: #ffe7f1; color: #ff1493; padding: 7px 11px; border-radius: 999px; font-size: 12px; font-weight: 1000; } .from { font-size: 14px; font-weight: 1000; color: #5a3948; }
        .cake-card h3 { margin: 0; font-size: 25px; letter-spacing: -0.04em; color: #421627; } .cake-card p { color: #6e5562; line-height: 1.6; }
        .size-box { background: #fff5fa; border-radius: 24px; padding: 16px; margin-top: 18px; border: 1px solid #ffe3ef; }
        .size-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-weight: 900; color: #6a4c59; }
        .price { color: #ff1493; font-size: 24px; font-weight: 1000; } .full { width: 100%; margin-top: 18px; }
        .white-section { background: rgba(255,255,255,0.45); }
        .custom-box { background: rgba(255,245,250,0.95); border: 1px solid #ffe1ef; border-radius: 34px; padding: 22px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; box-shadow: 0 10px 24px rgba(255, 93, 162, 0.07); }
        .wide { grid-column: span 2; } .fullwide { grid-column: 1 / -1; }
        .file-list { margin: 10px 0 0; color: #6e5562; font-size: 13px; line-height: 1.6; }
        .order-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 32px; align-items: start; }
        .form-card { background: rgba(255,255,255,0.96); border: 1px solid #ffe1ef; border-radius: 34px; padding: 24px; box-shadow: 0 10px 28px rgba(255, 93, 162, 0.08); display: grid; gap: 18px; }
        .two { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; } .hint { color: #8c6777; font-size: 12px; font-weight: 800; margin: 8px 0 0; line-height: 1.5; }
        .cart { position: sticky; top: 94px; background: linear-gradient(180deg, #3a1727, #241019); color: white; border-radius: 34px; padding: 24px; box-shadow: 0 18px 44px rgba(58, 23, 39, 0.25); }
        .cart-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 18px; }
        .cart-head p { margin: 0; color: #ffb9d6; font-size: 13px; font-weight: 1000; letter-spacing: 0.2em; text-transform: uppercase; } .cart-head h2 { margin: 6px 0 0; font-size: 32px; }
        .empty-cart { text-align: center; padding: 48px 0; color: rgba(255,255,255,0.65); } .empty-cart div { font-size: 52px; } .empty-cart strong { display: block; color: white; margin-top: 12px; font-size: 18px; }
        .cart-item { padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); } .cart-item-top { display: flex; justify-content: space-between; gap: 16px; } .cart-item h3 { margin: 0; font-size: 17px; } .cart-item p { margin: 6px 0 0; color: rgba(255,255,255,0.62); font-size: 14px; }
        .delete-btn { border: 0; background: rgba(255,255,255,0.1); color: white; border-radius: 12px; padding: 8px 10px; cursor: pointer; font-weight: 900; } .delete-btn:hover { background: #ff1493; }
        .quantity-row { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; } .quantity { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); padding: 5px; border-radius: 999px; }
        .quantity button { border: 0; color: white; background: rgba(255,255,255,0.1); cursor: pointer; border-radius: 999px; width: 34px; height: 34px; font-size: 20px; } .quantity span { width: 28px; text-align: center; font-weight: 1000; }
        .cart-total-box { background: rgba(255,255,255,0.1); border-radius: 26px; padding: 20px; margin-top: 20px; } .total-line { display: flex; justify-content: space-between; color: rgba(255,255,255,0.75); margin-bottom: 12px; gap: 12px; }
        .grand-total { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 16px; margin-top: 16px; font-size: 26px; font-weight: 1000; }
        .custom-summary { background: rgba(255,255,255,0.1); border-radius: 26px; padding: 20px; margin-top: 20px; color: rgba(255,255,255,0.72); line-height: 1.7; } .custom-summary strong { color: white; }
        .success { background: rgba(34, 197, 94, 0.16); color: #dcfce7; border: 1px solid rgba(134, 239, 172, 0.35); border-radius: 26px; padding: 20px; margin-top: 20px; } .success h3 { margin: 0; } .success p { color: rgba(240,253,244,0.8); line-height: 1.6; } .success-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .review-section-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 22px; align-items: start; }
        .review-form { background: rgba(255,255,255,0.96); border: 1px solid #ffe1ef; border-radius: 30px; padding: 26px; box-shadow: 0 10px 24px rgba(255, 93, 162, 0.07); display: grid; gap: 16px; }
        .review-form button { width: 100%; }
        .review-message { color: #15803d; font-size: 13px; font-weight: 900; margin: 0; }
        .reviews { display: grid; grid-template-columns: 1fr; gap: 18px; }
        .review-card { background: rgba(255,255,255,0.96); border: 1px solid #ffe1ef; border-radius: 30px; padding: 26px; box-shadow: 0 10px 24px rgba(255, 93, 162, 0.07); }
        .stars { color: #ff1493; letter-spacing: 4px; font-size: 18px; margin-bottom: 18px; }
        .review-card p { line-height: 1.7; color: #5e4552; }
        .review-card strong { display: block; margin-top: 18px; color: #421627; }
        .review-date { color: #8c6777; font-size: 12px; font-weight: 800; margin-top: 6px; }
        .empty-reviews { background: rgba(255,255,255,0.8); border: 1px dashed #ffb9d6; border-radius: 30px; padding: 26px; color: #6e5562; line-height: 1.7; }
        .faq-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 34px; } details { background: rgba(255,255,255,0.96); border: 1px solid #ffe1ef; border-radius: 26px; padding: 20px; margin-bottom: 14px; box-shadow: 0 10px 28px rgba(255, 93, 162, 0.06); } summary { cursor: pointer; font-weight: 1000; font-size: 17px; color: #421627; } details p { color: #6e5562; line-height: 1.7; }
        .warning { background: #fff9fc; color: #78350f; border: 1px solid #ffd8ea; border-radius: 26px; padding: 20px; line-height: 1.6; }
        .contact-box { background: linear-gradient(135deg, #ff1493, #ff1493); color: white; border-radius: 34px; padding: 34px; display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 24px; box-shadow: 0 18px 44px rgba(255, 93, 162, 0.24); position: relative; overflow: hidden; } .contact-box::before { content: "✦"; position: absolute; top: 18px; right: 22px; font-size: 20px; opacity: 0.6; }
        .contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; } .contact-card { background: rgba(255,255,255,0.16); border-radius: 24px; padding: 18px; backdrop-filter: blur(8px); } .contact-card div { font-size: 28px; } .contact-card strong { display: block; margin-top: 12px; } .contact-card p { color: rgba(255,255,255,0.9); margin-bottom: 0; font-size: 14px; word-break: break-word; line-height: 1.5; }
        .footer { background: rgba(255,255,255,0.82); border-top: 1px solid #ffe1ef; padding: 28px 0; } .footer-inner { display: flex; justify-content: space-between; gap: 18px; color: #8c6777; font-weight: 800; font-size: 14px; } .footer-links { display: flex; gap: 16px; flex-wrap: wrap; }
        @media (max-width: 900px) { .nav { display: none; } .hero-grid, .order-grid, .faq-grid, .contact-box { grid-template-columns: 1fr; } .steps, .cake-grid, .reviews { grid-template-columns: repeat(2, 1fr); } .contact-cards { grid-template-columns: repeat(3, 1fr); } .custom-box { grid-template-columns: 1fr 1fr; } .hero-card img { height: 420px; } .cart { position: static; } }
        @media (max-width: 600px) { .brand p { display: none; } .steps, .cake-grid, .reviews, .contact-cards, .custom-box, .two, .success-actions, .stats { grid-template-columns: 1fr; } .wide, .fullwide { grid-column: span 1; } .review-section-grid { grid-template-columns: 1fr; } .menu-head { align-items: stretch; flex-direction: column; } .controls { flex-direction: column; } .hero h2 { font-size: 46px; } .hero-card img { height: 340px; } .header-inner { gap: 10px; } .btn { padding: 12px 16px; } .bow-corner { width: 50px; height: 50px; font-size: 24px; top: 12px; right: 12px; } }
      `}</style>

      <div className="page">
        <div className="bow-corner">🎀</div>
        <div className="sparkles">
          <span className="sparkle s1">✦</span><span className="sparkle s2">✦</span><span className="sparkle s3">✦</span><span className="sparkle s4">✦</span><span className="sparkle s5">✦</span><span className="sparkle s6">✦</span><span className="sparkle s7">✦</span><span className="sparkle s8">✦</span>
        </div>

        <header className="header">
          <div className="container header-inner">
            <a href="#top" className="brand">
              <div className="logo">🍰</div>
              <div><h1>{business.name}</h1><p>{business.tagline}</p></div>
            </a>
            <nav className="nav"><a href="#menu">Menu</a><a href="#customize">Customize</a><a href="#reviews">Reviews</a><a href="#faq">FAQ</a></nav>
            <a href="#menu" className="btn btn-dark">Order Now</a>
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
                <div className="stats"><div className="stat"><strong>1-3</strong><span>Weeks notice</span></div><div className="stat"><strong>6</strong><span>Menu options</span></div><div className="stat"><strong>{business.depositPercent}%</strong><span>Deposit required</span></div></div>
              </div>
              <div className="hero-card"><img src="https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=1200&q=80" alt="Decorated dessert" /><div className="featured-box"><h3>Featured this week</h3><p>Heart cakes, custom cookies, cupcakes, and churro cheesecake.</p></div></div>
            </div>
          </section>

          <section id="how">
            <div className="container">
              <div className="section-title"><p className="eyebrow">Easy ordering</p><h2>How it works</h2></div>
              <div className="steps">
                {[["🍰", "Pick your treat", "Choose a cake, cupcakes, cookies, special cookies, or dessert."], ["🎨", "Customize it", "Select cake flavor, filling, frosting, colors, message, and inspiration photos."], ["📅", "Choose pickup", "Pick your pickup day and time. Please order 1 to 3 weeks ahead."], ["✅", "Send request", "Lina confirms availability, deposit, and final details."]].map((step, index) => (
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
              <div className="section-title"><p className="eyebrow">Make it yours</p><h2>Customize your cake</h2><p>These choices apply to cakes in your order. Fillings are an extra $5 per cake item.</p></div>
              <div className="custom-box">
                <label><span>Cake flavor</span><select value={custom.flavor} onChange={(event) => setCustom({ ...custom, flavor: event.target.value })}>{cakeFlavors.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Filling</span><select value={custom.filling} onChange={(event) => setCustom({ ...custom, filling: event.target.value })}>{fillings.map((item) => <option key={item}>{item}</option>)}</select><p className="hint">Each filling adds $5 per cake item.</p></label>
                <label><span>Frosting</span><select value={custom.frosting} onChange={(event) => setCustom({ ...custom, frosting: event.target.value })}>{frostings.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Colors</span><select value={custom.color} onChange={(event) => setCustom({ ...custom, color: event.target.value })}>{colors.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="wide"><span>Cake message</span><input value={custom.message} onChange={(event) => setCustom({ ...custom, message: event.target.value })} placeholder="Example: Happy Birthday Lina" /></label>
                <label className="wide"><span>Add ons</span><select value={custom.addOn} onChange={(event) => setCustom({ ...custom, addOn: event.target.value })}>{addOns.map((item) => <option key={item.label} value={item.label}>{item.label} • {item.varies ? "Price varies" : item.price === 0 ? "Free" : money(item.price)}</option>)}</select><p className="hint">Topper of your choice is price varies and will be confirmed before payment.</p></label>
                <label className="fullwide"><span>Inspiration photos</span><input form="order-form" name="attachment" type="file" accept="image/*" multiple onChange={(event) => setInspirationFiles(Array.from(event.target.files || []))} /><p className="hint">When you press Send Email Request, these photos can be sent with the form. Keep total photo size under 10MB.</p>{inspirationFiles.length > 0 && <div className="file-list"><strong>Selected photos:</strong>{inspirationFiles.map((file) => <div key={file.name}>• {file.name}</div>)}</div>}</label>
              </div>
            </div>
          </section>

          <section id="order">
            <div className="container order-grid">
              <div>
                <div className="split-title"><p className="eyebrow">Order Details</p><h2>Pickup information</h2><p>Fill this out after adding treats. Lina will confirm availability, final design details, and payment.</p></div>
                <form
                  id="order-form"
                  className="form-card"
                  action={`https://formsubmit.co/${business.email}`}
                  method="POST"
                  encType="multipart/form-data"
                >
                  <input type="hidden" name="_subject" value={`${business.name} Order Request`} />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="Order Summary" value={orderSummary} />
                  <input type="hidden" name="Product Subtotal" value={money(productSubtotal)} />
                  <input type="hidden" name="Filling Add-on" value={money(fillingCost)} />
                  <input type="hidden" name="Total" value={money(subtotal)} />
                  <input type="hidden" name="Required Deposit" value={money(deposit)} />
                  <input type="hidden" name="Estimated Balance" value={money(balance)} />
                  <div className="two"><label><span>Name *</span><input name="Customer Name" required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Your name" /></label><label><span>Phone *</span><input name="Customer Phone" required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Your phone number" /></label></div>
                  <label><span>Instagram</span><input name="Customer Instagram" type="text" value={customer.instagram} onChange={(event) => setCustomer({ ...customer, instagram: event.target.value })} placeholder="@yourinstagram" /></label>
                  <div className="two"><label><span>Pickup date *</span><input name="Pickup Date" required type="date" value={customer.pickupDate} onChange={(event) => setCustomer({ ...customer, pickupDate: event.target.value })} /><p className="hint">Please order {business.noticeText} ahead.</p></label><label><span>Pickup time</span><select name="Pickup Time" value={customer.pickupTime} onChange={(event) => setCustomer({ ...customer, pickupTime: event.target.value })}>{pickupTimes.map((time) => <option key={time}>{time}</option>)}</select></label></div>
                  <label><span>Extra notes</span><textarea name="Extra Notes" value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} placeholder="Example: Theme is butterflies, add gold details, send me payment link." /></label>
                  <button type="submit" className="btn btn-pink" disabled={!customer.name || !customer.phone || cart.length === 0}>Send Email Request</button>
                  <p className="hint">This sends the request directly to {business.email}. The first test submission may require email confirmation before requests start arriving.</p>
                </form>
              </div>

              <aside className="cart">
                <div className="cart-head"><div><p>Summary</p><h2>Your order</h2></div><div style={{ fontSize: 34 }}>🛒</div></div>
                {cart.length === 0 ? <div className="empty-cart"><div>🍰</div><strong>Your order is empty</strong><p>Add something from the menu to get started.</p></div> : <div>{cart.map((item) => <div className="cart-item" key={item.key}><div className="cart-item-top"><div><h3>{item.name}</h3><p>{item.option} • Serves {item.serves}</p><p style={{ color: "#ffb9d6", fontWeight: 900 }}>{money(item.price)} each</p></div><button className="delete-btn" onClick={() => removeItem(item.key)}>Delete</button></div><div className="quantity-row"><div className="quantity"><button onClick={() => updateQuantity(item.key, -1)}>-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.key, 1)}>+</button></div><strong>{money(item.price * item.quantity)}</strong></div></div>)}</div>}
                <div className="cart-total-box"><div className="total-line"><span>Product subtotal</span><span>{money(productSubtotal)}</span></div><div className="total-line"><span>Filling add-on</span><span>{money(fillingCost)}</span></div><div className="total-line"><span>Add-on cost</span><span>{selectedAddOn.varies ? "Price varies" : money(addOnCost)}</span></div><div className="total-line"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="total-line"><span>Required {business.depositPercent}% deposit</span><span>{money(deposit)}</span></div><div className="total-line"><span>Estimated balance</span><span>{money(balance)}</span></div><div className="grand-total"><span>Total</span><span>{money(subtotal)}</span></div></div>
                <div className="custom-summary"><p><strong>Cake flavor:</strong> {custom.flavor}</p><p><strong>Filling:</strong> {custom.filling}</p><p><strong>Frosting:</strong> {custom.frosting}</p><p><strong>Colors:</strong> {custom.color}</p><p><strong>Add on:</strong> {custom.addOn}{selectedAddOn.varies ? " (price varies)" : ""}</p><p><strong>Inspiration photos:</strong> {inspirationFiles.length} selected</p></div>
                {submitted && <div id="order-success" className="success"><h3>✅ Order request ready</h3><p>Send this request to {business.email}. If you chose inspiration photos, attach them to the email before sending.</p><div className="success-actions"><a className="btn btn-white" href={`mailto:${business.email}?subject=${encodeURIComponent(`${business.name} Order Request`)}&body=${encodeURIComponent(orderSummary)}`}>Email Request</a><button className="btn btn-green" onClick={copyOrder}>{copied ? "Copied!" : "Copy Order"}</button></div></div>}
              </aside>
            </div>
          </section>

          <section id="reviews" className="white-section">
            <div className="container">
              <div className="section-title"><p className="eyebrow">Reviews</p><h2>Real customer reviews</h2><p>Customers can leave a review right here after ordering from BakeWithLinaa.</p></div>
              <div className="review-section-grid">
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <label><span>Your name</span><input value={reviewForm.name} onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })} placeholder="Your name" required /></label>
                  <label><span>Rating</span><select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}><option value="5">★★★★★ 5 stars</option><option value="4">★★★★☆ 4 stars</option><option value="3">★★★☆☆ 3 stars</option><option value="2">★★☆☆☆ 2 stars</option><option value="1">★☆☆☆☆ 1 star</option></select></label>
                  <label><span>Your review</span><textarea value={reviewForm.text} onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })} placeholder="Tell us what you thought about your order." required /></label>
                  <button className="btn btn-pink" type="submit">Post Review</button>
                  {reviewMessage && <p className="review-message">{reviewMessage}</p>}
                </form>

                <div className="reviews">
                  {liveReviews.length === 0 ? (
                    <div className="empty-reviews">No reviews yet. Once customers post reviews, they will show up here.</div>
                  ) : (
                    liveReviews.map((review) => (
                      <div className="review-card" key={review.id}>
                        <div className="stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                        <p>“{review.text}”</p>
                        <strong>{review.name}</strong>
                        <div className="review-date">{review.date}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          <section id="faq"><div className="container faq-grid"><div className="split-title"><p className="eyebrow">FAQ & Policies</p><h2>Before you order</h2><p>These sections help customers understand pickup, deposits, and custom requests before they submit an order.</p></div><div>{faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}<div className="warning"><strong>⚠️ Allergy notice</strong><p>Products may contain or come into contact with milk, eggs, wheat, soy, peanuts, tree nuts, and other allergens.</p></div></div></div></section>

          <section id="contact"><div className="container"><div className="contact-box"><div><p className="eyebrow" style={{ color: "rgba(255,255,255,0.78)" }}>Contact</p><h2 style={{ fontSize: 42, marginTop: 8, marginBottom: 0 }}>Questions before ordering?</h2></div><div className="contact-cards"><div className="contact-card"><div>✉️</div><strong>Email</strong><p>{business.email}</p></div><div className="contact-card"><div>📸</div><strong>Instagram</strong><p>{business.instagram}</p></div><div className="contact-card"><div>📍</div><strong>Pickup</strong><p>{business.pickupArea}</p></div></div></div></div></section>
        </main>

        <footer className="footer"><div className="container footer-inner"><div>© {new Date().getFullYear()} {business.name}. All rights reserved.</div><div className="footer-links"><a href="#menu">Menu</a><a href="#customize">Customize</a><a href="#order">Order</a><a href="#contact">Contact</a></div></div></footer>
      </div>
    </>
  );
}
