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
import { ModifySchema } from "@/lib/schemas/ModifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsIcon } from "lucide-react";
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
  id: string;
}

const TempModify = ({
  name,
  surname,
  simsId,
  email,
  role,
  agent,
  id,
}: Props) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ModifySchema>>({
    resolver: zodResolver(ModifySchema),
    defaultValues: {
      simsId: simsId,
      name: name,
      surname: surname,
      email: email,
      role: role,
    },
  });

  const onSubmit = (data: z.infer<typeof ModifySchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      modifyAgent(data, agent, id).then((data) => {
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
            title: "Success!",
            description: `Agent modified successfully 😎`,
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
          <Button variant="outline" size={"icon"}>
            <SettingsIcon size={20} />
          </Button>
        </SheetTrigger>

        <SheetContent>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <SheetHeader>
                  <SheetTitle>Modify Profile</SheetTitle>
                  <SheetDescription>
                    Make changes to the Agent profil. Click <b>Save Changes</b>{" "}
                    to update profile details.
                  </SheetDescription>
                </SheetHeader>
                <SheetDescription className="space-y-2 mt-8">
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
                                placeholder={name}
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
                                placeholder={surname}
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
                              placeholder={simsId}
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
                              placeholder={email}
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className=" items-start justify-start flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger
                                className="flex items-center justify-between border border-muted p-2 w-full text-start rounded-md"
                                disabled={isPending}>
                                <SelectValue
                                  placeholder={
                                    role === "USER_ADMIN"
                                      ? "USER ADMIN"
                                      : role === "GLOBAL_ADMIN"
                                      ? "GLOBAL ADMIN"
                                      : role
                                  }
                                />
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
                </SheetDescription>
                <div className="my-4 flex items-center justify-start ">
                  <Button
                    disabled={isPending}
                    variant="outline"
                    type="submit"
                    className="flex gap-2">
                    Save Changes
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

export default TempModify;
