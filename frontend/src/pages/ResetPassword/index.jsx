import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { resetPassword } from "../../services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import "../../components/auth/auth.css";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
      .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
      .regex(/(?=.*\d)/, { message: "Password must contain at least one digit" })
      .regex(/(?=.*[^a-zA-Z0-9])/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid reset token. Please check your email or generate a new link.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, data.password);
      toast.success("Password has been reset successfully! Please sign in with your new password.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const onInvalidSubmit = (errs) => {
    const firstErrorMessage = Object.values(errs)[0]?.message || "Please correct form errors.";
    toast.error(firstErrorMessage);
  };

  if (!token) {
    return (
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="Invalid Link"
            subtitle="This password reset link is invalid or has expired."
          />
          <div className="text-center mt-6">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create New Password"
          subtitle="Please choose a strong, secure password that you haven't used before."
        />

        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="auth-form">
          <div className="form-group">
            <Label htmlFor="password" className="text-[#2D211C]">New Password</Label>
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

          <div className="form-group">
            <Label htmlFor="confirmPassword" className="text-[#2D211C]">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`bg-white border-[#E9E3DD] rounded-xl ${errors.confirmPassword ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
            />
            {errors.confirmPassword && (
              <span className="text-[#E46A53] text-xs block mt-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full mt-4"
          >
            {loading ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPassword;
