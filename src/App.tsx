import { lazy, useEffect } from 'react';

import { styled } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useThemeContext } from '@vidispine/vdt-mui';
import { useSettings } from '@vidispine/vdt-react';

import Header from './header/Header';
import i18n from './locale/i18n';
import {
  Collection,
  Collections,
  Items,
  Upload,
  Settings,
  NotFound,
  Demo,
  Timespans,
} from './pages';

const Item = lazy(() => import('./pages/Item'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const Wrapper = styled('div')(() => ({
  height: '100vh',
  display: 'grid',
  gridTemplateRows: 'min-content 1fr',
}));

export default function App({ username, serverUrl, onLogout }) {
  const {
    settings: { language, theme },
    updateUsername,
  }: {
    settings: {
      language: string;
      theme: any;
    };
    updateUsername: Function;
  } = useSettings();

  const { updatePalette, palette } = useThemeContext();

  useEffect(() => {
    updateUsername(username);
  }, [updateUsername, username]);

  useEffect(() => {
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (theme && theme !== palette) {
      updatePalette(theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
  return (
    <Wrapper>
      <QueryClientProvider client={queryClient}>
        <Header username={username} serverUrl={serverUrl} onLogout={onLogout} />
        <Routes>
          <Route path="/">
            <Route path="collection" element={<Collections />} />
            <Route path="collection/:collectionId" element={<Collection />} />
            <Route path="item" element={<Items />} />
            <Route path="item/:itemId" element={<Item />} />
            <Route path="timespans" element={<Timespans serverUrl={serverUrl} />} />
            <Route path="upload" element={<Upload />} />
            <Route path="settings" element={<Settings />} />
            <Route path="demo/:itemId" element={<Demo />} />
            <Route path="" element={<Navigate replace to="/item" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </Wrapper>
  );
}
