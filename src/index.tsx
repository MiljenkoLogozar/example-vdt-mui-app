import { Suspense } from 'react';

import { styled } from '@mui/material/styles';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import { ThemeProvider } from '@vidispine/vdt-mui';
import { SettingsProvider, useLocalStorage } from '@vidispine/vdt-react';

import App from './App';
import Login from './auth/Login';
import ServerListRoute from './auth/ServerListRoute';
import { APP_TITLE, SETTINGS_LOCAL_STORAGE_KEY, APP_LOGO } from './const';
import HeaderTitle from './header/HeaderTitle';
import useThemesWithLocale from './locale/useThemesWithLocale';
import themes from './themes';

import './dayjsConfigure';

document.title = APP_TITLE;

const StyledImg = styled('img')(() => ({
  maxWidth: '25vw',
}));

function LogoComponent() {
  return <StyledImg src={APP_LOGO} alt={APP_TITLE} />;
}

export default function Index() {
  const [initialSettings, setSettingsState] = useLocalStorage(SETTINGS_LOCAL_STORAGE_KEY, {});
  const [themesWithLocale, muiLocale] = useThemesWithLocale(themes);
  const { t } = useTranslation();

  return (
    <SettingsProvider
      onChange={setSettingsState}
      initialSettings={initialSettings}
      getSettingsApi={null}
      updateSettingsApi={null}
    >
      <ThemeProvider themes={themesWithLocale} muiLocale={muiLocale}>
        <ServerListRoute
          AppComponent={App}
          LoginComponent={Login}
          LogoComponent={LogoComponent}
          AppTitleComponent={HeaderTitle}
          LoginProps={{
            backText: t('Back To Server List'),
          }}
        />
      </ThemeProvider>
    </SettingsProvider>
  );
}

ReactDOM.render(
  <Suspense fallback={null}>
    <Index />
  </Suspense>,
  document.querySelector('#root'),
);
