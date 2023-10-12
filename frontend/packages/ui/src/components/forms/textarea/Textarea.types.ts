export interface TextareaProps extends React.ComponentPropsWithRef<React.ElementType> {
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  maxLength?: number;
  showLength?: boolean;
}
