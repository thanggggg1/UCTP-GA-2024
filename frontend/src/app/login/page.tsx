"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { LoginParams } from "@/interfaces/auth.interfaces";
import { useRouter } from "next/navigation";
import { useSignInMutation } from "@/store/APIs/auth";
import { toast } from "sonner";
import { handleLogin } from "@/auth/useLogin";

export default function Login() {
  const router = useRouter();
  const [params, setParams] = useState<LoginParams>({
    email: "",
    password: "",
  });
  const onChange = useCallback((key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);
  const [signIn, { data, isError, isLoading, isSuccess, error }] =
    useSignInMutation();

  const onSubmit = useCallback(async () => {
    await signIn(params);
  }, [params]);

  useEffect(() => {
    if (isSuccess && data) {
      toast.dismiss();
      handleLogin({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      });

      toast.success("Login successfully. Redirecting to dashboard...");
      router.push("/rooms");
    }
    if (isLoading) {
      toast.loading("Loading...");
    }
    if (isError) {
      toast.error("Login failed. Please try again.");
    }
  }, [data, error, isError, isLoading, isSuccess, router]);
  return (
    <div className="w-full lg:grid min-h-[100vh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={params.email}
                onChange={(e) => onChange("email", e.target.value)}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                value={params.password}
                onChange={(e) => onChange("password", e.target.value)}
                id="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" onClick={onSubmit}>
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
