import { useEffect, useRef, useState } from "react";
import "./C19Filters.css";

const languages = ["English", "Hindi", "Odia", "Bengali", "Spanish"];

const interests = [
  "Culture",
  "History",
  "Food",
  "Beach",
  "Photography",
  "Nature",
  "Shopping",
  "Adventure",
];

const defaultFilters = {
  minPrice: 500,
  maxPrice: 3000,
  rating: 0,
  language: "All",
  interests: [],
  sortBy: "recommended",
};

function C19Filters({ onApply, onClose, initialFilters = {} }) {
  const [minPrice, setMinPrice] = useState(
    initialFilters.minPrice ?? defaultFilters.minPrice
  );
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice ?? defaultFilters.maxPrice
  );
  const [rating, setRating] = useState(
    initialFilters.rating ?? defaultFilters.rating
  );
  const [language, setLanguage] = useState(
    initialFilters.language ?? defaultFilters.language
  );
  const [selectedInterests, setSelectedInterests] = useState(
    initialFilters.interests ?? []
  );
  const [sortBy, setSortBy] = useState(
    initialFilters.sortBy ?? defaultFilters.sortBy
  );

  // Keep the latest onClose without re-running the effect on every render.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") closeRef.current?.();
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleInterest(interest) {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  function resetFilters() {
    setMinPrice(defaultFilters.minPrice);
    setMaxPrice(defaultFilters.maxPrice);
    setRating(defaultFilters.rating);
    setLanguage(defaultFilters.language);
    setSelectedInterests([]);
    setSortBy(defaultFilters.sortBy);
  }

  function applyFilters() {
    onApply?.({
      minPrice,
      maxPrice,
      rating,
      language,
      interests: selectedInterests,
      sortBy,
    });
  }

  return (
    <div
      className="c19-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        className="c19-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="c19-title"
      >
        <div className="c19-mobile-handle" />

        <header className="c19-header">
          <div>
            <span className="c19-eyebrow">PERSONALIZE YOUR SEARCH</span>
            <h2 id="c19-title">Filters</h2>
            <p>Find the right guide or buddy for your trip.</p>
          </div>

          <button
            className="c19-close"
            type="button"
            aria-label="Close filters"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="c19-content">
          <section className="c19-group">
            <div className="c19-label-row">
              <span className="c19-section-label">Price per hour</span>
              <strong>
                ₹{minPrice.toLocaleString("en-IN")} – ₹
                {maxPrice.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="c19-price-inputs">
              <div>
                <label htmlFor="c19-min-price">Minimum price</label>
                <select
                  id="c19-min-price"
                  value={minPrice}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setMinPrice(value);
                    if (value > maxPrice) setMaxPrice(value);
                  }}
                >
                  <option value={500}>₹500</option>
                  <option value={800}>₹800</option>
                  <option value={1000}>₹1,000</option>
                  <option value={1500}>₹1,500</option>
                  <option value={2000}>₹2,000</option>
                </select>
              </div>

              <div>
                <label htmlFor="c19-max-price">Maximum price</label>
                <select
                  id="c19-max-price"
                  value={maxPrice}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setMaxPrice(value);
                    if (value < minPrice) setMinPrice(value);
                  }}
                >
                  <option value={800}>₹800</option>
                  <option value={1000}>₹1,000</option>
                  <option value={1500}>₹1,500</option>
                  <option value={2000}>₹2,000</option>
                  <option value={2500}>₹2,500</option>
                  <option value={3000}>₹3,000</option>
                </select>
              </div>
            </div>
          </section>

          <section className="c19-group">
            <div className="c19-label-row">
              <span className="c19-section-label">Minimum rating</span>
              <span className="c19-muted">Guest reviews</span>
            </div>

            <div className="c19-rating-options">
              {[0, 3, 4, 4.5, 4.8].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={rating === value}
                  className={
                    rating === value
                      ? "c19-rating-option selected"
                      : "c19-rating-option"
                  }
                  onClick={() => setRating(value)}
                >
                  {value === 0 ? (
                    "Any"
                  ) : (
                    <>
                      <span>★</span>
                      {value.toFixed(1)}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="c19-group">
            <label className="c19-section-label c19-block" htmlFor="c19-language">
              Language
            </label>
            <select
              id="c19-language"
              className="c19-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="All">All languages</option>
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </section>

          <section className="c19-group">
            <div className="c19-label-row">
              <span className="c19-section-label">Interests</span>
              <span className="c19-muted">
                {selectedInterests.length} selected
              </span>
            </div>

            <div className="c19-interest-options">
              {interests.map((interest) => {
                const selected = selectedInterests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    aria-pressed={selected}
                    className={
                      selected ? "c19-interest selected" : "c19-interest"
                    }
                    onClick={() => toggleInterest(interest)}
                  >
                    {selected && <span>✓</span>}
                    {interest}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="c19-group">
            <label className="c19-section-label c19-block" htmlFor="c19-sort">
              Sort results by
            </label>
            <select
              id="c19-sort"
              className="c19-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating-high">Highest rated</option>
            </select>
          </section>
        </div>

        <footer className="c19-footer">
          <button className="c19-reset" type="button" onClick={resetFilters}>
            Reset all
          </button>
          <button className="c19-apply" type="button" onClick={applyFilters}>
            Apply filters <span>→</span>
          </button>
        </footer>
      </section>
    </div>
  );
}

export default C19Filters;