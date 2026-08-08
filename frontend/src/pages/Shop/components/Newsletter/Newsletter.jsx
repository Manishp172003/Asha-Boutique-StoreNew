import "./Newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter">

      <div className="newsletter-container">

        <span className="newsletter-tag">
          Stay Connected
        </span>

        <h2>
          Subscribe to Our Newsletter
        </h2>

        <p>
          Be the first to discover our latest collections, exclusive offers,
          and timeless fashion inspirations.
        </p>

        <form className="newsletter-form">

          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

      </div>

    </section>
  );
};

export default Newsletter;