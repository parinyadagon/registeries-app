import { useTitle } from "@/hooks";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  useTitle("Dashboard");

  return (
    <>
      <h1>Dashboard</h1>
      {router.query.page}
    </>
  );
}
