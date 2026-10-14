import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Hotel,
    Loader2,
    Mail,
    MapPin,
    Minus,
    Phone,
    Plane,
    Plus,
    ShieldCheck,
    Train,
    User,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import "./C21BookingRequest.css";

const meetingTypes = [
  { id: "stay", label: "Hotel / stay", icon: Hotel },
  { id: "station", label: "Railway station", icon: Train },
  { id: "airport", label: "Airport", icon: Plane },
  { id: "other", label: "Other place", icon: MapPin },
];

const SERVICE_FEE_RATE = 0.05;

function formatINR(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function makeRequestId() {
  return `DRP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function C21BookingRequest({ person, booking, onBack, onDone, onSent, onTrack }) 
 {   const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    meetingType: "stay",
    meetingAddress: "",
    guests: 1,
    notes: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("form"); // form | sending | sent
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const firstName = person.name.split(" ")[0];

  const price = useMemo(() => {
    const subtotal = person.price * booking.hours;
    const fee = subtotal * SERVICE_FEE_RATE;
    return { subtotal, fee, total: subtotal + fee };
  }, [person.price, booking.hours]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next = {};

    if (form.name.trim().length < 2) next.name = "Please enter your full name.";

    const digits = form.phone.replace(/\D/g, "");
    if (digits.length !== 10) next.phone = "Enter a valid 10-digit mobile number.";

    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (form.meetingAddress.trim().length < 3) {
      next.meetingAddress = "Tell us where to meet.";
    }

    if (!form.agree) next.agree = "Please accept to continue.";

    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move to the first problem so phone users can see it.
      requestAnimationFrame(() => {
        document
          .querySelector(".bk-field.has-error, .bk-check.has-error")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setStatus("sending");
  }

  // Fake "sending" step (no backend yet).
  useEffect(() => {
    if (status !== "sending") return undefined;

    const timer = setTimeout(() => {
           const id = makeRequestId();
      setRequestId(id);
      onSent?.({
        requestId: id,
        details: {
          name: form.name,
          phone: form.phone,
          meetingAddress: form.meetingAddress,
          guests: form.guests,
        },
        price,
      });
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1300);

    return () => clearTimeout(timer);
  }, [status]);

  const sending = status === "sending";

  /* ---------------- Success screen ---------------- */
  if (status === "sent") {
    return (
      <main className="bk-app">
        <header className="bk-topbar bk-topbar-center">
          <span className="bk-brand">
            dropperrr<span>.</span>
          </span>
        </header>

        <motion.section
          className="bk-success"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bk-success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
          >
            <Check size={38} strokeWidth={3} />
          </motion.div>

          <h1>Request sent!</h1>
          <p className="bk-success-text">
            {firstName} has received your request and usually replies{" "}
            {person.responseTime.toLowerCase()}. You won't be charged until the
            request is accepted.
          </p>

          <div className="bk-ticket">
            <div className="bk-ticket-head">
              <span>Request ID</span>
              <strong>{requestId}</strong>
            </div>

            <div className="bk-ticket-person">
              <img src={person.image} alt={person.name} />
              <div>
                <strong>{person.name}</strong>
                <span>
                  {person.role} · {person.city}
                </span>
              </div>
            </div>

            <dl className="bk-ticket-list">
              <div>
                <dt>Date</dt>
                <dd>{booking.dateLabel}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{booking.slot}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{booking.hours} h</dd>
              </div>
              <div>
                <dt>Guests</dt>
                <dd>{form.guests}</dd>
              </div>
              <div className="bk-ticket-wide">
                <dt>Meeting point</dt>
                <dd>{form.meetingAddress}</dd>
              </div>
            </dl>

            <div className="bk-ticket-total">
              <span>Estimated total</span>
              <strong>{formatINR(price.total)}</strong>
            </div>
          </div>

          <div className="bk-success-actions">
            <button type="button" className="bk-primary" onClick={onDone}>
              Find more locals
            </button>
                        <button type="button" className="bk-secondary" onClick={onTrack}>
              Track my request
            </button>
          </div>
        </motion.section>
      </main>
    );
  }

  /* ---------------- Form screen ---------------- */
  return (
    <main className="bk-app">
      <header className="bk-topbar">
        <button type="button" className="bk-back" onClick={onBack} disabled={sending}>
          <ArrowLeft size={18} />
          <span>Back to profile</span>
        </button>

        <span className="bk-brand">
          dropperrr<span>.</span>
        </span>

        <span className="bk-secure">
          <ShieldCheck size={16} />
          <span>Secure request</span>
        </span>
      </header>

      <section className="bk-intro">
        <div className="bk-steps" aria-label="Progress">
          <span className="bk-step is-done">
            <b>
              <Check size={13} strokeWidth={3} />
            </b>
            Choose time
          </span>
          <i />
          <span className="bk-step is-current">
            <b>2</b>
            Your details
          </span>
          <i />
          <span className="bk-step">
            <b>3</b>
            Sent
          </span>
        </div>

        <h1>Request your booking</h1>
        <p>
          Share a few details with {firstName}. This is a request, so you won't
          pay anything right now.
        </p>
      </section>

      <div className="bk-layout">
        <motion.form
          className="bk-form"
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Contact */}
          <section className="bk-card">
            <h2>
              <User size={19} /> Your details
            </h2>

            <div className="bk-grid-2">
              <div className={`bk-field ${errors.name ? "has-error" : ""}`}>
                <label htmlFor="bk-name">Full name</label>
                <input
                  id="bk-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Satyabrata Kulhari"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
                {errors.name && <small>{errors.name}</small>}
              </div>

              <div className={`bk-field ${errors.phone ? "has-error" : ""}`}>
                <label htmlFor="bk-phone">
                  <Phone size={13} /> Mobile number
                </label>
                <div className="bk-phone-wrap">
                  <span>+91</span>
                  <input
                    id="bk-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    maxLength={11}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                {errors.phone && <small>{errors.phone}</small>}
              </div>
            </div>

            <div className={`bk-field ${errors.email ? "has-error" : ""}`}>
              <label htmlFor="bk-email">
                <Mail size={13} /> Email <em>(optional)</em>
              </label>
              <input
                id="bk-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && <small>{errors.email}</small>}
            </div>
          </section>

          {/* Meeting */}
          <section className="bk-card">
            <h2>
              <MapPin size={19} /> Where should {firstName} meet you?
            </h2>

            <div className="bk-meet-options" role="radiogroup" aria-label="Meeting point type">
              {meetingTypes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={form.meetingType === id}
                  className={form.meetingType === id ? "is-selected" : ""}
                  onClick={() => update("meetingType", id)}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <div className={`bk-field ${errors.meetingAddress ? "has-error" : ""}`}>
              <label htmlFor="bk-address">Name or address of the place</label>
              <input
                id="bk-address"
                type="text"
                placeholder={`e.g. Hotel name, ${person.city}`}
                value={form.meetingAddress}
                onChange={(e) => update("meetingAddress", e.target.value)}
              />
              {errors.meetingAddress && <small>{errors.meetingAddress}</small>}
            </div>

            <div className="bk-guests">
              <div>
                <strong>
                  <Users size={16} /> Number of guests
                </strong>
                <span>Including you</span>
              </div>

              <div className="bk-stepper">
                <button
                  type="button"
                  aria-label="Fewer guests"
                  disabled={form.guests <= 1}
                  onClick={() => update("guests", Math.max(1, form.guests - 1))}
                >
                  <Minus size={15} />
                </button>
                <strong>{form.guests}</strong>
                <button
                  type="button"
                  aria-label="More guests"
                  disabled={form.guests >= 6}
                  onClick={() => update("guests", Math.min(6, form.guests + 1))}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="bk-card">
            <h2>Anything {firstName} should know?</h2>

            <div className="bk-field">
              <label htmlFor="bk-notes">
                Notes <em>(optional)</em>
              </label>
              <textarea
                id="bk-notes"
                rows={4}
                maxLength={300}
                placeholder="Places you'd love to see, food preferences, accessibility needs…"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
              <span className="bk-counter">{form.notes.length}/300</span>
            </div>

            <label className={`bk-check ${errors.agree ? "has-error" : ""}`}>
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => update("agree", e.target.checked)}
              />
              <span className="bk-check-box">
                <Check size={14} strokeWidth={3} />
              </span>
              <span>
                I agree to meet in a public place and follow Dropperrr's safety
                guidelines.
                {errors.agree && <small>{errors.agree}</small>}
              </span>
            </label>
          </section>

          <button type="submit" className="bk-submit" disabled={sending}>
            {sending ? (
              <>
                <Loader2 size={19} className="bk-spin" /> Sending request…
              </>
            ) : (
              <>Send request · {formatINR(price.total)}</>
            )}
          </button>
        </motion.form>

        {/* Summary */}
        <aside className="bk-aside">
          <motion.div
            className="bk-summary"
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
          >
            <div className="bk-sum-person">
              <img src={person.image} alt={person.name} />
              <div>
                <strong>{person.name}</strong>
                <span>
                  {person.role} · {person.city}
                </span>
                {person.verified && (
                  <em>
                    <ShieldCheck size={12} /> Verified
                  </em>
                )}
              </div>
            </div>

            <ul className="bk-sum-details">
              <li>
                <Calendar size={16} />
                <span>{booking.dateLabel}</span>
              </li>
              <li>
                <Clock size={16} />
                <span>
                  {booking.slot} · {booking.hours} {booking.hours === 1 ? "hour" : "hours"}
                </span>
              </li>
            </ul>

            <div className="bk-price-rows">
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
              <div className="bk-price-total">
                <span>Total</span>
                <strong>{formatINR(price.total)}</strong>
              </div>
            </div>

            <p className="bk-sum-note">
              <CheckCircle2 size={15} />
              Free to request. Pay only after {firstName} accepts.
            </p>
          </motion.div>
        </aside>
      </div>
    </main>
  );
}

export default C21BookingRequest;