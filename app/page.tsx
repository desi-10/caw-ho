"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const LoginDataSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // remember: z.boolean().default(false),
});

export type TypeofLoginData = z.infer<typeof LoginDataSchema>;

export default function Home() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TypeofLoginData>({
    resolver: zodResolver(LoginDataSchema),
  });

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        disableRedirect: true,
        provider: "google",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error(error);
          toast.error(error.error.data?.message || "Something went wrong");
        },
      }
    );
  };

  const onSubmit = async (data: TypeofLoginData) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        rememberMe: true,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error(error);
          toast.error(error.error.data?.message || "Something went wrong");
        },
      }
    );
  };

  console.log(errors);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-muted/40 p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl bg-card shadow-lg overflow-hidden rounded-lg">
        {/* Left Side - Login Panel */}
        <div className="bg-card flex flex-col p-8 lg:p-12 xl:p-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 mb-16">
            <div className="relative w-8 h-8">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-base font-semibold text-foreground">
              Christ Assembly Worldwide - Ho
            </span>
          </div>

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Login</h1>
              <p className="text-sm text-muted-foreground">
                Manage your church community and access your dashboard
              </p>
            </div>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 mb-5 justify-center gap-2"
              // onClick={handleGoogleSignIn}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Google logo"
              >
                <title>Google</title>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase">
                or Sign in with Email
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Login Form */}
            <form className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  className="h-11"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="h-11"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    // {...register("remember")}
                    // value={watch("remember") ? "true" : "false"}
                    // onChange={(e) => {
                    //   setValue("remember", e.target.value === "true");
                    // }}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal text-foreground cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="button"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </Button>

              {/* Sign Up Link */}
              {/* <p className="text-sm text-gray-600 text-center">
                Not registered yet?{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create an Account
                </Link>
              </p> */}
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Christ Assembly. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Purple Welcome Panel */}
        <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.3),transparent_50%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-12 w-full">
            {/* Main Heading */}
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Welcome to our
              <br />
              community
            </h2>

            {/* Description */}
            <p className="text-base text-white/90 max-w-md leading-relaxed mb-12">
              Personalized, updated daily, and beautifully presented.
              <br />
              Sign in to find your dream ways of earning and gain full access to
              platform functions.
            </p>

            {/* Center Icon with Glow Effect */}
            <div className="relative mb-12">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-400/30 blur-3xl rounded-full scale-150" />

              {/* Icon Container */}
              <div className="relative w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                {/* Logo/Icon */}
                <div className="relative w-20 h-20">
                  <Image
                    src="/logo.png"
                    alt="Icon"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Decorative Hand (placeholder - you can replace with actual image) */}
              {/* <div className="absolute -bottom-8 -right-12 w-32 h-32 opacity-90">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-200 blur-sm" />
            </div> */}
            </div>

            {/* Bottom Text */}
            <h3 className="text-2xl font-semibold mb-2">
              Make your dreams
              <br />
              come true.
            </h3>
            <p className="text-sm text-white/80 mb-8">
              Quality experience on all devices
            </p>

            {/* Carousel Dots */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-white/90" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
