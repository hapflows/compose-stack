import { LinkProps as NextLinkProps } from "next/link";

export interface LinkProps extends NextLinkProps {
  children?: React.ReactNode;
  className?: string;
}
