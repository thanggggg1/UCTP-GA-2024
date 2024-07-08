"use client";
import { PropsWithChildren, memo } from "react";
import ReduxProvider from "./ReduxProvider";
import { DashboardLayout } from "./DashboardLayout";
import { usePathname } from "next/navigation";

export const LayoutWrapper = memo(function LayoutWrapper(
  props: PropsWithChildren<{}>
) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") {
    return <ReduxProvider>{props.children}</ReduxProvider>;
  }

  return (
    <ReduxProvider>
      <div className="hidden flex-col md:flex">
        <DashboardLayout>{props.children}</DashboardLayout>
      </div>
    </ReduxProvider>
  );
});
