"use client";
import { useEffect, useMemo, useState } from "react";

type Order = {
  orderId: string;
  status: "pending" | "marked_paid";
  buyer?: string;
  product?: { id: string; name: string; price: number };
};

export default function ProcessingPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oid = params.get("order");
    try {
      const last = JSON.parse(localStorage.getItem("lastOrder") || "{}");
      if (last?.orderId === oid) setOrder(last);
      else setOrder({ orderId: oid || "unknown", status: "pending" });
    } catch {
      setOrder({ orderId: oid || "unknown", status: "pending" });
    }
  }, []);

  const title = useMemo(
    () => (order?.status === "marked_paid" ? "Thanks! We’ll confirm soon." : "We’re processing your payment…"),
    [order?.status]
  );

  const handleIMadeThePayment = () => {
    if (!order) return;
    const updated = { ...order, status: "marked_paid" as const };
    setOrder(updated);
    localStorage.setItem("lastOrder", JSON.stringify(updated));
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h1 style={{ marginBottom: 10 }}>{title}</h1>
      <p className="muted" style={{ marginBottom: 12 }}>
        Demo only — if you’ve completed payment in your UPI app, tap below.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button className="button" onClick={handleIMadeThePayment}>I’ve paid</button>
        <button className="button" onClick={() => (window.location.href = "/")}>Back to store</button>
      </div>

      <div className="small muted" style={{ lineHeight: 1.8 }}>
        <div>Order ID: <code>{order?.orderId ?? "unknown"}</code></div>
        {order?.buyer && <div>Buyer: <strong>{order.buyer}</strong></div>}
        {order?.product && (
          <>
            <div>Product: <strong>{order.product.name}</strong></div>
            <div>ID: <code>{order.product.id}</code></div>
            <div>Price: ₹{order.product.price}</div>
          </>
        )}
      </div>
    </div>
  );
}
