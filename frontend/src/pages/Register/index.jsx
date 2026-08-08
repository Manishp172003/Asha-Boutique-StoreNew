import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { register as registerService } from "../../services/authService";
import { useApp } from "../../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import "../../components/auth/auth.css";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Full name is required" }),
    email: z.string().trim().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
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

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await registerService(data.email, data.password, data.name);

      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: response.user.role,
      });

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onInvalidSubmit = (errs) => {
    const firstErrorMessage = Object.values(errs)[0]?.message || "Please correct form errors.";
    toast.error(firstErrorMessage);
  };

  return (
    <AuthLayout reverse={true}>
      <AuthCard>
        <AuthHeader
          title="Join Asha Boutique"
          subtitle="Experience curated fashion tailored for you."
        />

        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="auth-form">
          <div className="form-group">
            <Label htmlFor="name" className="text-[#2D211C]">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={`bg-white border-[#E9E3DD] rounded-xl ${errors.name ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
            />
            {errors.name && (
              <span className="text-[#E46A53] text-xs block mt-1">{errors.name.message}</span>
            )}
          </div>

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
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="auth-footer">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default Register;