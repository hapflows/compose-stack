import { cx } from "@/core/classNames/cx";
import { Link } from "@/components/link/Link";

import styles from "./main-nav.module.scss";

export function MainNav() {
  return (
    <nav className={styles["main-nav"]}>
      <div
        className={cx(styles["main-nav__item"], styles["main-nav__item--left"])}
      >
        <Link href="/">Home</Link>
      </div>
      <div
        className={cx(
          styles["main-nav__item"],
          styles["main-nav__item--right"]
        )}
      >
        <Link href="https://nextjs.org/">NextJS</Link> Example
      </div>
    </nav>
  );
}
