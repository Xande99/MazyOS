import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm flex-1 px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Minha conta
      </h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
