"use client";

import { UserButton } from "@clerk/nextjs";

export function UserButtonComponent() {
  return <UserButton afterSignOutUrl="/" />;
}
