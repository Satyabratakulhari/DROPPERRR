import { useRef, useState } from "react";
import C18GuideBuddySearch from "./pages/C18GuideBuddySearch";
import C20VendorProfile from "./pages/C20VendorProfile";
import C21BookingRequest from "./pages/C21BookingRequest";
import C22BookingStatus from "./pages/C22BookingStatus";
import C23Chat from "./pages/C23Chat";
import C24Payment from "./pages/C24Payment";
import C25Review from "./pages/C25Review";
import "./pages/Trip.css";

const autoReplies = [
  "Sounds great! I'll plan the route around that.",
  "Good question. Comfortable shoes and light cotton clothes work best.",
  "Yes, we can adjust the timing a little. Let's confirm closer to the day.",
  "My pleasure! Looking forward to meeting you.",
];

function timeNow() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function App() {
  const [screen, setScreen] = useState("search");
  const [person, setPerson] = useState(null);
  const [booking, setBooking] = useState(null);
  const [trip, setTrip] = useState(null);
  const [messages, setMessages] = useState([]);

  const scrolls = useRef({});
  const replyCount = useRef(0);

  function go(next) {
    scrolls.current[screen] = window.scrollY;
    setScreen(next);

    const keepPosition = next === "search" || next === "profile";
    const top = keepPosition ? scrolls.current[next] ?? 0 : 0;

    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: "instant" });
    });
  }

  function openProfile(selected) {
    delete scrolls.current.profile;
    setPerson(selected);
    go("profile");
  }

  function openBooking(details) {
    setBooking(details);
    go("booking");
  }

  function handleSent(data) {
    const firstName = person.name.split(" ")[0];

    setTrip({
      ...data,
      person,
      booking,
      status: "pending",
      reviewed: false,
    });

    setMessages([
      {
        id: Date.now(),
        from: "them",
        text: `Hi! This is ${firstName}. Thanks for your request. I'll confirm shortly. Feel free to ask me anything about the day.`,
        time: timeNow(),
      },
    ]);
  }

  function updateStatus(status) {
    setTrip((current) => (current ? { ...current, status } : current));
  }

  function sendMessage(text) {
    setMessages((current) => [
      ...current,
      { id: Date.now(), from: "me", text, time: timeNow() },
    ]);

    const reply = autoReplies[replyCount.current % autoReplies.length];
    replyCount.current += 1;

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, from: "them", text: reply, time: timeNow() },
      ]);
    }, 1400);
  }

  return (
    <>
      {/* Search and profile stay mounted so nothing you chose is lost. */}
      <div style={{ display: screen === "search" ? "block" : "none" }}>
        <C18GuideBuddySearch onOpenProfile={openProfile} />
      </div>

      {person && (
        <div style={{ display: screen === "profile" ? "block" : "none" }}>
          <C20VendorProfile
            key={person.id}
            person={person}
            onBack={() => go("search")}
            onBook={openBooking}
          />
        </div>
      )}

      {screen === "booking" && person && booking && (
        <C21BookingRequest
          person={person}
          booking={booking}
          onBack={() => go("profile")}
          onDone={() => go("search")}
          onSent={handleSent}
          onTrack={() => go("status")}
        />
      )}

      {screen === "status" && trip && (
        <C22BookingStatus
          trip={trip}
          onHome={() => go("search")}
          onChat={() => go("chat")}
          onPay={() => go("payment")}
          onReview={() => go("review")}
          onUpdate={updateStatus}
        />
      )}

      {screen === "chat" && trip && (
        <C23Chat
          trip={trip}
          messages={messages}
          onSend={sendMessage}
          onBack={() => go("status")}
        />
      )}

      {screen === "payment" && trip && (
        <C24Payment
          trip={trip}
          onBack={() => go("status")}
          onPaid={() => updateStatus("paid")}
          onViewBooking={() => go("status")}
          onHome={() => go("search")}
        />
      )}

      {screen === "review" && trip && (
        <C25Review
          trip={trip}
          onBack={() => go("status")}
          onSubmit={() =>
            setTrip((current) => ({ ...current, reviewed: true }))
          }
          onHome={() => go("search")}
        />
      )}

      {trip && screen === "search" && (
        <button type="button" className="tp-float" onClick={() => go("status")}>
          View my booking
        </button>
      )}
    </>
  );
}

export default App;