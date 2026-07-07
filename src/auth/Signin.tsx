import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react";
import websiteBg from "../assets/website bg.png";
import { FadeUp } from "../landingpage ui/components/FadeUp";

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSession } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const from = location.state?.from?.pathname || null;

  const onSubmit = async (data: SigninFormValues) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        // Fetch role to determine redirect
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !profileData) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Could not retrieve user role. Please contact support.",
          });
          return;
        }

        const role = profileData.role;
        const status = profileData.status;

        if (role === "faculty" && status === "pending") {
          await supabase
            .from("profiles")
            .update({ status: "active" })
            .eq("id", authData.user.id);
        }

        // Pass the cached role to avoid duplicate fetch!
        await refreshSession(role as any);
        
        toast({
          title: "Welcome Back",
          description: "Successfully logged in.",
        });

        if (from) {
          navigate(from, { replace: true });
        } else {
          if (role === "student") navigate("/student", { replace: true });
          else if (role === "faculty") navigate("/faculty", { replace: true });
          else if (role === "admin") navigate("/admin", { replace: true });
          else navigate("/", { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 selection:bg-white/10 selection:text-white font-sans overflow-y-auto">
      {/* Fixed Background Image */}
      <img
        src={websiteBg}
        alt="Background"
        className="fixed top-0 left-0 w-full h-[100vh] object-cover z-0 pointer-events-none brightness-50"
      />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-0 pointer-events-none" />

      {/* Back to Home Link (Absolute Top Left of Viewport) */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-20 text-xs font-bold text-white hover:opacity-60 transition-opacity flex items-center gap-1.5"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Main Container */}
      <FadeUp
        delay={0.1}
        className="relative z-10 w-full max-w-md bg-black/45 backdrop-blur-md border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col gap-8 text-white"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2">
          <Link to="/" className="text-[13px] font-bold tracking-[0.12em] uppercase text-white hover:opacity-60 transition-opacity">
            SKILL HUNT
          </Link>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">PROJECT PORTAL</span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-[20px] font-bold uppercase tracking-wide">WELCOME BACK</h2>
          <p className="text-xs text-white/60 mt-2 font-medium">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-white/30" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25`}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-white text-black focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-white/60 font-semibold cursor-pointer select-none">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-white hover:opacity-60 transition-opacity"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-white text-black rounded-full text-xs font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> LOGGING IN...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-white/60 font-semibold">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-white hover:opacity-60 transition-opacity"
            >
              Register Now
            </Link>
          </p>
        </div>
      </FadeUp>
    </div>
  );
}
