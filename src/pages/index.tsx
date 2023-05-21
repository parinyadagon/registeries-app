import { Inter } from "next/font/google";

import { useTitle } from "@/hooks";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useTitle("Home");

  return (
    <>
      <div>HOME</div>
    </>
  );
}
