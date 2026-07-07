import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Role = "student" | "faculty" | "admin" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: Role;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: (cachedRole?: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } else {
        setRole(data.role as Role);
      }
    } catch (err) {
      console.error("Failed to fetch profile role:", err);
      setRole(null);
    }
  };

  const refreshSession = async (cachedRole?: Role) => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      if (data.session?.user) {
        if (cachedRole) {
          setRole(cachedRole);
        } else {
          await fetchProfileRole(data.session.user.id);
        }
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    refreshSession();

    // Listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        await fetchProfileRole(currentSession.user.id);
      } else {
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, isLoading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
