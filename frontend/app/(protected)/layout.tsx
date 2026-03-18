/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/profile/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (res.status === 401 || res.status === 403) {
          router.replace("/authentication/login");
        } else {
          setLoading(false);
        }
      } catch (error) {
        router.replace("/authentication/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
