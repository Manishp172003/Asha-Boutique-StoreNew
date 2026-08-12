import React, { useState, useEffect } from "react";
import "./MockPaymentModal.css";
import { CreditCard, QrCode, Landmark, ShieldCheck, X } from "lucide-react";

const MockPaymentModal = ({ isOpen, onClose, amount, orderNumber, onPaymentSuccess, defaultTab, upiId }) => {
  const [activeTab, setActiveTab] = useState("card");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (isOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Form states
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [cardName, setCardName] = useState("Jane Doe");

  const [upiIdInput, setUpiIdInput] = useState("jane@okaxis");
  const [selectedBank, setSelectedBank] = useState("HDFC");

  const finalUpiId = upiId || "ashaboutique@okaxis";
  const upiString = `upi://pay?pa=${finalUpiId}&pn=Asha Boutique&am=${amount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiString)}`;

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setLoadingStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    setLoading(true);
    setLoadingStep(0);

    // Simulated verification steps
    const steps = [
      "Contacting secure sandbox gateway...",
      "Authorizing dummy transaction authorization...",
      "Generating cryptographic payload verification..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStep(currentStep);
      } else {
        clearInterval(interval);
        onPaymentSuccess({
          razorpayPaymentId: "pay_MOCK_" + Math.random().toString(36).substring(2, 11).toUpperCase(),
          razorpayOrderId: "order_MOCK_" + Math.random().toString(36).substring(2, 11).toUpperCase(),
          razorpaySignature: "mock_signature_verified",
          isMock: true
        });
      }
    }, 600);
  };

  const stepsText = [
    "Contacting secure sandbox gateway...",
    "Authorizing dummy transaction authorization...",
    "Generating cryptographic verification payload..."
  ];

  return (
    <div className="mock-payment-overlay">
      <div className="mock-payment-card">
        {loading ? (
          <div className="mock-payment-loading-state">
            <div className="mock-spinner"></div>
            <p className="mock-step-text">{stepsText[loadingStep]}</p>
            <span className="mock-secure-badge">
              <ShieldCheck size={14} /> SECURE SANDBOX CONNECTION
            </span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mock-payment-header">
              <div className="header-info">
                <h3>Asha Boutique Sandbox</h3>
                <span className="order-tag">Order #{orderNumber}</span>
              </div>
              <button className="close-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* Total Block */}
            <div className="mock-payment-amount-box">
              <span className="amount-label">AMOUNT TO PAY</span>
              <span className="amount-value">₹{amount.toLocaleString("en-IN")}</span>
            </div>

            {/* Tab navigation */}
            <div className="mock-payment-tabs">
              <button 
                className={`tab-btn ${activeTab === "card" ? "active" : ""}`}
                onClick={() => setActiveTab("card")}
              >
                <CreditCard size={16} /> Card
              </button>
              <button 
                className={`tab-btn ${activeTab === "upi" ? "active" : ""}`}
                onClick={() => setActiveTab("upi")}
              >
                <QrCode size={16} /> UPI
              </button>
              <button 
                className={`tab-btn ${activeTab === "netbanking" ? "active" : ""}`}
                onClick={() => setActiveTab("netbanking")}
              >
                <Landmark size={16} /> Netbanking
              </button>
            </div>

            {/* Tab content */}
            <div className="mock-payment-tab-content">
              {activeTab === "card" && (
                <div className="card-form-grid">
                  <div className="input-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)} 
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="row-inputs">
                    <div className="input-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        value={expiry} 
                        onChange={(e) => setExpiry(e.target.value)} 
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="input-group">
                      <label>CVV Code</label>
                      <input 
                        type="password" 
                        value={cvv} 
                        onChange={(e) => setCvv(e.target.value)} 
                        placeholder="•••"
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Name on Card</label>
                    <input 
                      type="text" 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value)} 
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
              )}

              {activeTab === "upi" && (
                <div className="upi-form">
                  <div className="upi-qr-wrapper">
                    <div className="mock-qr-code" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "180px", height: "180px", margin: "0 auto 10px auto", backgroundColor: "#fff", padding: "8px", borderRadius: "14px", border: "1px solid #E9E3DD" }}>
                      <img 
                        src={qrCodeUrl} 
                        alt="Scan to Pay QR" 
                        style={{ width: "160px", height: "160px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          const fb = document.getElementById("mock-qr-fallback");
                          if (fb) fb.style.display = "block";
                        }}
                      />
                      <QrCode id="mock-qr-fallback" size={80} className="qr-svg text-[#9B8B84]" style={{ display: "none" }} />
                    </div>
                    <p className="qr-helper" style={{ fontSize: "12px", color: "#7B6D67", textAlign: "center", margin: "4px 0 12px 0" }}>
                      Scan with any UPI app (GPay, PhonePe, Paytm) to test real amount pre-fill.
                    </p>
                  </div>
                  <div className="input-group">
                    <label>Virtual Payment Address (VPA / UPI ID)</label>
                    <input 
                      type="text" 
                      value={upiIdInput} 
                      onChange={(e) => setUpiIdInput(e.target.value)} 
                      placeholder="mobileNumber@upi"
                    />
                  </div>
                </div>
              )}

              {activeTab === "netbanking" && (
                <div className="netbanking-grid">
                  <label className="mb-2 block text-xs tracking-wider uppercase text-[#9B8B84]">Select Bank</label>
                  <div className="bank-options">
                    {["SBI", "HDFC", "ICICI", "AXIS", "KOTAK", "PNB"].map((bank) => (
                      <button 
                        key={bank}
                        className={`bank-btn ${selectedBank === bank ? "selected" : ""}`}
                        onClick={() => setSelectedBank(bank)}
                      >
                        {bank} Bank
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mock-payment-footer">
              <button className="pay-btn" onClick={handlePay}>
                PAY SECURELY ₹{amount.toLocaleString("en-IN")}
              </button>
              <div className="sandbox-disclaimer">
                <ShieldCheck size={12} className="secure-icon" />
                <span>Simulated transaction. Real money will not be charged.</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MockPaymentModal;
