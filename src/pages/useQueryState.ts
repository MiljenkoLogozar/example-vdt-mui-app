import { useRef, useState, useCallback, SetStateAction } from 'react';

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import { useUpdateEffect } from '@vidispine/vdt-react';

import debounce from '../utils/debounce';

type QueryStateOptions = {
  navigate: (
    path: string,
    options?: { replace?: boolean; [key: string | number | symbol]: any },
  ) => void;
  location: { search: string; pathname: string };
  key?: string;
  debounceDelay?: number;
};

export const useQueryState = <T = any>(
  defaultState: T,
  { navigate, location, key = 'q', debounceDelay = 500 }: QueryStateOptions,
) => {
  if (!navigate) throw new Error('Missing "navigate"');
  if (!location) throw new Error('Missing "location"');
  if (!key) throw new Error('Missing "key"');
  const isQueryStateUpdated = useRef(false);

  const getQueryState: () => T | undefined = () => {
    const searchParams = new URLSearchParams(location.search);
    const encodedQuery = searchParams.get(key);
    if (!encodedQuery) return null;
    try {
      const decodedQuery = decompressFromEncodedURIComponent(encodedQuery);
      return JSON.parse(decodedQuery);
    } catch (error) {
      searchParams.delete(key);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
    return undefined;
  };

  const [state, setState] = useState<T>(getQueryState() || defaultState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateQueryState = useCallback(
    debounce((newState: T) => {
      const jsonState = JSON.stringify(newState);
      const searchParams = new URLSearchParams(location.search);
      const prevEncodedQuery = searchParams.get(key);
      const encodedQuery = compressToEncodedURIComponent(jsonState);
      if (prevEncodedQuery !== encodedQuery) {
        searchParams.set(key, encodedQuery);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
        isQueryStateUpdated.current = true;
      }
    }, debounceDelay),
    [location, key, navigate],
  );

  const setQueryState = (queryState: SetStateAction<T>) => {
    setState(queryState);
    isQueryStateUpdated.current = false;
  };

  // UpdateEffect since we don't want to replace query on mount
  useUpdateEffect(() => {
    if (!isQueryStateUpdated.current) {
      updateQueryState(state);
    }
  }, [state, location, key, navigate]);

  return [state, setQueryState] as [T, (queryState: SetStateAction<T>) => void];
};
