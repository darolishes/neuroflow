import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}

export function FooterLink({
  href,
  children,
  external,
  className,
}: FooterLinkProps) {
  const baseClasses = "text-sm text-muted-foreground hover:text-foreground";
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={href} className={cn(baseClasses, className)} {...linkProps}>
      {children}
    </Link>
  );
}
