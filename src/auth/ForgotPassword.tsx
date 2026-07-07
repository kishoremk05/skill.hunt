import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import websiteBg from "../assets/website bg.png";
import { FadeUp } from "../landingpage ui/components/FadeUp";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for instructions to reset your password.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "Could not send reset link.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 selection:bg-white/10 selection:text-white font-sans overflow-hidden">
      {/* Fixed Background Image */}
      <img
        src={websiteBg}
        alt="Background"
        className="fixed top-0 left-0 w-full h-[100vh] object-cover z-0 pointer-events-none brightness-50"
      />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-0 pointer-events-none" />

      {/* Main Container */}
      <FadeUp
        delay={0.1}
        className="relative z-10 w-full max-w-md bg-black/45 backdrop-blur-md border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col gap-8 text-white"
      >
        {/* Back Link */}
        <Link 
          to="/login" 
          className="self-start text-xs font-bold text-white hover:opacity-60 transition-opacity flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2">
          <Link to="/" className="text-[13px] font-bold tracking-[0.12em] uppercase text-white hover:opacity-60 transition-opacity">
            SKILL HUNT
          </Link>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">PASSWORD RESET</span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-[20px] font-bold uppercase tracking-wide">FORGOT PASSWORD</h2>
          <p className="text-xs text-white/60 mt-2 font-medium">
            Enter your email to receive a secure password reset link.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <p className="text-xs font-bold text-emerald-400">
              Reset link sent! Please check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-white/30" />
                </span>
                <input
                  type="email"
                  placeholder="name@university.edu"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-white text-black rounded-full text-xs font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SENDING LINK...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </FadeUp>
    </div>
  );
}
