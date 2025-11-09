"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; img: string; price: number };

const DEFAULT_UPI_ID = "niteshjeee@axl";
const PAYEE_NAME = "₹1 Demo Store";
const CURRENCY = "INR";
const AMOUNT = "1.00";

function buildUpiUri(params: { pa: string; pn: string; cu: string; am: string; tn: string }) {
  const qp = new URLSearchParams(params);
  return `upi://pay?${qp.toString()}`;
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`;
}
function getCookie(name: string) {
  const match = document.cookie.split("; ").find((r) => r.startsWith(`${encodeURIComponent(name)}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

function goToProcessingThenOpenUPI(upiUrl: string, orderStub: any) {
  localStorage.setItem("lastOrder", JSON.stringify(orderStub));
  const processingUrl = `/processing?order=${encodeURIComponent(orderStub.orderId)}`;
  window.history.pushState({}, "", processingUrl);
  setTimeout(() => (window.location.href = upiUrl), 200);
}

export default function Page() {
  const [upiId, setUpiId] = useState(DEFAULT_UPI_ID);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const val = localStorage.getItem("userName") || getCookie("userName") || "";
    if (val) setUserName(val);
  }, []);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
      setCookie("userName", userName);
    }
  }, [userName]);

  const products = useMemo<Product[]>(
    () => [
      { id: "p1", name: "Facewash", img: "/placeholder.png", price: 1 },
      { id: "p2", name: "Toothbrush", img: "/placeholder.png", price: 1 },
      { id: "p3", name: "Hand Soap", img: "/placeholder.png", price: 1 },
      { id: "p4", name: "Lip Balm", img: "/placeholder.png", price: 1 },
      { id: "p5", name: "Shampoo", img: "/placeholder.png", price: 1 },
      { id: "p6", name: "Conditioner", img: "/placeholder.png", price: 1 }
    ],
    []
  );

  const handlePay = (p: Product) => {
    const buyer = userName.trim() || "Guest";
    const orderId = `${p.id}-${Date.now()}`;
    const note = `${buyer} • ${p.name} • ID:${p.id} • ₹${p.price}`;

    const upiUrl = buildUpiUri({
      pa: upiId.trim() || DEFAULT_UPI_ID,
      pn: PAYEE_NAME,
      cu: CURRENCY,
      am: AMOUNT,
      tn: note
    });

    goToProcessingThenOpenUPI(upiUrl, {
      orderId,
      status: "pending",
      buyer,
      product: { id: p.id, name: p.name, price: p.price }
    });
  };

  return (
    <>
      <section className="hero">
        <div className="row" style={{ flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="muted" style={{ marginBottom: 6 }}>Your name (saved):</div>
            <input className="input" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" />
          </div>
          <div>
            <div className="muted" style={{ marginBottom: 6 }}>UPI ID (optional):</div>
            <input className="input" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@bank" />
          </div>
        </div>
      </section>

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <Image src={p.img} alt={p.name} width={512} height={512} />
            <h3>{p.name}</h3>
            <div className="row">
              <span className="badge">₹{p.price}</span>
              <span className="small muted">{userName || "Guest"} • {p.name} • ID:{p.id}</span>
            </div>
            <button className="button" onClick={() => handlePay(p)}>Pay ₹1 via UPI</button>
          </div>
        ))}
      </div>
      <div className="center small muted">Use mobile for UPI deep-links (desktop may not open apps).</div>
    </>
  );
              }
