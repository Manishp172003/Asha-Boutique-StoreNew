import { useState } from "react";
import "./DescriptionTabs.css";

const DescriptionTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  if (!product) return null;

  return (
    <section className="description-tabs">
      <div className="tabs-header">
        <button
          className={activeTab === "description" ? "active" : ""}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>

        <button
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Product Details
        </button>

        <button
          className={activeTab === "shipping" ? "active" : ""}
          onClick={() => setActiveTab("shipping")}
        >
          Shipping
        </button>
      </div>

      <div className="tabs-content">
        {activeTab === "description" && (
          <>
            <h3>Crafted with Care</h3>
            <p>
              {product.description || "A meticulously finished design from our boutique collection, crafted to bring intentional style and signature comfort to your wardrobe."}
            </p>
            <p>
              Every piece from Asha Boutique is thoughtfully designed and tailored to celebrate artisan quality and timeless beauty.
            </p>
          </>
        )}

        {activeTab === "details" && (
          <div className="details-grid">
            {product.fabric && (
              <div>
                <span>Fabric / Material</span>
                <p>{product.fabric}</p>
              </div>
            )}

            {product.fit && (
              <div>
                <span>Fit / Styling</span>
                <p>{product.fit}</p>
              </div>
            )}

            {product.careInstructions && (
              <div>
                <span>Care Instructions</span>
                <p>{product.careInstructions}</p>
              </div>
            )}

            <div>
              <span>Category</span>
              <p>{product.category}</p>
            </div>

            {product.deliveryInfo && (
              <div>
                <span>Atelier Prep</span>
                <p>{product.deliveryInfo}</p>
              </div>
            )}

            <div>
              <span>Availability</span>
              <p>{product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} items)` : 'Out of Stock'}</p>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <>
            <h3>Shipping Information</h3>
            <ul>
              <li>Free shipping on orders above ₹999.</li>
              <li>{product.deliveryInfo || "Ready to ship in 2-3 days"} from our atelier.</li>
              <li>Easy 7-day return & exchange policy.</li>
              <li>Secure premium boutique packaging.</li>
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default DescriptionTabs;