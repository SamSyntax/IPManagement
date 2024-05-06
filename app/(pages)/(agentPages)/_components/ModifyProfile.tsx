"use client";

import { modifyAgent } from "@/actions/register";
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
import { toast } from "@/components/ui/use-toast";
import { ModifySchema } from "@/lib/schemas/ModifySchema";
import { useGlobalState } from "@/providers/global-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "../../auth/_components/form-error";
import { FormSuccess } from "../../auth/_components/form-success";

interface Props {
  name: string;
  surname: string;
  simsId: string;
  email: string;
  role: "AGENT" | "USER_ADMIN" | "GLOBAL_ADMIN";
  agent: any;
}

const ModifyProfile = ({
  name,
  surname,
  simsId,
  email,
  role,
  agent,
}: Props) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { setIsFetched } = useGlobalState();

  const form = useForm<z.infer<typeof ModifySchema>>({
    resolver: zodResolver(ModifySchema),
    defaultValues: {
      simsId: simsId,
      surname: surname,
      name: name,
      email: email,
      role: role,
    },
  });

  const onSubmit = (data: z.infer<typeof ModifySchema>) => {
    setError("");
    setSuccess("");
    setIsFetched(false);

    startTransition(() => {
      modifyAgent(data, agent).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        setIsFetched(true);

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
    console.log(data);
  };

  return (
    <div className="w-full h-full text-muted-foreground">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-start w-full h-full ">
          <div className="space-y-1 w-full ">
            <div className="grid grid-cols-2 grid-rows-1 gap-4   ">
              <div className="w-full h-full gap-4  col-span-full flex ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Label htmlFor="name">Name</Label>
                      <FormControl>
                        <Input id="name" placeholder={name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Label htmlFor="surname">Surname</Label>
                      <FormControl>
                        <Input id="surname" placeholder={surname} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Label htmlFor="email">Email Address</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder={email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="simsId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Label htmlFor="simsId">SIMSID</Label>
                    <FormControl>
                      <Input id="simsId" placeholder={simsId} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-col items-start justify-center gap-2 border p-4 rounded-md">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-wrap gap-4 w-full items-center justify-between text-xs">
                    <label className="flex gap-1">
                      <input
                        type="radio"
                        value="AGENT"
                        {...form.register("role")}
                      />
                      AGENT
                    </label>
                    <label className="flex gap-1">
                      <input
                        type="radio"
                        value="USER_ADMIN"
                        {...form.register("role")}
                      />
                      USER_ADMIN
                    </label>
                    <label className="flex gap-1">
                      <input
                        type="radio"
                        value="GLOBAL_ADMIN"
                        {...form.register("role")}
                      />
                      GLOBAL_ADMIN
                    </label>
                    <FormMessage />
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center justify-start gap-4">
                <Button disabled={isPending} type="submit" variant="outline">
                  Save changes
                </Button>
                <div className="flex items-center justify-center w-full ">
                  <FormError message={error} />
                  <FormSuccess message={success} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ModifyProfile;
