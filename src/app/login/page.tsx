"use client";

import PageWrapper from "@/components/PageWrapper";
import { Button, Input } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate slight delay for effect
    await new Promise((r) => setTimeout(r, 800));
    login(email);
  };

  return (
    <PageWrapper className="flex items-center justify-center py-16">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted text-primary-dark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">
            Sign In
          </h1>
          <p className="text-sm text-muted">
            Enter your email to access the marketplace.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input 
            id="email"
            label="Email Address" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            className="mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Continue with Email"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-light">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Guest access / Info */}
        <p className="text-center text-xs text-muted leading-relaxed">
          By signing in, you agree to our Terms of Service and Privacy Policy. 
          <br />
          No password required — keep it simple.
        </p>

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-muted transition-colors hover:text-primary-dark"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
