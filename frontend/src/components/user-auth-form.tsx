"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { SignUpParams } from "@/interfaces/auth.interfaces";
import { useSignUpMutation } from "@/store/APIs/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EUserRoles } from "@/enums/user.enum";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const [signUp, { data, isError, isSuccess, error }] = useSignUpMutation();

  const [params, setParams] = React.useState<SignUpParams>({
    name: "",
    email: "",
    password: "",
    universityName: "",
  });

  const onChangeParams = React.useCallback((key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    await signUp({
      ...params,
      role: EUserRoles.ADMIN,
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Signup successfully. Redirecting to login page...");
      router.push("/login");
    }

    if (isError) {
      toast.error("Signup failed. Please try again.");
    }
  }, [data, error, isError, isSuccess, router]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Full name
            </Label>
            <Input
              value={params.name}
              onChange={(e) => onChangeParams("name", e.target.value)}
              id="name"
              placeholder="Full name"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              disabled={isLoading}
              value={params.email}
              onChange={(e) => onChangeParams("email", e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              value={params.password}
              onChange={(e) => onChangeParams("password", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="universityName">
              University Name
            </Label>
            <Input
              id="universityName"
              placeholder="University Name"
              disabled={isLoading}
              value={params.universityName}
              onChange={(e) => onChangeParams("universityName", e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  );
}
