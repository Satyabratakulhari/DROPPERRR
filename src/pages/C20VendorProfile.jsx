import { motion } from "framer-motion";
import {
    ArrowLeft,
    Award,
    CalendarDays,
    CheckCircle2,
    Clock,
    Heart,
    Languages,
    MapPin,
    MessageCircle,
    Minus,
    Plus,
    Share2,
    ShieldCheck,
    Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import "./C20VendorProfile.css";

const slots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

function toLocalKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildDays(offDays) {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      key: toLocalKey(date),
      label: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
      day: date.getDate(),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      available: !offDays.includes(index),
    };
  });
}

function C20VendorProfile({ person, onBack, onBook }) {
  const [liked, setLiked] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [hours, setHours] = useState(2);
  const [toast, setToast] = useState("");

  const days = useMemo(() => buildDays(person?.offDays ?? []), [person]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [person]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!person) return null;

  const firstName = person.name.split(" ")[0];
  const total = person.price * hours;
  const selectedDayInfo = days.find((d) => d.key === selectedDay);
  const canBook = selectedDay && selectedSlot;

  function requestBooking() {
    if (!canBook) {
      setToast("Please choose a date and a time first.");
      return;
    }

    onBook?.({
      dateKey: selectedDay,
      dateLabel: selectedDayInfo?.label,
      slot: selectedSlot,
      hours,
    });
  }

  function scrollToBooking() {
    document
      .getElementById("vp-booking")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function shareProfile() {
    const text = `Check out ${person.name} on Dropperrr`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Dropperrr", text });
      } else {
        await navigator.clipboard.writeText(text);
        setToast("Profile text copied.");
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <main className="vp-app">
      <header className="vp-topbar">
        <button type="button" className="vp-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back to search</span>
        </button>

        <a
          className="vp-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onBack?.();
          }}
        >
          dropperrr<span>.</span>
        </a>

        <div className="vp-top-actions">
          <button
            type="button"
            className={`vp-icon-btn ${liked ? "is-liked" : ""}`}
            aria-label="Save profile"
            aria-pressed={liked}
            onClick={() => setLiked((value) => !value)}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            className="vp-icon-btn"
            aria-label="Share profile"
            onClick={shareProfile}
          >
            <Share2 size={18} />
          </button>
        </div>
      </header>

      <section className="vp-hero">
        <div className="vp-hero-orb" />

        <motion.div className="vp-hero-inner" initial="hidden" animate="visible">
          <motion.div className="vp-photo" variants={fadeUp} custom={0}>
            <img src={person.image} alt={person.name} />
            <span className="vp-role">{person.role}</span>
          </motion.div>

          <div className="vp-hero-text">
            <motion.div className="vp-badges" variants={fadeUp} custom={1}>
              {person.verified ? (
                <span className="vp-badge vp-badge-green">
                  <ShieldCheck size={14} /> Verified profile
                </span>
              ) : (
                <span className="vp-badge">Verification pending</span>
              )}
              <span className="vp-badge vp-badge-coral">{person.tag}</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={2}>
              {person.name}
            </motion.h1>

            <motion.div className="vp-meta" variants={fadeUp} custom={3}>
              <span>
                <MapPin size={15} /> {person.city}, Odisha
              </span>
              <span>
                <Star size={15} fill="currentColor" className="vp-star" />
                <strong>{person.rating.toFixed(1)}</strong> ({person.reviews}{" "}
                reviews)
              </span>
            </motion.div>

            <motion.p className="vp-tagline" variants={fadeUp} custom={4}>
              {person.description}
            </motion.p>

            <motion.div className="vp-stats" variants={fadeUp} custom={5}>
              <div>
                <Award size={18} />
                <strong>{person.experience} yrs</strong>
                <span>Experience</span>
              </div>
              <div>
                <CheckCircle2 size={18} />
                <strong>{person.trips}+</strong>
                <span>Trips hosted</span>
              </div>
              <div>
                <Clock size={18} />
                <strong>{person.responseTime.replace("Within ", "")}</strong>
                <span>Response time</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div className="vp-layout">
        <div className="vp-main">
          <motion.section
            className="vp-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2>About {firstName}</h2>
            <p className="vp-bio">{person.bio}</p>
          </motion.section>

          <motion.section
            className="vp-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2>Interests</h2>
            <div className="vp-chips">
              {person.interests.map((interest) => (
                <span key={interest} className="vp-chip">
                  {interest}
                </span>
              ))}
            </div>

            <h2 className="vp-sub">
              <Languages size={17} /> Languages spoken
            </h2>
            <div className="vp-chips">
              {person.languages.map((language) => (
                <span key={language} className="vp-chip vp-chip-light">
                  {language}
                </span>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="vp-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="vp-title-row">
              <h2>
                <CalendarDays size={19} /> Availability
              </h2>
              <span className="vp-muted">Next 7 days</span>
            </div>

            <div className="vp-days">
              {days.map((d) => (
                <motion.button
                  key={d.key}
                  type="button"
                  disabled={!d.available}
                  whileTap={d.available ? { scale: 0.94 } : undefined}
                  className={`vp-day ${
                    selectedDay === d.key ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedDay(d.key)}
                >
                  <span>{d.weekday}</span>
                  <strong>{d.day}</strong>
                  <small>{d.available ? d.month : "Off"}</small>
                </motion.button>
              ))}
            </div>

            <div className="vp-slots">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`vp-slot ${
                    selectedSlot === slot ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="vp-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="vp-title-row">
              <h2>
                <MessageCircle size={19} /> Guest reviews
              </h2>
              <span className="vp-rating-big">
                <Star size={16} fill="currentColor" className="vp-star" />
                {person.rating.toFixed(1)}
                <small>· {person.reviews} reviews</small>
              </span>
            </div>

            <div className="vp-reviews">
              {person.reviewList.map((review) => (
                <article className="vp-review" key={review.name + review.date}>
                  <div className="vp-review-avatar">
                    {review.name.charAt(0)}
                  </div>

                  <div className="vp-review-body">
                    <div className="vp-review-head">
                      <strong>{review.name}</strong>
                      <span>{review.date}</span>
                    </div>

                    <div
                      className="vp-review-stars"
                      aria-label={`${review.rating} stars`}
                    >
                      {"★".repeat(review.rating)}
                      <span>{"★".repeat(5 - review.rating)}</span>
                    </div>

                    <p>{review.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        </div>

        <aside className="vp-aside">
          <motion.div
            id="vp-booking"
            className="vp-booking"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <div className="vp-price-row">
              <div>
                <strong>₹{person.price.toLocaleString("en-IN")}</strong>
                <span> / hour</span>
              </div>
              <span className="vp-booking-rating">
                <Star size={14} fill="currentColor" className="vp-star" />
                {person.rating.toFixed(1)}
              </span>
            </div>

            <div className="vp-summary">
              <div>
                <span>Date</span>
                <strong>
                  {selectedDayInfo ? selectedDayInfo.label : "Not selected"}
                </strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{selectedSlot || "Not selected"}</strong>
              </div>
            </div>

            <div className="vp-hours">
              <span>Duration</span>
              <div className="vp-stepper">
                <button
                  type="button"
                  aria-label="Decrease hours"
                  disabled={hours <= 1}
                  onClick={() => setHours((h) => Math.max(1, h - 1))}
                >
                  <Minus size={15} />
                </button>
                <strong>{hours} h</strong>
                <button
                  type="button"
                  aria-label="Increase hours"
                  disabled={hours >= 8}
                  onClick={() => setHours((h) => Math.min(8, h + 1))}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="vp-total">
              <span>Estimated total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <motion.button
              type="button"
              className="vp-book-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={requestBooking}
            >
              Request booking
            </motion.button>

            <p className="vp-note">
              You won't be charged yet. {firstName} usually replies{" "}
              {person.responseTime.toLowerCase()}.
            </p>
          </motion.div>
        </aside>
      </div>

      <div className="vp-mobile-bar">
        <div>
          <strong>₹{person.price.toLocaleString("en-IN")}</strong>
          <span> / hour</span>
        </div>
        <button type="button" onClick={scrollToBooking}>
          Book now
        </button>
      </div>

      {toast && (
        <motion.div
          className="vp-toast"
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {toast}
        </motion.div>
      )}
    </main>
  );
}

export default C20VendorProfile;