import { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const today = new Date();
today.setHours(0, 0, 0, 0);

const bookingSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9]{10,15}$/, {
      message: "Phone must be 10-15 digits (optional leading +)",
    }),
  email: z.string().trim().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  serviceType: z.string({ required_error: "Please select a service type" }).min(1, { message: "Please select a service type" }),
  preferredDate: z.string().refine(
    (val) => {
      if (!val) return false;
      const selectedDate = new Date(val);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    { message: "Date must be today or a future date" }
  ),
  preferredTime: z.string({ required_error: "Please select a preferred time" }).min(1, { message: "Please select a preferred time" }),
  notes: z.string().optional(),
});

const BookingDialog = ({ open, onOpenChange, onSubmit, user, initialServiceType }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceType: initialServiceType || "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    },
  });

  // Prefill details if user session is active
  useEffect(() => {
    if (open) {
      if (user) {
        setValue("name", user.name || "");
        setValue("email", user.email || "");
        setValue("phone", user.phone || "");
      }
      if (initialServiceType) {
        setValue("serviceType", initialServiceType);
      }
    }
  }, [user, open, initialServiceType, setValue]);

  const onValidSubmit = async (data) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Failed to book appointment.");
    }
  };

  const onInvalidSubmit = (errs) => {
    const firstErrorMessage = Object.values(errs)[0]?.message || "Please correct form errors.";
    toast.error(firstErrorMessage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#F6F2EE] border-none rounded-[22px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Book a Fitting & Consultation</DialogTitle>
          <DialogDescription className="text-[#7A655D]">
            Schedule an exclusive slot at the Asha Atelier. We will confirm your fitting details within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#2B1E1A]">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                {...register("name")}
                className={`bg-white border-[#E9E3DD] rounded-xl ${errors.name ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
              />
              {errors.name && (
                <span className="text-[#E46A53] text-xs block">{errors.name.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#2B1E1A]">Phone</Label>
              <Input
                id="phone"
                placeholder="+91..."
                {...register("phone")}
                className={`bg-white border-[#E9E3DD] rounded-xl ${errors.phone ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
              />
              {errors.phone && (
                <span className="text-[#E46A53] text-xs block">{errors.phone.message}</span>
              )}
            </div>
          </div>

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
            <Label htmlFor="serviceType" className="text-[#2B1E1A]">Service Type</Label>
            <Controller
              name="serviceType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={`bg-white border-[#E9E3DD] rounded-xl ${errors.serviceType ? "border-[#E46A53] focus:ring-[#E46A53]" : ""}`}>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bridal Consult">Bridal Consult (Fitting, Custom Sizing)</SelectItem>
                    <SelectItem value="Silk Fitting">Silk Fitting (Formal Draping & Tailoring)</SelectItem>
                    <SelectItem value="Fabric Selection">Fabric Selection & Style Consult</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.serviceType && (
              <span className="text-[#E46A53] text-xs block">{errors.serviceType.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-[#2B1E1A]">Preferred Date</Label>
              <Input
                id="preferredDate"
                type="date"
                {...register("preferredDate")}
                className={`bg-white border-[#E9E3DD] rounded-xl ${errors.preferredDate ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
              />
              {errors.preferredDate && (
                <span className="text-[#E46A53] text-xs block">{errors.preferredDate.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime" className="text-[#2B1E1A]">Preferred Time</Label>
              <Controller
                name="preferredTime"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`bg-white border-[#E9E3DD] rounded-xl ${errors.preferredTime ? "border-[#E46A53] focus:ring-[#E46A53]" : ""}`}>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                      <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                      <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                      <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                      <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.preferredTime && (
                <span className="text-[#E46A53] text-xs block">{errors.preferredTime.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#2B1E1A]">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide sizing notes or details regarding fabric type..."
              {...register("notes")}
              className="bg-white border-[#E9E3DD] rounded-xl min-h-[80px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-6 mt-2 font-serif text-lg transition-all"
          >
            Confirm Reservation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
