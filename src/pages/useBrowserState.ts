import React from 'react';

import { useUpdateEffect } from '@vidispine/vdt-react';

type BrowserStateOptions = { key: string; storage?: string };

export const useBrowserState = <T = any>(
  defaultValue: T,
  { key, storage = 'session' }: BrowserStateOptions,
) => {
  if (!key) throw new Error('Missing "key"');

  const browserStorage = storage === 'local' ? window.localStorage : window.sessionStorage;
  const [state, setState] = React.useState<T>(
    JSON.parse(browserStorage.getItem(key) || JSON.stringify(defaultValue)),
  );

  useUpdateEffect(() => {
    const jsonState = JSON.stringify(state);
    if (jsonState !== browserStorage.getItem(key)) {
      browserStorage.setItem(key, jsonState);
    }
  }, [state, browserStorage, key]);

  return [state, setState];
};
