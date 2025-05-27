"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getCsrfToken, signIn } from "next-auth/react";

const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

const LoginForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [passwordType, setPasswordType] = React.useState("password");

  const togglePasswordType = () => {
    setPasswordType(prev => (prev === "text" ? "password" : "text"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const csrfToken = await getCsrfToken();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      csrfToken,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      toast.error("Credenciais inválidas. Tente novamente.");
    } else {
      toast.success("Successfully logged in");
      router.refresh(); // Garante sessão atualizada
      router.push(result?.url || "/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium text-default-600">Email</Label>
        <Input
          size="lg"
          disabled={isPending}
          {...register("email")}
          type="email"
          id="email"
          className={cn("", {
            "border-destructive": errors.email,
          })}
        />
        {errors.email && (
          <div className="text-destructive mt-2 text-sm">{errors.email.message}</div>
        )}
      </div>

      <div className="mt-3.5 space-y-2">
        <Label htmlFor="password" className="mb-2 font-medium text-default-600">Password</Label>
        <div className="relative">
          <Input
            size="lg"
            disabled={isPending}
            {...register("password")}
            type={passwordType}
            id="password"
            className="peer"
            placeholder=" "
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
            role="button"
            aria-label={passwordType === "password" ? "Mostrar senha" : "Ocultar senha"}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
            )}
          </div>
        </div>
        {errors.password && (
          <div className="text-destructive mt-2 text-sm">{errors.password.message}</div>
        )}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Checkbox id="checkbox" defaultChecked />
          <Label htmlFor="checkbox">Mantenha-me conectado</Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-default-800 dark:text-default-400 leading-6 font-medium"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      <Button fullWidth disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Loading..." : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;
