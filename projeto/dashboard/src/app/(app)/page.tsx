import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("nome")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold text-text">
        Bem-vindo, {profile?.nome ?? user?.email}
      </h1>
      <p className="text-sm text-text-muted">
        Escolha um módulo na barra lateral.
      </p>
    </div>
  );
}
