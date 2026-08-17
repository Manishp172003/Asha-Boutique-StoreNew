import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { login, loginWithGoogle, forgotPassword } from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { useApp } from "../../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import "../../components/auth/auth.css";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
    .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
    .regex(/(?=.*\d)/, { message: "Password must contain at least one digit" })
    .regex(/(?=.*[^a-zA-Z0-9])/, { message: "Password must contain at least one special character" }),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [demoResetLink, setDemoResetLink] = useState("");

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

      setUser({
        id: response.user?.id,
        name: response.user?.name || data.email.split("@")[0],
        email: response.user?.email || data.email,
        phone: response.user?.phone,
        role: response.user?.role || "CUSTOMER",
      });

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await forgotPassword(forgotEmail);
      toast.success("Password reset request submitted successfully!");
      if (response.token) {
        setDemoResetLink(`/reset-password?token=${response.token}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit password reset request.");
    } finally {
      setForgotLoading(false);
    }
  };

  const onInvalidSubmit = (errs) => {
    const firstErrorMessage = Object.values(errs)[0]?.message || "Please correct form errors.";
    toast.error(firstErrorMessage);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await loginWithGoogle(credentialResponse.credential);

      setUser({
        id: response.user?.id,
        name: response.user?.name || "Customer",
        email: response.user?.email,
        phone: response.user?.phone,
        role: response.user?.role || "CUSTOMER",
      });

      toast.success("Logged in with Google successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google authentication failed.");
  };

  return (
    <AuthLayout>
      <AuthCard>
        {!isForgotPassword ? (
          <>
            <AuthHeader
              title="Welcome Back"
              subtitle="Sign in to access your account and view your orders."
            />

            <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="auth-form">
              <div className="form-group">
                <Label htmlFor="email" className="text-[#2D211C]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={`bg-white border-[#E9E3DD] rounded-xl ${errors.email ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
                />
                {errors.email && (
                  <span className="text-[#E46A53] text-xs block mt-1">{errors.email.message}</span>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="password" className="text-[#2D211C]">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`bg-white border-[#E9E3DD] rounded-xl ${errors.password ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
                />
                {errors.password && (
                  <span className="text-[#E46A53] text-xs block mt-1">{errors.password.message}</span>
                )}
              </div>

              <div className="form-options">
                <label>
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                  />
                  Remember me
                </label>
                <button 
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setDemoResetLink("");
                  }}
                  className="hover:underline text-[#8C6D58]"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="social-login">
                <div className="divider">or continue with</div>
                <div className="flex justify-center w-full mt-4 google-login-wrapper">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    shape="pill"
                    size="large"
                  />
                </div>
              </div>

              <div className="auth-footer">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <AuthHeader
              title="Reset Password"
              subtitle="Enter your email address and we will generate a secure link to reset your password."
            />

            <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
              <div className="form-group">
                <Label htmlFor="forgot-email" className="text-[#2D211C]">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="bg-white border-[#E9E3DD] rounded-xl"
                  required
                />
              </div>

              {demoResetLink && (
                <div className="p-4 mb-4 text-sm text-[#8C6D58] bg-[#FAF8F5] border border-[#E9E3DD] rounded-xl">
                  <span className="font-semibold block mb-1">Local Sandbox Mode:</span>
                  Reset link printed to logs. You can also click below to proceed:
                  <button
                    type="button"
                    onClick={() => navigate(demoResetLink)}
                    className="block mt-2 font-semibold underline text-[#2D211C] hover:text-[#8C6D58] transition-colors"
                  >
                    Reset Password Now &rarr;
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={forgotLoading}
                className="w-full"
              >
                {forgotLoading ? "Submitting..." : "Send Reset Link"}
              </Button>

              <div className="auth-footer">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
