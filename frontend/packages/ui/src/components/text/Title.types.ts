import { TagType } from '../../utils/sharedTypes';

export interface TitleProps
  extends React.PropsWithChildren<React.ComponentPropsWithoutRef<React.ElementType>> {
  className?: string;
  /** Use a different tag than div. */
  tag?: TagType;
  underline?: boolean;
  /** If set, wraps the children with an 'a' tag and assign this value as ID. */
  anchor?: string;
  /** Makes the title sticky when scrolling */
  isSticky?: boolean;
  anchorClassName?: string;
}
