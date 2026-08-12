import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApp } from "../../../../context/AppContext";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import "./CheckoutForm.css";

const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+91|0)?[6-9]\d{9}$/, {
      message: "Phone number must be a valid 10-digit Indian number (optionally starting with +91 or 0)",
    }),
  address: z.string().trim().min(5, { message: "Address details must be at least 5 characters" }),
  city: z.string().trim().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().trim().min(2, { message: "State must be at least 2 characters" }),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, {
      message: "ZIP code / Pincode must be exactly 6 digits",
    }),
  country: z.string().trim().min(2, { message: "Country must be at least 2 characters" }),
  paymentMethod: z.enum(["cod", "card", "upi"], {
    required_error: "Please select a payment method",
  }),
});

const CheckoutForm = ({ onPlaceOrder }) => {
  const { user, addresses = [], getDefaultAddress, cart = [] } = useApp();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [detecting, setDetecting] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    const toastId = toast.loading("Accessing your GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          toast.loading("Fetching location details...", { id: toastId });
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            const pincode = addr.postcode || "";
            const city = addr.city || addr.town || addr.village || addr.suburb || "";
            const state = addr.state || "";
            const country = addr.country || "India";
            
            const street = [
              addr.road,
              addr.suburb,
              addr.neighbourhood
            ].filter(Boolean).join(", ");

            if (street) setValue("address", street);
            if (city) setValue("city", city);
            if (state) setValue("state", state);
            if (pincode) setValue("zipCode", pincode);
            if (country) setValue("country", country);

            toast.success("Location details pre-filled successfully!", { id: toastId });
          } else {
            toast.error("Could not resolve address details. Please fill in manually.", { id: toastId });
          }
        } catch (err) {
          toast.error("Failed to fetch address details. Please fill in manually.", { id: toastId });
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        setDetecting(false);
        toast.dismiss(toastId);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please fill details manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("Failed to detect current location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
      if (defaultAddr.fullName) {
        const parts = defaultAddr.fullName.split(" ");
        setValue("firstName", parts[0] || "");
        setValue("lastName", parts.slice(1).join(" ") || "");
      }
      if (defaultAddr.phone) {
        setValue("phone", defaultAddr.phone);
      }
      const streetAddr = [defaultAddr.houseFlat, defaultAddr.street].filter(Boolean).join(", ");
      setValue("address", streetAddr || defaultAddr.address || "");
      setValue("city", defaultAddr.city || "");
      setValue("state", defaultAddr.state || "");
      setValue("zipCode", defaultAddr.pincode || defaultAddr.zip || "");
      setValue("country", defaultAddr.country || "India");
    } else if (addresses.length > 0) {
      const firstAddr = addresses[0];
      setSelectedAddressId(firstAddr.id);
      if (firstAddr.fullName) {
        const parts = firstAddr.fullName.split(" ");
        setValue("firstName", parts[0] || "");
        setValue("lastName", parts.slice(1).join(" ") || "");
      }
      if (firstAddr.phone) {
        setValue("phone", firstAddr.phone);
      }
      const streetAddr = [firstAddr.houseFlat, firstAddr.street].filter(Boolean).join(", ");
      setValue("address", streetAddr || firstAddr.address || "");
      setValue("city", firstAddr.city || "");
      setValue("state", firstAddr.state || "");
      setValue("zipCode", firstAddr.pincode || firstAddr.zip || "");
      setValue("country", firstAddr.country || "India");
    } else {
      setSelectedAddressId("new");
    }
  }, [user, addresses, setValue, getDefaultAddress]);

  const handleSelectAddress = (addr) => {
    if (addr === "new") {
      setSelectedAddressId("new");
      if (user) {
        const parts = user.name ? user.name.split(" ") : [];
        setValue("firstName", parts[0] || "");
        setValue("lastName", parts.slice(1).join(" ") || "");
        setValue("phone", user.phone || "");
      } else {
        setValue("firstName", "");
        setValue("lastName", "");
        setValue("phone", "");
      }
      setValue("address", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zipCode", "");
      setValue("country", "India");
    } else {
      setSelectedAddressId(addr.id);
      if (addr.fullName) {
        const parts = addr.fullName.split(" ");
        setValue("firstName", parts[0] || "");
        setValue("lastName", parts.slice(1).join(" ") || "");
      }
      if (addr.phone) {
        setValue("phone", addr.phone);
      }
      const streetAddr = [addr.houseFlat, addr.street].filter(Boolean).join(", ");
      setValue("address", streetAddr || addr.address || "");
      setValue("city", addr.city || "");
      setValue("state", addr.state || "");
      setValue("zipCode", addr.pincode || addr.zip || "");
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
                          <span className="address-type">{addr.addressType || addr.type || "Address"}</span>
                          {addr.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <p className="address-name">{addr.fullName || addr.name}</p>
                        <p className="address-text">
                          {[addr.houseFlat, addr.street].filter(Boolean).join(", ") || addr.address}, {addr.city}
                        </p>
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
                <div className="field-header-row">
                  <label style={{ marginBottom: 0 }}>Address</label>
                  <button
                    type="button"
                    className="detect-location-btn"
                    onClick={handleDetectLocation}
                    disabled={detecting}
                  >
                    <MapPin size={12} className={detecting ? "animate-spin-slow" : ""} />
                    {detecting ? "Detecting..." : "Use Current Location"}
                  </button>
                </div>
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
