import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset. Please log in.",
      });

      navigate("/login", { replace: true });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update your password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-slate-50 dark:bg-[#0b1120] p-4">
      <div className="w-full max-w-md relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 p-8 sm:p-10 shadow-xl"
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Create New Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Your identity has been verified. Please enter your new secure password below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all`}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
