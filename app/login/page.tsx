"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section-dark">
      <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-20 text-center md:py-28">
        <p className="hero-eyebrow">Trojan Command Center</p>
        <h1 className="mt-3 font-serif text-4xl text-white">Private Access</h1>
        <p className="mt-2 text-sm text-white/70">Enter the password to continue.</p>

        <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
          <div className="text-left">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-ink/10 bg-cream-card px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/30 focus:border-gold"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-gold-bright">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </section>
  );
}
