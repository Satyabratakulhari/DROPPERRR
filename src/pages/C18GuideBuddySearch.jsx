import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    CalendarDays,
    Compass,
    Globe2,
    MapPin,
    Menu,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Star,
    Users,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { people } from "../data/people";
import "./C18GuideBuddySearch.css";
import C19Filters from "./C19Filters";

const defaultFilters = {
  minPrice: 500,
  maxPrice: 3000,
  rating: 0,
  language: "All",
  interests: [],
  sortBy: "recommended",
};

const quickCities = ["Bhubaneswar", "Puri", "Cuttack"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function todayString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split("T")[0];
}

// Number of days from today to the selected date (0 = today).
function daysFromToday(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  const picked = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((picked - today) / 86400000);
}

function C18GuideBuddySearch({ onOpenProfile }) {
  const [destination, setDestination] = useState("");
  const [role, setRole] = useState("All");
  const [date, setDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  const filteredPeople = useMemo(() => {
    let result = people.filter((person) => {
      const matchesCity =
        !destination.trim() ||
        person.city.toLowerCase().includes(destination.trim().toLowerCase());

      const matchesRole = role === "All" || person.role === role;
      const matchesPrice =
        person.price >= filters.minPrice && person.price <= filters.maxPrice;
      const matchesRating = person.rating >= filters.rating;

      const matchesLanguage =
        filters.language === "All" ||
        person.languages.includes(filters.language);

      const matchesInterests =
        filters.interests.length === 0 ||
        filters.interests.some((item) => person.interests.includes(item));

      // Date: hide people who are off on the picked day (next 7 days only).
      let matchesDate = true;
      if (date) {
        const index = daysFromToday(date);
        if (index >= 0 && index < 7) {
          matchesDate = !person.offDays.includes(index);
        }
      }

      return (
        matchesCity &&
        matchesRole &&
        matchesPrice &&
        matchesRating &&
        matchesLanguage &&
        matchesInterests &&
        matchesDate
      );
    });

    if (filters.sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating-high") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [destination, role, date, filters]);

  const activeFilterCount =
    filters.interests.length +
    (filters.language !== "All" ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.minPrice !== 500 || filters.maxPrice !== 3000 ? 1 : 0);

  const hasAnything =
    destination || role !== "All" || date || activeFilterCount > 0;

  function clearAll() {
    setDestination("");
    setRole("All");
    setDate("");
    setFilters(defaultFilters);
  }

  function handleSearch(event) {
    event.preventDefault();
    document
      .getElementById("discover-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="drop-app">
      <header className="drop-navbar">
        <a className="drop-brand" href="#home" aria-label="Dropperrr home">
          dropperrr<span>.</span>
        </a>

        <nav
          className={`drop-nav-links ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#discover-results" onClick={() => setMenuOpen(false)}>
            Discover
          </a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
          <a href="#footer" onClick={() => setMenuOpen(false)}>
            Help
          </a>
        </nav>

        <div className="drop-nav-actions">
          <a className="drop-profile-link" href="#discover-results">
            <Users size={16} />
            <span>Explore locals</span>
            <ArrowUpRight size={15} />
          </a>

          <button
            type="button"
            className="drop-mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <section className="drop-hero" id="home">
        <div className="drop-hero-orb drop-orb-one" />
        <div className="drop-hero-orb drop-orb-two" />

        <motion.div
          className="drop-hero-inner"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="drop-eyebrow">
            <Sparkles size={14} />
            TRAVEL DIFFERENTLY
          </div>

          <h1>
            Not just places.
            <br />
            <span>People make the journey.</span>
          </h1>

          <p className="drop-hero-description">
            Meet locals who turn ordinary trips into extraordinary stories.
            Find your guide, your buddy, your kind of adventure.
          </p>

          <form className="drop-search-panel" onSubmit={handleSearch}>
            <div className="drop-search-field">
              <span className="drop-field-icon">
                <MapPin size={19} />
              </span>
              <div className="drop-field-content">
                <label htmlFor="drop-destination">Where to?</label>
                <input
                  id="drop-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search city or destination"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="drop-search-divider" />

            <div className="drop-search-field">
              <span className="drop-field-icon">
                <Compass size={19} />
              </span>
              <div className="drop-field-content">
                <label htmlFor="drop-role">Experience with</label>
                <select
                  id="drop-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="All">Guide or Buddy</option>
                  <option value="Guide">Local Guide</option>
                  <option value="Buddy">Travel Buddy</option>
                </select>
              </div>
            </div>

            <div className="drop-search-divider" />

            <div className="drop-search-field">
              <span className="drop-field-icon">
                <CalendarDays size={19} />
              </span>
              <div className="drop-field-content">
                <label htmlFor="drop-date">When?</label>
                <input
                  id="drop-date"
                  type="date"
                  value={date}
                  min={todayString()}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              className="drop-search-submit"
              type="submit"
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.96 }}
            >
              <Search size={19} />
              <span>Search</span>
            </motion.button>
          </form>

          <div className="drop-quick-cities">
            <span>Popular:</span>
            {quickCities.map((city) => (
              <button
                key={city}
                type="button"
                className={destination === city ? "is-active" : ""}
                onClick={() =>
                  setDestination((current) => (current === city ? "" : city))
                }
              >
                {city}
              </button>
            ))}
          </div>

          <div className="drop-hero-trust">
            <div className="drop-avatar-stack" aria-hidden="true">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"
                alt=""
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80"
                alt=""
              />
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80"
                alt=""
              />
            </div>
            <div>
              <div className="drop-trust-stars">★★★★★</div>
              <span>Real people. Local experiences.</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="drop-floating-card"
          initial={{ opacity: 0, x: 25, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="drop-floating-icon">
            <Globe2 size={20} />
          </div>
          <div>
            <strong>Your next story awaits</strong>
            <span>Explore beyond the usual</span>
          </div>
          <Sparkles className="drop-floating-sparkle" size={17} />
        </motion.div>
      </section>

      <section className="drop-results-section" id="discover-results">
        <div className="drop-results-header">
          <div>
            <div className="drop-section-eyebrow">YOUR NEXT CONNECTION</div>
            <h2>
              Meet your <span>local people.</span>
            </h2>
            <p>
              Thoughtfully chosen locals to help you experience a place
              differently.
            </p>
          </div>

          <motion.button
            type="button"
            className="drop-filter-button"
            onClick={() => setShowFilters(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <SlidersHorizontal size={17} />
            Filters
            {activeFilterCount > 0 && (
              <span className="drop-filter-count">{activeFilterCount}</span>
            )}
          </motion.button>
        </div>

        <div className="drop-results-toolbar">
          <div>
            <span className="drop-result-number">
              {filteredPeople.length.toString().padStart(2, "0")}
            </span>
            <span className="drop-result-label">
              {filteredPeople.length === 1 ? " local found" : " locals found"}
            </span>
          </div>

          <div className="drop-toolbar-right">
            <span className="drop-sort-label">Sorted by</span>
            <select
              aria-label="Sort results"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  sortBy: e.target.value,
                }))
              }
            >
              <option value="recommended">Recommended</option>
              <option value="rating-high">Highest rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredPeople.length ? (
            <motion.div
              key={`${destination}-${role}-${date}-${JSON.stringify(filters)}`}
              className="drop-people-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredPeople.map((person) => (
                <motion.article
                  key={person.id}
                  className="drop-person-card"
                  variants={cardVariants}
                  whileHover={{ y: -7 }}
                >
                  <div className="drop-person-photo">
                    <img src={person.image} alt={person.name} loading="lazy" />

                    <div className="drop-photo-top">
                      <span className="drop-role-pill">{person.role}</span>
                      {person.verified && (
                        <span className="drop-verified-pill">
                          <ShieldCheck size={13} />
                          Verified
                        </span>
                      )}
                    </div>

                    <span className="drop-person-tag">{person.tag}</span>
                  </div>

                  <div className="drop-person-content">
                    <div className="drop-person-heading">
                      <div>
                        <h3>{person.name}</h3>
                        <div className="drop-person-city">
                          <MapPin size={13} />
                          {person.city}
                        </div>
                      </div>

                      <div className="drop-person-rating">
                        <Star size={14} fill="currentColor" />
                        <strong>{person.rating.toFixed(1)}</strong>
                        <span>({person.reviews})</span>
                      </div>
                    </div>

                    <p className="drop-person-description">
                      {person.description}
                    </p>

                    <div className="drop-person-languages">
                      {person.languages.slice(0, 3).map((language) => (
                        <span key={language}>{language}</span>
                      ))}
                    </div>

                    <div className="drop-person-footer">
                      <div className="drop-person-price">
                        <strong>₹{person.price.toLocaleString("en-IN")}</strong>
                        <span>/ hour</span>
                      </div>

                      <motion.button
                        type="button"
                        className="drop-profile-button"
                        onClick={() => onOpenProfile?.(person)}
                        whileHover={{ scale: 1.035 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        View profile
                        <ArrowUpRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="drop-empty-state"
              key="empty"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="drop-empty-icon">
                <Search size={27} />
              </div>
              <h3>No locals found just yet</h3>
              <p>
                Try a different destination or date, or reset your filters to
                discover more people.
              </p>
              <button type="button" onClick={clearAll}>
                Clear search and filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {hasAnything && filteredPeople.length > 0 && (
          <button className="drop-clear-search" onClick={clearAll} type="button">
            <X size={14} />
            Clear all search filters
          </button>
        )}
      </section>

      <section className="drop-how-section" id="how-it-works">
        <motion.div
          className="drop-how-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="drop-section-eyebrow">
            THREE STEPS. ENDLESS STORIES.
          </div>
          <h2>
            Travel is better <span>together.</span>
          </h2>
          <p className="drop-how-description">
            Your next favourite experience starts with a local connection.
          </p>

          <div className="drop-how-grid">
            {[
              {
                number: "01",
                icon: <MapPin size={22} />,
                title: "Pick your place",
                description:
                  "Tell us where you're going and the kind of experience you want.",
              },
              {
                number: "02",
                icon: <Users size={22} />,
                title: "Meet your match",
                description:
                  "Find a guide or buddy that fits your interests and budget.",
              },
              {
                number: "03",
                icon: <Compass size={22} />,
                title: "Make it memorable",
                description:
                  "Enjoy the place through the eyes of someone who knows it.",
              },
            ].map((step) => (
              <motion.article
                className="drop-how-card"
                key={step.number}
                whileHover={{ y: -5 }}
              >
                <span className="drop-step-number">{step.number}</span>
                <div className="drop-step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <footer className="drop-footer" id="footer">
        <a className="drop-brand" href="#home">
          dropperrr<span>.</span>
        </a>
        <p>Find your people. Discover your world.</p>
        <span>© {new Date().getFullYear()} Dropperrr</span>
      </footer>

      {showFilters && (
        <C19Filters
          initialFilters={filters}
          onClose={() => setShowFilters(false)}
          onApply={(next) => {
            setFilters(next);
            setShowFilters(false);
          }}
        />
      )}
    </main>
  );
}

export default C18GuideBuddySearch;