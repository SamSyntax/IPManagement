"use client";

import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "../../auth/_components/form-error";
import { FormSuccess } from "../../auth/_components/form-success";

interface Props {
  creatorRole: Role;
}

const RegisterAgent = ({ creatorRole }: Props) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      password: "",
      simsId: "",
      name: "",
      surname: "",
      email: "",
      role: "AGENT",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(data, creatorRole).then((data) => {
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
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">+ Add Agent</Button>
        </SheetTrigger>

        <SheetContent>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <SheetHeader>
                  <SheetTitle>Register Agent</SheetTitle>
                  <SheetDescription>
                    Create an account for the agent. Enter the required data and
                    select a role.
                  </SheetDescription>
                </SheetHeader>
                <SheetDescription className="space-y-2 mt-4">
                  <div className="space-y-4">
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

                    <div className=" items-start justify-start flex flex-col gap-2 my-2">
                      <Label>Role</Label>
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger
                                className="flex items-center justify-between border border-muted p-2 w-full text-start rounded-md"
                                disabled={isPending}>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AGENT">AGENT</SelectItem>
                              <SelectItem value="USER_ADMIN">
                                USER ADMIN
                              </SelectItem>
                              <SelectItem value="GLOBAL_ADMIN">
                                GLOBAL ADMIN
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      <FormMessage />
                    </div>
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
                </SheetDescription>
                <div className="my-4 flex items-center justify-start ">
                  <Button disabled={isPending} variant="outline" type="submit">
                    Register
                  </Button>
                </div>
              </div>

              <FormError message={error} />
              <FormSuccess message={success} />
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RegisterAgent;
