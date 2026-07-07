import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Lock, User, Building2, Calendar, ArrowLeft } from "lucide-react";
import websiteBg from "../assets/website bg.png";
import { FadeUp } from "../landingpage ui/components/FadeUp";

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  department: z.string().min(2, { message: "Department is required" }),
  year: z.string().min(1, { message: "Academic year is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            department: data.department,
            year: data.year,
            role: "student", // Strictly hardcoded as per requirements
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registration Successful",
        description: "Welcome to ProjectHub! Please log in to continue.",
      });

      navigate("/login", { replace: true });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
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
        className="relative z-10 w-full max-w-xl bg-black/45 backdrop-blur-md border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col gap-6 text-white my-8"
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
          <h2 className="text-[20px] font-bold uppercase tracking-wide">STUDENT REGISTRATION</h2>
          <p className="text-xs text-white/60 mt-2 font-medium">
            Create your account to start showcasing your projects.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-white/30" />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.fullName ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25`}
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email Address */}
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Department</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-white/30" />
                </span>
                <input
                  type="text"
                  placeholder="Computer Science"
                  {...register("department")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.department ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25`}
                />
              </div>
              {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
            </div>

            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Academic Year</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-white/30" />
                </span>
                <select
                  {...register("year")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.year ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25 appearance-none`}
                >
                  <option value="" className="bg-[#121212] text-white">Select Year</option>
                  <option value="1" className="bg-[#121212] text-white">1st Year</option>
                  <option value="2" className="bg-[#121212] text-white">2nd Year</option>
                  <option value="3" className="bg-[#121212] text-white">3rd Year</option>
                  <option value="4" className="bg-[#121212] text-white">4th Year</option>
                  <option value="Master" className="bg-[#121212] text-white">Master's</option>
                  <option value="PhD" className="bg-[#121212] text-white">PhD</option>
                </select>
              </div>
              {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year.message}</p>}
            </div>

            {/* Password */}
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25`}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-white/30" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/12 focus:border-white/35'} rounded-xl focus:outline-none focus:ring-0 text-xs transition-all text-white placeholder-white/25`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-white text-black rounded-full text-xs font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> REGISTERING...
              </>
            ) : (
              "Create Student Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-white/60 font-semibold">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-white hover:opacity-60 transition-opacity"
            >
              Log In
            </Link>
          </p>
        </div>
      </FadeUp>
    </div>
  );
}
