"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export function ButtonWrapper({ children, ...props }: ButtonProps) {
  return (
    <Button {...props} suppressHydrationWarning>
      {children}
    </Button>
  );
}
