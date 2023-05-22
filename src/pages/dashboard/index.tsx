import { useTitle } from "@/hooks";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useTitle("Dashboard");

  if (status === "unauthenticated") {
    return <>Access Denied</>;
  }

  return (
    <>
      <h1>Dashboard</h1>
      {router.query.page}
    </>
  );
}
