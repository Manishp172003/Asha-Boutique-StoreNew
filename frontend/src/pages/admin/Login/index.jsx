import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { login, logout, loginWithGoogle } from "../../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { useApp } from "../../../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./login.css";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data.email, data.password);

      // Check if user is admin
      if (response.user?.role !== "ADMIN") {
        toast.error("Access Denied: Authorized personnel only.");
        logout();
        setUser(null);
        return;
      }

      setUser({
        id: response.user?.id,
        name: response.user?.name || "Admin",
        email: response.user?.email || data.email,
        phone: response.user?.phone,
        role: "ADMIN",
      });

      toast.success("Welcome to Asha Boutique Management Suite");
      navigate("/admin");
    } catch (error) {
      toast.error(error.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await loginWithGoogle(credentialResponse.credential);

      // Check if user is admin
      if (response.user?.role !== "ADMIN") {
        toast.error("Access Denied: Authorized personnel only.");
        logout();
        setUser(null);
        return;
      }

      setUser({
        id: response.user?.id,
        name: response.user?.name || "Admin",
        email: response.user?.email,
        phone: response.user?.phone,
        role: "ADMIN",
      });

      toast.success("Welcome to Asha Boutique Management Suite");
      navigate("/admin");
    } catch (error) {
      toast.error(error.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google authentication failed.");
  };

  const handleReportSecurity = () => {
    toast.success("Security concern report ticket opened.");
  };

  return (
    <div className="admin-login-page">
      {/* Left Column - Form */}
      <div className="admin-login-left">
        <div className="admin-login-form-container">
          <div className="admin-login-brand">
            <span className="brand-title">Asha Boutique</span>
            <span className="brand-subtitle">MANAGEMENT SUITE</span>
          </div>

          <div className="admin-login-header">
            <h2>Administrator Login</h2>
            <p>Enter your credentials to access the atelier dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="admin-login-form">
            <div className="admin-form-group">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@ashaboutique.com"
                {...register("email")}
                className={`bg-white border-[#E9E3DD] rounded-xl ${errors.email ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
              />
              {errors.email && (
                <span className="text-[#E46A53] text-xs mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div className="admin-form-group">
              <div className="label-row">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="forgot-password-link">
                  Forgot Password?
                </button>
              </div>
              <div className="password-input-wrapper">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`bg-white border-[#E9E3DD] rounded-xl pr-10 ${errors.password ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[#E46A53] text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <div className="admin-form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                />
                <span>Remember this session for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="admin-login-btn"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>

            <div className="social-login" style={{ margin: "20px 0 10px" }}>
              <div className="divider" style={{ 
                display: "flex", 
                alignItems: "center", 
                color: "#9b8b84", 
                fontSize: "12px", 
                margin: "15px 0" 
              }}>
                <span style={{ flex: 1, height: "1px", background: "#eae3dd" }}></span>
                <span style={{ padding: "0 10px" }}>or authenticate with</span>
                <span style={{ flex: 1, height: "1px", background: "#eae3dd" }}></span>
              </div>
              <div className="flex justify-center w-full mt-3 google-login-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  shape="pill"
                  size="large"
                />
              </div>
            </div>

            <div className="admin-login-footer">
              <p>Authorized personnel only.</p>
              <button type="button" onClick={handleReportSecurity} className="report-btn">
                Report Security Concern
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Media & Spotlight Card */}
      <div className="admin-login-right">
        <div className="spotlight-overlay">
          {/* Mockup Card (Floating/Glassmorphism element) */}
          <div className="mockup-login-card">
            <div className="mockup-card-header">
              <span className="mockup-brand">Asha Boutique</span>
              <span className="mockup-title">Admin Login</span>
            </div>
            <div className="mockup-card-form">
              <div className="mockup-input-group">
                <div className="mockup-placeholder-label">Email Address</div>
                <div className="mockup-placeholder-input">hello@ashaboutique.com</div>
              </div>
              <div className="mockup-input-group">
                <div className="mockup-placeholder-label">Password</div>
                <div className="mockup-placeholder-input">••••••••</div>
              </div>
              <div className="mockup-card-btn">LOG-IN</div>
            </div>
          </div>

          {/* Spotlight text */}
          <div className="spotlight-card">
            <span className="spotlight-tag">ARTISAN SPOTLIGHT</span>
            <h3>Crafting with Intention</h3>
            <p>
              Every thread tells a story of craftsmanship. Our management suite ensures that the
              journey from atelier to customer is as seamless as the fibers we weave.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
