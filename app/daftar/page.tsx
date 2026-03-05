"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50/50 via-background to-blue-50/30 dark:from-blue-950/10 dark:via-background dark:to-blue-950/5">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Tab Switcher */}
          <div className="mb-6 flex gap-2 rounded-lg bg-muted/50 p-1">
            <Link
              href="/login"
              className={cn(
                "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all text-center",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/daftar"
              className={cn(
                "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all text-center",
                "bg-background text-foreground shadow-sm"
              )}
            >
              Sign Up
            </Link>
          </div>

          <Card className="border-blue-100/50 dark:border-blue-900/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button size="sm" variant="outline" type="button">
                    <Icons.gitHub className="mr-2 size-4" />
                    GitHub
                  </Button>
                  <Button size="sm" variant="outline" type="button">
                    <Icons.google className="mr-2 size-4" />
                    Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full name</Label>
                  <Input id="signup-name" type="text" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required />
                </div>

                <div className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <button type="button" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Privacy Policy
                  </button>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                  Create account
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
