import { useEffect } from 'react';

import dayjs from 'dayjs';

export const useDayjsLocale = (locale: string) => {
  useEffect(() => {
    if (locale) dayjs.locale(locale);
  }, [locale]);
};
