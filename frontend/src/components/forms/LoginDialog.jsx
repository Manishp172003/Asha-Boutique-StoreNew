import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const LoginDialog = ({ open, onOpenChange, onSubmit, loading }) => {
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

  const onValidSubmit = async (data) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      toast.error(error.message || "Login failed.");
    }
  };

  const onInvalidSubmit = (errs) => {
    const firstErrorMessage = Object.values(errs)[0]?.message || "Please correct form errors.";
    toast.error(firstErrorMessage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Welcome Back</DialogTitle>
          <DialogDescription className="text-[#7A655D]">
            Sign in to access your account and view your orders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#2B1E1A]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              className={`bg-white border-[#E9E3DD] rounded-xl ${errors.email ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
            />
            {errors.email && (
              <span className="text-[#E46A53] text-xs block">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#2B1E1A]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`bg-white border-[#E9E3DD] rounded-xl ${errors.password ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
            />
            {errors.password && (
              <span className="text-[#E46A53] text-xs block">{errors.password.message}</span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#7A655D]">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="rounded"
              />
              Remember me
            </label>
            <button type="button" className="text-[#E46A53] hover:underline">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-[#7A655D]">
            Don't have an account?{" "}
            <button type="button" className="text-[#E46A53] hover:underline">
              Sign up
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
