import { Theme } from '@mui/material';
import * as muiLocales from '@mui/material/locale';
import _merge from 'lodash.merge';
import { useTranslation } from 'react-i18next';

import i18n from './i18n';
import { useDayjsLocale } from './useDayjsLocale';

const muiLocaleKeyMap = {
  en: 'enUS',
  sv: 'svSE',
  de: 'deDE',
};

export default function useThemesWithLocale(themes: { light: Theme; dark: Theme }) {
  const { t } = useTranslation();
  const { language } = i18n;
  useDayjsLocale(language);

  const localeComponents = {
    VdtItemList: {
      defaultProps: {
        emptySlot: () => `${t('No items found')}...`,
      },
    },
    VdtCollectionList: {
      defaultProps: {
        emptySlot: () => `${t('No collections found')}...`,
      },
    },
    VdtEntityList: {
      defaultProps: {
        emptySlot: () => `${t('No entities found')}...`,
      },
    },
    VdtForm: {
      defaultProps: {
        clearText: t('Clear'),
        resetText: t('Reset'),
        submitText: t('Submit'),
      },
    },
    VdtCalendarPicker: {
      defaultProps: {
        clearText: t('Clear'),
      },
    },
  };

  const themesWithVdtLocale = Object.entries(themes)
    .map(([key, theme]) => ({
      [key]: {
        ...theme,
        components: _merge(theme.components || {}, localeComponents),
      },
    }))
    .reduce((curr, obj) => ({ ...curr, ...obj }), {});

  return [themesWithVdtLocale, muiLocales[muiLocaleKeyMap[language]]];
}
