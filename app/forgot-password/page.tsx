"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await authClient.forgetPassword({
        email: data.email,
        redirectTo: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || window.location.origin}/reset-password`,
      }, {
        onSuccess: () => {
          setEmailSent(true);
          toast.success("Password reset email sent! Please check your inbox.");
        },
        onError: (error) => {
          toast.error(error.error.data?.message || "Failed to send reset email");
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {!emailSent ? (
            <Card>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  Enter your email address to receive a password reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Check Your Email</CardTitle>
                <CardDescription>
                  We've sent a password reset link to {getValues("email")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to reset your password. The link will expire in 1 hour.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEmailSent(false)}
                      className="w-full"
                    >
                      Resend Email
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full"
                    >
                      <Link href="/">
                        Back to Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Right Side - Welcome Panel */}
      <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 relative overflow-hidden w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.3),transparent_50%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-12 w-full">
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Reset Your
            <br />
            Password
          </h2>
          <p className="text-base text-white/90 max-w-md leading-relaxed">
            Follow the instructions in the email to securely reset your password and regain access to your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

