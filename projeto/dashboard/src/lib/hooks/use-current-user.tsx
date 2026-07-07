"use client";

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

type CurrentUser = { id: string; email: string } | null;

const CurrentUserContext = createContext<CurrentUser>(null);

/** Busca o usuário logado uma única vez (não a cada navegação) e
 * mantém sincronizado com eventos de login/logout. */
export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? "" });
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user
            ? { id: session.user.id, email: session.user.email ?? "" }
            : null,
        );
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
