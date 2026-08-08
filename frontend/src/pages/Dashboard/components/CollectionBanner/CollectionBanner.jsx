import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import "./CollectionBanner.css";

const CollectionBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="collection-banner">
      <div className="banner-content">
        <div className="banner-text">
          <span className="banner-tag">NEW COLLECTION</span>
          <h2>Autumn Elegance</h2>
          <p>Discover our curated selection of timeless pieces designed for the modern connoisseur.</p>
          <Button variant="primary" onClick={() => navigate('/shop')} className="explore-btn">
            Explore Collection
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionBanner;
