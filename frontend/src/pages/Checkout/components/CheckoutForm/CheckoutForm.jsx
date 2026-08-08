import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApp } from "../../../../context/AppContext";
import { useState, useEffect } from "react";
import "./CheckoutForm.css";

const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9]{10,15}$/, {
      message: "Phone number must be between 10 and 15 digits (optional leading +)",
    }),
  address: z.string().trim().min(1, { message: "Address is required" }),
  city: z.string().trim().min(1, { message: "City is required" }),
  state: z.string().trim().min(1, { message: "State is required" }),
  zipCode: z.string().trim().min(1, { message: "ZIP code is required" }),
  country: z.string().trim().min(1, { message: "Country is required" }),
  paymentMethod: z.enum(["cod", "card", "upi"], {
    required_error: "Please select a payment method",
  }),
});

const CheckoutForm = ({ onPlaceOrder }) => {
  const { user, addresses = [], getDefaultAddress, cart = [] } = useApp();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      paymentMethod: "cod",
    },
  });

  // Pre-fill profile info and default address on mount
  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = user.name.split(" ");
        setValue("firstName", parts[0] || "");
        setValue("lastName", parts.slice(1).join(" ") || "");
      }
      if (user.email) {
        setValue("email", user.email);
      }
      if (user.phone) {
        setValue("phone", user.phone);
      }
    }

    const defaultAddr = getDefaultAddress ? getDefaultAddress() : (addresses && addresses.find(a => a.isDefault)) || null;
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
      setValue("address", defaultAddr.address || "");
      setValue("city", defaultAddr.city || "");
      setValue("state", defaultAddr.state || "");
      setValue("zipCode", defaultAddr.zip || "");
      setValue("country", defaultAddr.country || "India");
    } else if (addresses.length > 0) {
      const firstAddr = addresses[0];
      setSelectedAddressId(firstAddr.id);
      setValue("address", firstAddr.address || "");
      setValue("city", firstAddr.city || "");
      setValue("state", firstAddr.state || "");
      setValue("zipCode", firstAddr.zip || "");
      setValue("country", firstAddr.country || "India");
    } else {
      setSelectedAddressId("new");
    }
  }, [user, addresses, setValue, getDefaultAddress]);

  const handleSelectAddress = (addr) => {
    if (addr === "new") {
      setSelectedAddressId("new");
      setValue("address", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zipCode", "");
      setValue("country", "India");
    } else {
      setSelectedAddressId(addr.id);
      setValue("address", addr.address || "");
      setValue("city", addr.city || "");
      setValue("state", addr.state || "");
      setValue("zipCode", addr.zip || "");
      setValue("country", addr.country || "India");
    }
  };

  const handleProceedToStep2 = async () => {
    const fieldsToValidate = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "country"
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(2);
    } else {
      toast.error("Please fill in all delivery details correctly.");
    }
  };

  const onSubmit = (data) => {
    const shippingAddress = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zipCode,
      country: data.country,
    };
    onPlaceOrder(shippingAddress, data.paymentMethod);
  };

  const onInvalid = (errors) => {
    const firstErrorMessage = Object.values(errors)[0]?.message || "Please check the form for errors.";
    toast.error(firstErrorMessage);
  };

  return (
    <section className="checkout-form">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="checkout-form-flow">
        
        {/* Step 1: Delivery Address */}
        <div className={`checkout-step-container ${currentStep === 1 ? "active" : "collapsed"}`}>
          <div className="checkout-step-header" onClick={() => currentStep > 1 && setCurrentStep(1)}>
            <div className="step-number-title">
              <span className="step-num">1</span>
              <h2>Delivery Address</h2>
            </div>
            {currentStep > 1 && (
              <button type="button" className="step-change-btn">
                Change
              </button>
            )}
          </div>

          {currentStep === 1 ? (
            <div className="step-content">
              {/* Contact Information */}
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className={errors.firstName ? "error-input" : ""}
                  />
                  {errors.firstName && (
                    <span className="error-message">{errors.firstName.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className={errors.lastName ? "error-input" : ""}
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={errors.email ? "error-input" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={errors.phone ? "error-input" : ""}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              {/* Saved Addresses grid */}
              {addresses.length > 0 && (
                <div className="saved-addresses-selector">
                  <label className="section-subtitle">Select a Saved Address</label>
                  <div className="saved-addresses-grid">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`saved-address-card ${selectedAddressId === addr.id ? "active" : ""}`}
                        onClick={() => handleSelectAddress(addr)}
                        type="button"
                      >
                        <div className="address-card-header">
                          <span className="address-type">{addr.type || "Address"}</span>
                          {addr.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <p className="address-name">{addr.name}</p>
                        <p className="address-text">{addr.address}, {addr.city}</p>
                      </div>
                    ))}
                    <div
                      className={`saved-address-card new-address-card ${selectedAddressId === "new" ? "active" : ""}`}
                      onClick={() => handleSelectAddress("new")}
                      type="button"
                    >
                      <span className="plus-icon">+</span>
                      <span>Use different address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Address details */}
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className={errors.address ? "error-input" : ""}
                />
                {errors.address && (
                  <span className="error-message">{errors.address.message}</span>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    {...register("city")}
                    className={errors.city ? "error-input" : ""}
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    {...register("state")}
                    className={errors.state ? "error-input" : ""}
                  />
                  {errors.state && (
                    <span className="error-message">{errors.state.message}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    {...register("zipCode")}
                    className={errors.zipCode ? "error-input" : ""}
                  />
                  {errors.zipCode && (
                    <span className="error-message">{errors.zipCode.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    {...register("country")}
                    className={errors.country ? "error-input" : ""}
                  />
                  {errors.country && (
                    <span className="error-message">{errors.country.message}</span>
                  )}
                </div>
              </div>

              <button type="button" className="step-proceed-btn" onClick={handleProceedToStep2}>
                Deliver to this Address
              </button>
            </div>
          ) : (
            <div className="step-summary-preview">
              <p className="summary-name">
                {watch("firstName")} {watch("lastName")} • {watch("phone")}
              </p>
              <p className="summary-address">
                {watch("address")}, {watch("city")}, {watch("state")} - {watch("zipCode")}
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Order Summary */}
        <div className={`checkout-step-container ${currentStep === 2 ? "active" : "collapsed"}`}>
          <div className="checkout-step-header" onClick={() => currentStep > 2 && setCurrentStep(2)}>
            <div className="step-number-title">
              <span className="step-num">2</span>
              <h2>Order Summary</h2>
            </div>
            {currentStep > 2 && (
              <button type="button" className="step-change-btn">
                Change
              </button>
            )}
          </div>

          {currentStep === 2 ? (
            <div className="step-content">
              <div className="checkout-step-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="checkout-step-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-price">
                        ₹{item.price.toLocaleString("en-IN")} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="step-proceed-btn" onClick={() => setCurrentStep(3)}>
                Proceed to Payment
              </button>
            </div>
          ) : (
            currentStep > 2 && (
              <div className="step-summary-preview">
                <p className="summary-address">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Item(s) ready for shipment
                </p>
              </div>
            )
          )}
        </div>

        {/* Step 3: Payment Method */}
        <div className={`checkout-step-container ${currentStep === 3 ? "active" : "collapsed"}`}>
          <div className="checkout-step-header">
            <div className="step-number-title">
              <span className="step-num">3</span>
              <h2>Payment Options</h2>
            </div>
          </div>

          {currentStep === 3 && (
            <div className="step-content">
              <div className="payment-options">
                <label className="payment-option">
                  <input type="radio" value="cod" {...register("paymentMethod")} />
                  <span>Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input type="radio" value="card" {...register("paymentMethod")} />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="payment-option">
                  <input type="radio" value="upi" {...register("paymentMethod")} />
                  <span>UPI</span>
                </label>
                {errors.paymentMethod && (
                  <span className="error-message">{errors.paymentMethod.message}</span>
                )}
              </div>
              <Button type="submit" variant="primary" className="place-order-btn w-full">
                Place Order
              </Button>
            </div>
          )}
        </div>

      </form>
    </section>
  );
};

export default CheckoutForm;
