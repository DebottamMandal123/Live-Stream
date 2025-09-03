"use client"

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { LiveBadge } from "@/components/live-badge";
import { Skeleton } from "@/components/ui/skeleton";

interface UserItemProps {
    username: string;
    imageUrl: string;
    isLive?: boolean
}

export const UserItem = ({ username, imageUrl, isLive } : UserItemProps) => {
    const pathname = usePathname();
    const { collapsed } = useSidebar((state) => state);
    const href = `/${username}`;
    const isActive = pathname === href;

    return (
        <Button 
            asChild 
            variant={"ghost"}
            className={cn(
                "w-full h-12",
                collapsed ? "justify-center" : "justify-start",
                isActive  && "bg-accent",
            )}
        >
            <Link href={href}>
                <div className={cn(
                    "flex items-center w-full gap-x-4",
                    collapsed && "justify-center"
                )}>
                    <UserAvatar
                        username={username}
                        imageUrl={imageUrl}
                        isLive={isLive}
                    />
                    {!collapsed && (
                        <p className="truncate">
                            {username}
                        </p>
                    )}
                    {!collapsed && isLive && (
                        <LiveBadge className="ml-auto" />
                    )}
                </div>
            </Link>
        </Button>
    )
}

export const UserItemSkeleton = () => {
    return (
        <li className="flex items-center gap-x-4 px-3 py-2">
            <Skeleton className="min-h-[32px] min-w-[32px] rounded-full bg-[#1E2028]" />
            <div className="flex-1">
                <Skeleton className="h-6 bg-[#1E2028]" />
            </div>
        </li>
    )
}
