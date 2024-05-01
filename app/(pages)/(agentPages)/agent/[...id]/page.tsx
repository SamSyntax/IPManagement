import { getUserById } from "@/actions/data/user";
import { formDate } from "@/lib/utils";
import Profile from "../../_components/Profile";

interface Props {
  params: {
    id: string;
  };
}
const page = async ({ params }: Props) => {
  const user = await getUserById(params.id.toString());

  return (
    <Profile
      createdAt={formDate(user?.createdAt!)}
      email={user?.email!}
      name={user?.name!}
      role={user?.role!}
      simsId={user?.simsId!}
      surname={user?.surname!}
      id={user?.id!}
    />

  );
};

export default page;
