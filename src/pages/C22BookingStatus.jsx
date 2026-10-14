import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    CreditCard,
    MapPin,
    MessageCircle,
    Star,
    Users,
    XCircle,
} from "lucide-react";
import { useEffect } from "react";

import "./Trip.css";

const order = ["pending", "accepted", "paid", "completed"];

function formatINR(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function C22BookingStatus({
  trip,
  onHome,
  onChat,
  onPay,
  onReview,
  onUpdate,
}) {
  const { person, booking, details, price, requestId, status } = trip;
  const firstName = person.name.split(" ")[0];
  const cancelled = status === "cancelled";
  const index = order.indexOf(status);

  // Demo only: the request is "accepted" automatically after 6 seconds.
  useEffect(() => {
    if (status !== "pending") return undefined;
    const timer = setTimeout(() => onUpdate("accepted"), 6000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const steps = [
    {
      title: "Request sent",
      text: `Sent to ${firstName}. Request ID ${requestId}.`,
    },
    {
      title: "Accepted",
      text: `${firstName} confirms the date and time.`,
    },
    {
      title: "Payment done",
      text: "Pay securely to lock your booking.",
    },
    {
      title: "Trip completed",
      text: "Enjoy the day, then leave a review.",
    },
  ];

  function cancelRequest() {
    if (window.confirm("Cancel this booking request?")) {
      onUpdate("cancelled");
    }
  }

  const headline = {
    pending: `Waiting for ${firstName} to reply`,
    accepted: `${firstName} accepted your request!`,
    paid: "Your booking is confirmed",
    completed: "Trip completed",
    cancelled: "Request cancelled",
  }[status];

  return (
    <main className="tp-app">
      <header className="tp-topbar">
        <button type="button" className="tp-back" onClick={onHome}>
          <ArrowLeft size={18} />
          <span>Find more locals</span>
        </button>
        <span className="tp-brand">
          dropperrr<span>.</span>
        </span>
        <span className="tp-spacer" />
      </header>

      <div className="tp-wrap">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="tp-title">{headline}</h1>
          <p className="tp-sub">
            {cancelled
              ? "This request was cancelled. You can search for someone else any time."
              : "Follow your booking here, message " +
                firstName +
                " and pay when you're ready."}
          </p>
        </motion.div>

        <div className="tp-grid">
          <div className="tp-stack">
            <motion.section
              className="tp-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h2>Booking progress</h2>

              {cancelled ? (
                <span className="tp-badge is-red">
                  <XCircle size={14} /> Cancelled
                </span>
              ) : (
                <ol className="tp-timeline">
                  {steps.map((step, i) => {
                    const done = i < index || (i === index && i === 3);
                    const current = i === index && i !== 3;

                    return (
                      <li
                        key={step.title}
                        className={`tp-step ${done ? "is-done" : ""} ${
                          current ? "is-current" : ""
                        }`}
                      >
                        <span className="tp-dot">
                          {done ? <Check size={16} strokeWidth={3} /> : i + 1}
                        </span>
                        <div className="tp-step-text">
                          <strong>{step.title}</strong>
                          <span>{step.text}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </motion.section>

            <section className="tp-card">
              <h2>Trip details</h2>
              <ul className="tp-facts">
                <li>
                  <Calendar size={17} />
                  {booking.dateLabel}
                </li>
                <li>
                  <Clock size={17} />
                  {booking.slot} · {booking.hours}{" "}
                  {booking.hours === 1 ? "hour" : "hours"}
                </li>
                <li>
                  <MapPin size={17} />
                  {details.meetingAddress}
                </li>
                <li>
                  <Users size={17} />
                  {details.guests} {details.guests === 1 ? "guest" : "guests"}
                </li>
              </ul>

              <div className="tp-amount">
                <span>Total</span>
                <strong>{formatINR(price.total)}</strong>
              </div>
            </section>
          </div>

          <aside className="tp-aside">
            <div className="tp-card">
              <div className="tp-person">
                <img src={person.image} alt={person.name} />
                <div>
                  <strong>{person.name}</strong>
                  <span>
                    {person.role} · {person.city}
                  </span>
                  {status === "paid" && (
                    <span className="tp-badge is-green">Paid</span>
                  )}
                </div>
              </div>

              <div className="tp-actions" style={{ marginTop: 20 }}>
                {status === "accepted" && (
                  <button type="button" className="tp-coral" onClick={onPay}>
                    <CreditCard size={18} /> Pay {formatINR(price.total)}
                  </button>
                )}

                {status === "paid" && (
                  <button
                    type="button"
                    className="tp-primary"
                    onClick={() => onUpdate("completed")}
                  >
                    <Check size={18} /> Mark trip completed (demo)
                  </button>
                )}

                {status === "completed" &&
                  (trip.reviewed ? (
                    <span className="tp-badge is-green">
                      <Check size={14} /> Thanks for your review
                    </span>
                  ) : (
                    <button type="button" className="tp-coral" onClick={onReview}>
                      <Star size={18} /> Rate your experience
                    </button>
                  ))}

                {!cancelled && (
                  <button type="button" className="tp-secondary" onClick={onChat}>
                    <MessageCircle size={18} /> Message {firstName}
                  </button>
                )}

                {(status === "pending" || status === "accepted") && (
                  <button type="button" className="tp-danger" onClick={cancelRequest}>
                    Cancel request
                  </button>
                )}

                {cancelled && (
                  <button type="button" className="tp-primary" onClick={onHome}>
                    Find more locals
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default C22BookingStatus;