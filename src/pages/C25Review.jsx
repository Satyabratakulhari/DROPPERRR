import { motion } from "framer-motion";
import { ArrowLeft, Check, Star } from "lucide-react";
import { useEffect, useState } from "react";

import "./Trip.css";

const words = ["", "Poor", "Fair", "Good", "Very good", "Excellent!"];

const tags = [
  "Friendly",
  "Knowledgeable",
  "On time",
  "Great photos",
  "Safe & respectful",
  "Fun company",
  "Good value",
];

function C25Review({ trip, onBack, onSubmit, onHome }) {
  const { person } = trip;
  const firstName = person.name.split(" ")[0];

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [picked, setPicked] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const shown = hover || rating;

  function toggleTag(tag) {
    setPicked((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    );
  }

  function submit(event) {
    event.preventDefault();

    if (rating === 0) {
      setError("Please tap a star rating first.");
      return;
    }

    onSubmit?.({ rating, tags: picked, comment: comment.trim() });
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
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

            <h1>Thank you!</h1>
            <p>
              Your {rating}-star review helps {firstName} and other travellers.
              We're glad you had a good trip.
            </p>

            <div className="tp-actions">
              <button type="button" className="tp-primary" onClick={onHome}>
                Find more locals
              </button>
              <button type="button" className="tp-secondary" onClick={onBack}>
                Back to booking
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="tp-app">
      <header className="tp-topbar">
        <button type="button" className="tp-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back to booking</span>
        </button>
        <span className="tp-brand">
          dropperrr<span>.</span>
        </span>
        <span className="tp-spacer" />
      </header>

      <div className="tp-wrap tp-wrap-narrow">
        <motion.form
          className="tp-stack"
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="tp-title">How was your day with {firstName}?</h1>
            <p className="tp-sub">Your honest review helps other travellers choose well.</p>
          </div>

          <section className="tp-card">
            <div className="tp-person">
              <img src={person.image} alt={person.name} />
              <div>
                <strong>{person.name}</strong>
                <span>
                  {person.role} · {person.city}
                </span>
              </div>
            </div>

            <div className="tp-stars" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  className={value <= shown ? "is-on" : ""}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => {
                    setRating(value);
                    setError("");
                  }}
                >
                  <Star size={36} fill={value <= shown ? "currentColor" : "none"} />
                </button>
              ))}
            </div>

            <p className="tp-rating-word">{words[shown]}</p>
          </section>

          <section className="tp-card">
            <h2>What went well?</h2>
            <div className="tp-tags">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={picked.includes(tag)}
                  className={picked.includes(tag) ? "is-on" : ""}
                  onClick={() => toggleTag(tag)}
                >
                  {picked.includes(tag) ? "✓ " : ""}
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="tp-card">
            <div className="tp-field" style={{ marginBottom: 0 }}>
              <label htmlFor="tp-comment">Write a review (optional)</label>
              <textarea
                id="tp-comment"
                rows={4}
                maxLength={400}
                placeholder="Tell others what made your trip special…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </section>

          {error && <p className="tp-error">{error}</p>}

          <button type="submit" className="tp-coral">
            Submit review
          </button>
        </motion.form>
      </div>
    </main>
  );
}

export default C25Review;