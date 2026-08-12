import { useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "../../../../services/newsletterService";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    // Strict email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await subscribeToNewsletter(trimmedEmail);
      toast.success("Thank you for subscribing! Check your inbox for updates.");
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;