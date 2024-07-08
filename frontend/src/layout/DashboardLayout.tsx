"use client";

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { MainNav } from "@/components/main-nav";
import { Search } from "@/components/search";
import TeamSwitcher from "@/components/team-switcher";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserNav } from "@/components/user-nav";
import * as React from "react";

import { PropsWithChildren, ReactElement } from "react";

export function DashboardLayout(props: PropsWithChildren): ReactElement {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <TooltipProvider>
          <div className="flex-1">{props.children}</div>
        </TooltipProvider>
      </div>
    </>
  );
}
