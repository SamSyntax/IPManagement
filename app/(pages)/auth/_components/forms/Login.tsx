"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { login } from "@/actions/login";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
import { FormError } from "../form-error";

const AuthWrapper = ({ ...props }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      password: "",
      simsId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setIsVisible(false);
    startTransition(() => {
      login(values).then((data) => {
        setError(data.error);
      });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("simsId", e.target.value.toUpperCase());
  };

  return (
    <div className="flex flex-col  h-full w-screen">
      <div className=" h-[50vh] flex items-start justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-[400px]">
            <Card className="w-[400px]">
              <CardHeader>
                <CardDescription>
                  Make changes to the VPN IP Addresses database. Click{" "}
                  <b>Login</b> when you enter your credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1 ">
                  <FormField
                    control={form.control}
                    name="simsId"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="simsId">SIMSID</Label>
                        <FormControl>
                          <Input
                            id="simsId"
                            placeholder="ARTSMITH"
                            disabled={isPending}
                            {...field}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                          <div className="flex space-x-4">
                            <Input
                              type={isVisible ? "text" : "password"}
                              id="password"
                              placeholder="Password"
                              disabled={isPending}
                              {...field}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              type="button"
                              disabled={isPending}
                              onClick={() => setIsVisible(!isVisible)}>
                              {isVisible ? <EyeIcon /> : <EyeClosedIcon />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <Button
                  onKeyDown={() => setIsVisible(false)}
                  onSubmit={() => setIsVisible(false)}
                  disabled={isPending}
                  variant="outline"
                  type="submit">
                  Login
                </Button>
              </CardFooter>
            </Card>
            <FormError message={error} />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthWrapper;
