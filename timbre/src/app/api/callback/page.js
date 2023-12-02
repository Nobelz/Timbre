"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../../hooks/useRefreshToken";

export default function Callback() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useRefreshToken(String(code));

  // TODO: Make this page look nicer
  return (
    <title>Logging you in...</title>
  );
}