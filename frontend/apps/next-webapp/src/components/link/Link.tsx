import NextLink from "next/link";

import { cx } from "@/core/classNames/cx";

import { LinkProps } from "./Link.types";
import styles from "./link.module.scss";

export function Link({ className, children, ...rest }: LinkProps) {
  return (
    <NextLink className={cx(styles["link"], className)} {...rest}>
      {children}
    </NextLink>
  );
}
