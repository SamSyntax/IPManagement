"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { FormError } from "../form-error";

import { RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { register } from "@/actions/register";
import { toast } from "@/components/ui/use-toast";
import { FormSuccess } from "../form-success";

const AuthWrapper = ({ ...props }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      password: "",
      simsId: "",
      name: "",
      surname: "",
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(data).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data.error) {
          toast({
            title: "Ughh, something went wrong!",
            description: data.error,
            variant: "destructive",
          });
        }
        if (data.success) {
          toast({
            title: "Success",
            description: `User registered successfully ${data.success}`,
          });
        }
      });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("simsId", e.target.value.toUpperCase());
  };

  return (
    <div className="flex flex-col  h-full w-screen">
      <div className="h-[50vh] flex items-start justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-[400px]"
          >
            <Card className="w-[400px]2">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Make changes to the VPN IP Addresses database. Click{" "}
                  <b>Login</b> when you enter your credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="grid grid-cols-2 grid-rows-1 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="name">Name</Label>
                          <FormControl>
                            <Input
                              id="name"
                              placeholder="Arthur"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="surname">Surname</Label>
                          <FormControl>
                            <Input
                              id="surname"
                              placeholder="Smith"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">Email Address</Label>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="arthur.smith@dbschenker.com"
                            disabled={isPending}
                            {...field}
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
                              onClick={() => setIsVisible(!isVisible)}
                            >
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
                <Button disabled={isPending} variant="outline" type="submit">
                  Register
                </Button>
              </CardFooter>
            </Card>

            <FormError message={error} />
            <FormSuccess message={success} />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthWrapper;
