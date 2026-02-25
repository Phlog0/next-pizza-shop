import { FormProvider, useForm } from "react-hook-form";
import { formLoginSchema, InferedFormLoginSchema } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "@/shared/components/shared";
import { FormInput } from "@/shared/components/shared/forms";
import { Button } from "@/shared/components/ui";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

type LoginFormProps = {
  onClose: VoidFunction;
};
export function LoginForm({ onClose }: LoginFormProps) {
  const form = useForm<InferedFormLoginSchema>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: InferedFormLoginSchema) => {
    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (!response?.ok) {
        throw new Error("Ошибка авторизации");
      }

      toast.success("Вы успешно вошли в аккаунт");
      onClose();
    } catch (error) {
      console.error("Error [LOGIN]", error);
      toast.error(
        error instanceof Error ? error.message : "Ошибка авторизации",
      );
    }
  };
  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <Title text="Вход в аккаунт" size="md" className="font-bold" />
            <p className="text-gray-400">
              Введите своб почту, чтобы войти в аккаунт
            </p>
          </div>
        </div>
        <FormInput label="E-mail" name="email" required />
        <FormInput label="Пароль" name="password" required type="password" />
        <Button
          type="submit"
          className="text-base"
          variant={form.formState.isSubmitting ? "loading" : "default"}
        >
          {form.formState.isSubmitting ? "Вход..." : "Войти"}
        </Button>
      </form>
    </FormProvider>
  );
}
