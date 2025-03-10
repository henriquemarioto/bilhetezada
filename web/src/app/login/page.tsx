"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <article className="w-lvw h-lvh flex items-center justify-center bg-foreground">
      <div className="flex flex-col gap-6 text-secondary border-2 border-primary p-6 rounded-2xl">
        <p className="text-2xl font-bold">Bilhetezada</p>
        <section>
          <h1 className="text-xl">Login</h1>
          <h2>Gerencie seus eventos com Bilhetezada</h2>
        </section>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email@email.com" required {...field} />
                  </FormControl>
                  <FormDescription>
                    Digite seu melhor email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary">Entrar</Button>
          </form>
        </Form>
        <section>
        </section>
      </div>
    </article>
  );
}
