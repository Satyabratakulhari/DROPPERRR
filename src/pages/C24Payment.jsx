import { motion } from "framer-motion";
import {
    ArrowLeft,
    Banknote,
    Check,
    CreditCard,
    Loader2,
    Lock,
    ShieldCheck,
    Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";

import "./Trip.css";

const methods = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "cash", label: "Pay in person", icon: Banknote },
];

function formatINR(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function C24Payment({ trip, onBack, onPaid, onViewBooking, onHome }) {
  const { person, booking, price } = trip;
  const firstName = person.name.split(" ")[0];

  const [method, setMethod] = useState("upi");
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("form"); // form | processing | done

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (status !== "processing") return undefined;

    const timer = setTimeout(() => {
      onPaid?.(method);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function setCardField(field, raw) {
    let value = raw;

    if (field === "number") {
      value = raw
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (field === "expiry") {
      const digits = raw.replace(/\D/g, "").slice(0, 4);
      value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }

    if (field === "cvv") value = raw.replace(/\D/g, "").slice(0, 3);

    setCard((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next = {};

    if (method === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upi.trim())) {
      next.upi = "Enter a valid UPI ID, like name@bank.";
    }

    if (method === "card") {
      if (card.number.replace(/\s/g, "").length !== 16) {
        next.number = "Enter a 16-digit card number.";
      }

      const [mm, yy] = card.expiry.split("/");
      if (!mm || !yy || yy.length !== 2 || Number(mm) < 1 || Number(mm) > 12) {
        next.expiry = "Use MM/YY.";
      }

      if (card.cvv.length !== 3) next.cvv = "3 digits.";
      if (card.name.trim().length < 2) next.name = "Enter the name on the card.";
    }

    return next;
  }

  function handlePay(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length === 0) setStatus("processing");
  }

  const processing = status === "processing";

  /* ---------- Success ---------- */
  if (status === "done") {
    return (
      <main className="tp-app">
        <header className="tp-topbar">
          <span className="tp-spacer" />
          <span className="tp-brand">
            dropperrr<span>.</span>
          </span>
          <span className="tp-spacer" />
        </header>

        <div className="tp-wrap tp-wrap-narrow">
          <motion.div
            className="tp-success"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="tp-success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
            >
              <Check size={38} strokeWidth={3} />
            </motion.div>

            <h1>{method === "cash" ? "Booking confirmed!" : "Payment successful!"}</h1>
            <p>
              {method === "cash"
                ? `You'll pay ${formatINR(price.total)} to ${firstName} when you meet.`
                : `${formatINR(price.total)} paid (demo). ${firstName} has been notified.`}{" "}
              See you on {booking.dateLabel} at {booking.slot}.
            </p>

            <div className="tp-actions">
              <button type="button" className="tp-primary" onClick={onViewBooking}>
                View my booking
              </button>
              <button type="button" className="tp-secondary" onClick={onHome}>
                Find more locals
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  /* ---------- Form ---------- */
  return (
    <main className="tp-app">
      <header className="tp-topbar">
        <button type="button" className="tp-back" onClick={onBack} disabled={processing}>
          <ArrowLeft size={18} />
          <span>Back to booking</span>
        </button>
        <span className="tp-brand">
          dropperrr<span>.</span>
        </span>
        <span className="tp-top-note">
          <Lock size={15} />
          <span>Demo payment</span>
        </span>
      </header>

      <div className="tp-wrap">
        <h1 className="tp-title">Complete your payment</h1>
        <p className="tp-sub">
          Choose how you'd like to pay {firstName}. Your booking is confirmed once
          this step is done.
        </p>

        <div className="tp-grid">
          <form className="tp-card" onSubmit={handlePay} noValidate>
            <div className="tp-demo">
              <ShieldCheck size={16} />
              <span>
                This is a prototype. No real payment happens, so please don't
                enter real card or UPI details.
              </span>
            </div>

            <div className="tp-methods" role="radiogroup" aria-label="Payment method">
              {methods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={method === id}
                  className={method === id ? "is-selected" : ""}
                  onClick={() => {
                    setMethod(id);
                    setErrors({});
                  }}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {method === "upi" && (
              <div className={`tp-field ${errors.upi ? "has-error" : ""}`}>
                <label htmlFor="tp-upi">UPI ID</label>
                <input
                  id="tp-upi"
                  type="text"
                  autoComplete="off"
                  placeholder="name@bank"
                  value={upi}
                  onChange={(e) => {
                    setUpi(e.target.value);
                    setErrors({});
                  }}
                />
                {errors.upi && <small>{errors.upi}</small>}
              </div>
            )}

            {method === "card" && (
              <>
                <div className={`tp-field ${errors.number ? "has-error" : ""}`}>
                  <label htmlFor="tp-card-number">Card number</label>
                  <input
                    id="tp-card-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={(e) => setCardField("number", e.target.value)}
                  />
                  {errors.number && <small>{errors.number}</small>}
                </div>

                <div className="tp-two">
                  <div className={`tp-field ${errors.expiry ? "has-error" : ""}`}>
                    <label htmlFor="tp-expiry">Expiry</label>
                    <input
                      id="tp-expiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => setCardField("expiry", e.target.value)}
                    />
                    {errors.expiry && <small>{errors.expiry}</small>}
                  </div>

                  <div className={`tp-field ${errors.cvv ? "has-error" : ""}`}>
                    <label htmlFor="tp-cvv">CVV</label>
                    <input
                      id="tp-cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="•••"
                      value={card.cvv}
                      onChange={(e) => setCardField("cvv", e.target.value)}
                    />
                    {errors.cvv && <small>{errors.cvv}</small>}
                  </div>
                </div>

                <div className={`tp-field ${errors.name ? "has-error" : ""}`}>
                  <label htmlFor="tp-card-name">Name on card</label>
                  <input
                    id="tp-card-name"
                    type="text"
                    autoComplete="off"
                    placeholder="Full name"
                    value={card.name}
                    onChange={(e) => setCardField("name", e.target.value)}
                  />
                  {errors.name && <small>{errors.name}</small>}
                </div>
              </>
            )}

            {method === "cash" && (
              <p className="tp-cash">
                Pay {firstName} directly when you meet. Please carry the exact
                amount of {formatINR(price.total)} if you can.
              </p>
            )}

            <button type="submit" className="tp-coral" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 size={19} className="tp-spin" /> Processing…
                </>
              ) : method === "cash" ? (
                <>Confirm booking</>
              ) : (
                <>
                  <Lock size={17} /> Pay {formatINR(price.total)}
                </>
              )}
            </button>
          </form>

          <aside className="tp-aside">
            <div className="tp-card">
              <div className="tp-person">
                <img src={person.image} alt={person.name} />
                <div>
                  <strong>{person.name}</strong>
                  <span>
                    {booking.dateLabel} · {booking.slot}
                  </span>
                </div>
              </div>

              <div className="tp-rows" style={{ marginTop: 20 }}>
                <div>
                  <span>
                    {formatINR(person.price)} × {booking.hours} h
                  </span>
                  <span>{formatINR(price.subtotal)}</span>
                </div>
                <div>
                  <span>Service fee (5%)</span>
                  <span>{formatINR(price.fee)}</span>
                </div>
                <div className="is-total">
                  <span>Total</span>
                  <strong>{formatINR(price.total)}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default C24Payment;