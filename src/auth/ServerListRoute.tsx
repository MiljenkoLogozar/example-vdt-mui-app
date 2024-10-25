/* eslint-disable react/jsx-props-no-spreading */
import { Component } from 'react';

import Grid from '@mui/material/Grid';
import { styled, TypeBackground } from '@mui/material/styles';
import { pathToRegexp } from 'path-to-regexp';
import { withCookies } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';

import { User as UserApi, Selftest as SelftestApi } from '@vidispine/api';

import { BACKGROUND_IMAGE } from '../const';
import { getBasenameFromPublicUrl } from '../util';

import ServerList from './ServerList';
import ValidTokenGate from './ValidTokenGate';
import VidispineApi from './VidispineApi';

const VIDISPINE_SERVERS = 'VIDISPINE-SERVERS';
const VIDISPINE_TOKEN = 'VIDISPINE-TOKEN';

const decodeJsonCookie = (encodedJsonCookie) => {
  if (!encodedJsonCookie) return undefined;
  const stringJsonCookie = atob(encodedJsonCookie);
  const parsedJsonCookie = JSON.parse(stringJsonCookie);
  return parsedJsonCookie;
};

const encodeJsonCookie = (decodedJsonCookie) => {
  if (!decodedJsonCookie) return undefined;
  const stringJsonCookie = JSON.stringify(decodedJsonCookie);
  const encodedJsonCookie = btoa(stringJsonCookie);
  return encodedJsonCookie;
};

const getApiServerFromPathname = (pathname) => {
  // match on '//vdt-react-videolibrary/server/https%3A%2F%2Ftest.myvidispine.com/item/'
  let match = pathToRegexp('/:basename/server/:serverUrl/:any*').exec(pathname);
  // match on '//vdt-react-videolibrary/server/https%3A%2F%2Ftest.myvidispine.com'
  if (!match)
    match = pathToRegexp('/:basename/server/:serverUrl', [], { strict: true }).exec(pathname);
  // match on '/server/https%3A%2F%2Ftest.myvidispine.com'
  if (!match) match = pathToRegexp('/server/:serverUrl/:any*').exec(pathname);
  if (!match) return undefined;
  try {
    const uriEncodedServerUrl = match[2];
    const serverUrl = decodeURIComponent(uriEncodedServerUrl);
    return serverUrl;
  } catch (e) {
    if (e instanceof URIError) return undefined;
    throw e;
  }
};

const redirectUnencodedPathname = (pathname) => {
  const match = pathToRegexp('/:basename/server/(.*)', [], { strict: true }).exec(pathname);
  if (match && match[2]) {
    try {
      // will throw if not a valid url
      const wildcardUrl = new URL(match[2]);
      // only match the origin as cannot know if path is part of the server or app
      const { origin } = wildcardUrl;
      if (!origin) return;
      const serverUrl = encodeURIComponent(origin);
      const newPathname = pathname.replace(origin, serverUrl);
      window.history.pushState({}, document.title, newPathname);
      window.location.reload();
    } catch (error) {
      // don't redirect when catching
    }
  }
};

const getPath = (basename, serverUrl) =>
  `${basename.replace(/\/+$/, '')}/server/${serverUrl ? `${encodeURIComponent(serverUrl)}/` : ''}`;

const BackdropContainer = styled(Grid)(({ theme }) => {
  const themeBackground: TypeBackground & { gradient1: string; gradient2: string } = theme.palette
    .background as any;
  return {
    background: `${themeBackground.gradient1}, ${themeBackground.gradient2}, url(${BACKGROUND_IMAGE})`,
  };
});

type ServerListRouteProps = {
  cookies?: any;
  AppComponent?: any;
  AppProps?: any;
  LoginComponent?: any;
  LoginProps?: any;
  LogoComponent?: any;
  AppTitleComponent?: any;
};

type ServerListRouteServer = { serverUrl?: string; username?: string; hasToken?: boolean };

type ServerListRouteState = {
  apiServer?: ServerListRouteServer;
  servers?: ServerListRouteServer[];
  token?: string;
  basename?: string;
  cookieOptions?: {
    maxAge: number;
    path: string;
    sameSite: string;
  };
};

class ServerListRoute extends Component<ServerListRouteProps, ServerListRouteState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    cookies: undefined,
    AppComponent: undefined,
    LoginComponent: undefined,
    LogoComponent: undefined,
    AppTitleComponent: undefined,
    AppProps: {},
    LoginProps: {},
  };

  constructor(props) {
    super(props);
    this.onChangeServer = this.onChangeServer.bind(this);
    this.onAddServer = this.onAddServer.bind(this);
    this.onRemoveServer = this.onRemoveServer.bind(this);
    this.onUpdateCookie = this.onUpdateCookie.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    const { cookies } = props;
    const serversCookie = cookies.get(VIDISPINE_SERVERS);
    const token = cookies.get(VIDISPINE_TOKEN);
    const servers = decodeJsonCookie(serversCookie);
    const { pathname } = window.location;
    const serverUrl = getApiServerFromPathname(pathname);
    const basename = getBasenameFromPublicUrl();

    this.state = {
      servers,
      token,
      basename,
      cookieOptions: {
        maxAge: 604800,
        path: basename,
        sameSite: 'strict',
      },
    };
    if (serverUrl) {
      const apiServer = servers?.find((s) => s.serverUrl === serverUrl);
      if (apiServer) {
        // @ts-expect-error
        this.state.apiServer = apiServer;
      } else {
        // @ts-expect-error
        this.state.apiServer = { serverUrl };
        // @ts-expect-error
        this.state.token = undefined;
      }
    } else {
      redirectUnencodedPathname(pathname);
    }
  }

  onChangeServer(newServerUrl) {
    const { basename } = this.state;
    const newPath = newServerUrl ? getPath(basename, newServerUrl) : basename;

    window.history.pushState({}, document.title, newPath);
    const { servers = [] } = this.state;
    const apiServer = servers.find((s) => s.serverUrl === newServerUrl);
    if (apiServer?.hasToken) {
      window.location.reload();
    } else {
      this.setState({ apiServer });
    }
  }

  onAddServer(newServerUrl) {
    const serverUrl = newServerUrl.replace(/^(.+?)\/*?$/, '$1');
    const { servers: prevServersList = [] } = this.state;
    const servers = [{ serverUrl }, ...prevServersList];
    this.setState({ servers });
    this.onUpdateCookie(servers);
  }

  onRemoveServer(serverUrl) {
    const { servers: prevServersList = [] } = this.state;
    const servers = prevServersList.filter((s) => s.serverUrl !== serverUrl);
    this.setState({ servers });
    this.onUpdateCookie(servers);
  }

  onUpdateCookie(servers) {
    const { cookies } = this.props;
    const { cookieOptions } = this.state;
    const serversCookie = encodeJsonCookie(servers);
    cookies.set(VIDISPINE_SERVERS, serversCookie, cookieOptions);
  }

  onLogin({ values, onError = () => null }: { values: any; onError: (error: string) => void }) {
    const { cookieOptions, basename } = this.state;
    const { username, password, serverUrl } = values || {};
    if (!username || !password || !serverUrl) {
      onError('Invalid credentials');
      return;
    }
    UserApi.getUserToken({
      pathParams: {
        username,
      },
      queryParams: { seconds: 2592000, autoRefresh: true },
      headers: { password, username },
      requestConfig: {
        baseURL: serverUrl,
      },
    })
      .then(({ data: token }) => {
        const { cookies } = this.props;
        const apiServer = { serverUrl, username, hasToken: true };
        cookies.set(VIDISPINE_TOKEN, token, {
          ...cookieOptions,
          path: `${basename.replace(/\/+$/, '')}/server/${encodeURIComponent(serverUrl)}`,
        });
        const { servers: prevServersList = [] } = this.state;
        const servers = [...prevServersList];
        const serverIdx = servers.findIndex((s) => s.serverUrl === serverUrl);
        if (serverIdx > -1) {
          const prevServer = servers[serverIdx];
          servers[serverIdx] = { ...prevServer, ...apiServer };
        } else {
          servers.push(apiServer);
        }
        this.onUpdateCookie(servers);
        this.setState({ token, servers, apiServer });
      })
      .catch(() => {
        SelftestApi.getSelftestNoAuth({
          requestConfig: {
            baseURL: serverUrl,
          },
        })
          .then(() => onError('Incorrect Username/Password'))
          .catch(() => onError('Offline or CORS not configured'));
      });
  }

  onLogout() {
    const { cookies } = this.props;
    const { cookieOptions, basename } = this.state;
    const { apiServer: { serverUrl } = {}, servers: prevServersList = [] } = this.state;
    cookies.remove(VIDISPINE_TOKEN, {
      ...cookieOptions,
      path: getPath(basename, serverUrl),
    });
    this.setState({ token: undefined });
    const servers = [...prevServersList];
    const serverIdx = servers.findIndex((s) => s.serverUrl === serverUrl);
    if (serverIdx > -1) {
      const prevServer = servers[serverIdx];
      servers[serverIdx] = { ...prevServer, hasToken: false };
      this.setState({ servers });
      this.onUpdateCookie(servers);
    }
    this.onUpdateCookie(servers);
  }

  render() {
    const { apiServer = {}, servers = [], token, basename } = this.state;
    const { username, serverUrl } = apiServer;
    const serverList = servers.map((server) => server.serverUrl);
    const {
      AppComponent,
      AppProps = {},
      LoginComponent,
      LoginProps = {},
      LogoComponent,
      AppTitleComponent,
    } = this.props;

    return serverUrl && token ? (
      <BrowserRouter basename={getPath(basename, serverUrl)}>
        <VidispineApi token={token} username={username} serverUrl={serverUrl}>
          <ValidTokenGate onInvalidToken={this.onLogout}>
            <AppComponent
              AppTitleComponent={AppTitleComponent}
              onLogout={this.onLogout}
              onLogin={this.onLogin}
              {...AppProps}
            />
          </ValidTokenGate>
        </VidispineApi>
      </BrowserRouter>
    ) : (
      <div>
        <Grid container direction="row">
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={5}
            xl={4}
            px={4}
            sx={{
              maxHeight: '100vh',
              overflow: 'auto',
            }}
          >
            {!serverUrl ? (
              <ServerList
                AppTitleComponent={AppTitleComponent}
                onClickServer={this.onChangeServer}
                onAddServer={this.onAddServer}
                onRemoveServer={this.onRemoveServer}
                serverList={serverList}
              />
            ) : (
              <LoginComponent
                AppTitleComponent={AppTitleComponent}
                username={username}
                serverUrl={serverUrl}
                onBack={this.onChangeServer}
                onLogin={this.onLogin}
                {...LoginProps}
              />
            )}
          </Grid>
          <BackdropContainer item container xs sm direction="column" height="100vh">
            <Grid item container sm justifyContent="center">
              <LogoComponent />
            </Grid>
          </BackdropContainer>
        </Grid>
      </div>
    );
  }
}

const ServerListRouteWithCookies = withCookies(ServerListRoute);

export default ServerListRouteWithCookies;
