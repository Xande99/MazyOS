import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <AppShell
      userId={session?.user.id ?? ""}
      userEmail={session?.user.email ?? ""}
      signOutAction={signOut}
    >
      {children}
    </AppShell>
  );
}
