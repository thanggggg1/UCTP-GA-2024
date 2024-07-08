"use client";

import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  GroupIcon,
  Inbox,
  LucideArchiveRestore,
  MessagesSquare,
  Send,
  ShoppingCart,
  Subtitles,
  Trash2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { AccountSwitcher } from "@/components/account-switcher";
import { PropsWithChildren, ReactElement } from "react";
import { Nav } from "@/components/nav";
import { MenuHeader } from "./MenuHeader";

export function SiderLayout({
  defaultLayout = [255, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
} & PropsWithChildren): ReactElement {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          {/* <div
            className="flex items-center px-4"
            style={{
              paddingTop: "6px",
              paddingBottom: "6px",
            }}
          >
            <MenuHeader />
          </div> */}
          <Separator />

          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Timetable",
                label: "",
                icon: Archive,
                href: "/timetable",
              },
              {
                title: "Professors",
                label: "240",
                icon: Inbox,
                href: "/professors",
              },
              {
                title: "Rooms",
                label: "64",
                icon: File,
                href: "/rooms",
              },
              {
                title: "Courses",
                label: "20",
                icon: LucideArchiveRestore,
                href: "/courses",
              },
              {
                title: "Students Group",
                label: "4",
                icon: GroupIcon,
                href: "/students",
              },
              {
                title: "Classes",
                label: "20",
                icon: Subtitles,
                href: "/course-classes",
              },
              // {
              //   title: "Trash",
              //   label: "",
              //   icon: Trash2,
              //   variant: "ghost",
              // },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Settings",
                label: "972",
                icon: Users2,
                href: "/settings",
              },
              {
                title: "Setups",
                label: "342",
                icon: AlertCircle,
                href: "/setups",
              },
              {
                title: "Help",
                label: "128",
                icon: MessagesSquare,
                href: "/help",
              },
              // {
              //   title: "Shopping",
              //   label: "8",
              //   icon: ShoppingCart,
              //   variant: "ghost",
              // },
              // {
              //   title: "Promotions",
              //   label: "21",
              //   icon: Archive,
              //   variant: "ghost",
              // },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="bg-white min-h-screen h-max p-5">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
const accounts = [
  {
    label: "HUST-Hanoi University of Science and Technology",
    email: "thang.lq194838@sis.hust.edu.vn",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Vercel</title>
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "VietNam National University",
    email: "VNU@sis.hust.edu.vn",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Gmail</title>
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];
