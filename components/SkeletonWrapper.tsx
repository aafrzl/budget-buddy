import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  isLoading: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function SkeletonWrapper({
  isLoading,
  fullWidth = true,
  children,
}: Props) {
  if (!isLoading) return children;

  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
