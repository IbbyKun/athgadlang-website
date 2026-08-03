"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signIn } from "@/app/admin/actions";
import { emptyFormState } from "@/lib/admin/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, action] = useActionState(signIn, emptyFormState);

  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <label htmlFor="password" className="sr-only">
        Admin password
      </label>

      <Input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        required
        autoFocus
        aria-invalid={Boolean(state.message || state.errors?.password)}
        aria-describedby={state.message ? "login-error" : undefined}
        className="h-10"
      />

      {(state.message || state.errors?.password) && (
        <p
          id="login-error"
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {state.message ?? state.errors?.password}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  // `useFormStatus` has to be read from a child of the form, not the component
  // that renders it — hence the split.
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="h-10 w-full">
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}
