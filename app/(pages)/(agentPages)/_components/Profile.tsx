import { Role } from "@prisma/client";

interface Props {
  name: string;
  surname: string;
  simsId: string;
  createdAt: string;
  role: Role;
  id?: string;
  email: string;
}
//
const Profile = ({
  name,
  surname,
  simsId,
  createdAt,
  role,
  id,
  email,
}: Props) => {
  return <div>Profile</div>;
};

export default Profile;
