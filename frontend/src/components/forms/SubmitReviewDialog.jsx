import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitTestimonial } from "../../services/testimonialService";

const reviewSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  rating: z.number().min(1, { message: "Please select a rating of at least 1 star" }).max(5),
  quote: z.string().trim().min(5, { message: "Your review must be at least 5 characters long" }),
});

const SubmitReviewDialog = ({ open, onOpenChange, user, onSuccess }) => {
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: user?.name || "",
      rating: 5,
      quote: "",
    },
  });

  // Keep rating in sync when user logs in/changes
  useState(() => {
    if (user) {
      setValue("name", user.name);
    }
  });

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    setValue("rating", selectedRating);
  };

  const onValidSubmit = async (data) => {
    const loader = toast.loading("Submitting review for moderation...");
    try {
      await submitTestimonial({
        name: data.name,
        rating: Number(data.rating),
        quote: data.quote,
        avatarUrl: "" // Backend will apply a default avatar if empty
      });
      toast.dismiss(loader);
      toast.success("Thank you! Your review has been submitted for admin approval.");
      reset();
      setRating(5);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.dismiss(loader);
      toast.error(err.message || "Failed to submit review");
    }
  };

  const onInvalidSubmit = (errs) => {
    const firstErrorMessage = Object.values(errs)[0]?.message || "Please correct review details.";
    toast.error(firstErrorMessage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">Share Your Experience</DialogTitle>
          <DialogDescription className="text-[#7A655D]">
            We value your honest feedback. Your review will be published to the homepage once approved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="space-y-4 mt-4">
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
            <Label className="text-[#2B1E1A] block">Rating</Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const filled = starValue <= rating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => handleStarClick(starValue)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer outline-none"
                  >
                    <Star 
                      size={24} 
                      className={filled ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-300"} 
                    />
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register("rating")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote" className="text-[#2B1E1A]">Your Review</Label>
            <Textarea
              id="quote"
              placeholder="Share your thoughts about your boutique orders or tailoring experience..."
              rows={4}
              {...register("quote")}
              className={`bg-white border-[#E9E3DD] rounded-xl ${errors.quote ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
            />
            {errors.quote && (
              <span className="text-[#E46A53] text-xs block">{errors.quote.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-6 mt-4 font-serif text-lg"
          >
            Submit Review
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitReviewDialog;
