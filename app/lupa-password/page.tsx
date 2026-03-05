"use client";

import * as React from "react";
import { useState, useMemo, useId } from "react";
import { Eye, EyeOff, Check, X, Lock, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const id = useId();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Minimal 8 karakter" },
      { regex: /[0-9]/, text: "Minimal 1 angka" },
      { regex: /[a-z]/, text: "Minimal 1 huruf kecil" },
      { regex: /[A-Z]/, text: "Minimal 1 huruf besar" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-blue-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Masukkan kata sandi";
    if (score <= 2) return "Kata sandi lemah";
    if (score === 3) return "Kata sandi sedang";
    return "Kata sandi kuat";
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid = strengthScore === 4 && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setIsSubmitted(true);
      // Mock success, redirect after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950 mx-auto">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Kata Sandi Berhasil Diatur Ulang</h1>
          <p className="text-muted-foreground">Anda akan dialihkan ke halaman masuk dalam beberapa detik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/50 via-background to-blue-50/30 dark:from-blue-950/10 dark:via-background dark:to-blue-950/5 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-blue-100/50 dark:border-blue-900/20 bg-card p-8 shadow-xl shadow-blue-500/5">
          <div className="mb-8 flex flex-col items-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Atur Ulang Kata Sandi
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              Buat kata sandi yang kuat untuk akun Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Kata Sandi Baru</Label>
              <div className="relative">
                <Input
                  id={`${id}-password`}
                  className="pe-9 h-11 rounded-xl"
                  placeholder="Masukkan kata sandi baru"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={strengthScore < 4}
                  aria-describedby={`${id}-description`}
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  aria-pressed={isPasswordVisible}
                >
                  {isPasswordVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>

              <div
                className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                role="progressbar"
                aria-valuenow={strengthScore}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-label="Password strength"
              >
                <div
                  className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                  style={{ width: `${(strengthScore / 4) * 100}%` }}
                ></div>
              </div>

              <p
                id={`${id}-description`}
                className="mt-2 text-sm font-bold text-foreground"
              >
                {getStrengthText(strengthScore)}
              </p>

              <ul className="mt-3 space-y-2" aria-label="Password requirements">
                {strength.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {req.met ? (
                      <Check
                        size={14}
                        className="text-blue-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <X
                        size={14}
                        className="text-muted-foreground/50"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`text-xs ${
                        req.met
                          ? "text-blue-600 dark:text-blue-400 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-confirm`}>Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Input
                  id={`${id}-confirm`}
                  className="pe-9 h-11 rounded-xl"
                  placeholder="Konfirmasi kata sandi baru"
                  type={isConfirmVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-invalid={!passwordsMatch && confirmPassword.length > 0}
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleConfirmVisibility}
                  aria-label={
                    isConfirmVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isConfirmVisible}
                >
                  {isConfirmVisible ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {passwordsMatch ? (
                    <>
                      <Check
                        size={14}
                        className="text-blue-500"
                        aria-hidden="true"
                      />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Kata sandi cocok
                      </span>
                    </>
                  ) : (
                    <>
                      <X
                        size={14}
                        className="text-red-500"
                        aria-hidden="true"
                      />
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Kata sandi tidak cocok
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={cn(
                "inline-flex w-full items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold transition-all outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 h-12 px-8",
                "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              )}
            >
              Reset Kata Sandi
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
