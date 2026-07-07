import { AppShell } from "@/components/layout/app-shell";
import { signOut } from "./actions";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell signOutAction={signOut}>{children}</AppShell>;
}
