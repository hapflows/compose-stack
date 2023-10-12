import { createContext } from 'react';

import { LAYOUTS } from './constants';
import { FieldLayoutType } from './constants.types';

export interface UIFormContextProps {
  layout?: FieldLayoutType;
  labelWidth?: string | number;
}

export const UIFormContext = createContext<UIFormContextProps>({
  layout: LAYOUTS.DEFAULT,
});
