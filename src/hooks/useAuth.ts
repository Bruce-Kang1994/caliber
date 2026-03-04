"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      if (user) {
        // Check admin role from profile
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setState({
              user,
              loading: false,
              isAdmin: data?.role === "admin",
            });
          });
      } else {
        setState({ user: null, loading: false, isAdmin: false });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setState({
              user,
              loading: false,
              isAdmin: data?.role === "admin",
            });
          });
      } else {
        setState({ user: null, loading: false, isAdmin: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [supabase]
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, [supabase]);

  return {
    ...state,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
