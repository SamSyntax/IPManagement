import { getUserById } from '@/actions/data/user'
import { auth } from "@/auth";
import React from 'react'

interface Props {
  params: {
    id: string
  }
}
// 
const page = async ({ params }: Props) => {
  const session = await auth();
  const user = await getUserById(params.id.toString());

  console.log(user);
  return (
    <div className="text-white text-2xl">
      <p>Query params: {params.id}</p>
      <p>User ID: {user?.id}</p>
      <p>Name: {user?.name}</p>
      <p>Surname: {user?.surname}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default page;