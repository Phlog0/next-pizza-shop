"use client";
import { FormProvider, useForm } from "react-hook-form";
import {
  formRegisterSchema,
  InferedFormRegisterSchema,
} from "../modals/auth-modal/forms/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/generated/prisma/client";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Container } from "../container";
import { Title } from "../title";
import { FormInput } from "./form-input";
import { Button } from "../../ui";
import { updateUserInfo } from "@/app/actions";

export function ProfileForm({ data }: { data: User }) {
  const form = useForm<InferedFormRegisterSchema>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: data.email,
      password: "",
      confirmPassword: "",
      fullName: data.fullName,
    },
  });
  const onSubmit = async (values: InferedFormRegisterSchema) => {
    try {
      await updateUserInfo({
        email: values.email,
        fullName: values.fullName,
        password: values.password || undefined,
      });
      toast.success("Данные обновлены!");
    } catch (error) {
      toast.error("Ошибка при обновлении данных");

      console.error(error);
    }
  };

  const onClickSignOut = () => {
    signOut({
      callbackUrl: "/",
    });
  };
  return (
    <Container className="mt-10">
      <Title text="Ваши личные данные" size="md" className="font-bold" />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput required name="email" label="E-Mail" />
          <FormInput required name="fullname" label="Полное имя" />
          <FormInput required name="password" label="Пароль" />
          <FormInput required name="confirmPassword" label="Повторите пароль" />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Сохранить
          </Button>
          <Button
            variant={"secondary"}
            disabled={form.formState.isSubmitting}
            className="text-base"
            type="button"
            onClick={onClickSignOut}
          >
            Выйти
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
}
