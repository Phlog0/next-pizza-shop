import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/shared/components/shared/forms";
import { redirect } from "next/navigation";

export default async function DefaultPage() {
  const session = await getUserSession();
  if (!session) {
    return redirect("/not-auth");
  }

  const user = await prisma.user.findFirst({
    where: { id: Number(session.id) },
  });
  if (!user) {
    return redirect("/not-auth");
  }

  return <ProfileForm data={user} />;
}
