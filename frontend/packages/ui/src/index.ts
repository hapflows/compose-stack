// Configuration
export { setConfig, getConfig } from './config';

// Components
export { Box } from './components/box/Box';
export { Button } from './components/button/Button';
export { Drawer } from './components/drawer/Drawer';
export { Icon } from './components/icon/Icon';
export { IconControl } from './components/icon/IconControl';
export { Loader } from './components/loader/Loader';
export { Spinner } from './components/spinner/Spinner';
export { Text } from './components/text/Text';
export { Title } from './components/text/Title';

export { Forms } from './components/forms';

// hooks
export { useHover } from './hooks/useHover';

// utils
export { cx } from './utils/classNames';
export { KEY_CODES } from './utils/constants';

/**
 * The following exports are redundant with Forms,
 * but allows for auto discovery and import directly
 * with editor's autocomplete.
 */

export { Checkbox } from './components/forms/checkbox/Checkbox';
export { Field, VField, HField } from './components/forms/field/Field';
export { Input } from './components/forms/input/Input';
export { Label } from './components/forms/label/Label';
export { ReactSelect as Select } from './components/forms/react-select/ReactSelect';
export { Textarea } from './components/forms/textarea/Textarea';
export { UIFormContext } from './components/forms/UIFormContext';

/**
 * Types
 */
export { ButtonProps } from './components/button/Button.types';
export { CheckboxProps } from './components/forms/checkbox/Checkbox.types';
export { DrawerProps } from './components/drawer/Drawer.types';
export { FieldProps } from './components/forms/field/Field.types';
export { FieldLayoutType } from './components/forms/constants.types';
export { InputProps } from './components/forms/input/Input.types';
export { TextareaProps } from './components/forms/textarea/Textarea.types';
export { UIFormContextProps } from './components/forms/UIFormContext';
export { IconProps } from './components/icon/Icon.types';
export { TitleProps } from './components/text/Title.types';
export { SpinnerProps } from './components/spinner/Spinner.types';
export {
  ReactSelectProps,
  ReactSelectOptionType,
} from './components/forms/react-select/ReactSelect.types';
