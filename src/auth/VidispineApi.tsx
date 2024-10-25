import { cloneElement, Children, FunctionComponent, useLayoutEffect } from 'react';

import { getAxiosInstance } from '@vidispine/api';

export type VidispineApiProps = {
  serverUrl?: string;
  runAs?: string;
  [key: string]: any;
};

const VidispineApi: FunctionComponent<VidispineApiProps> = ({
  serverUrl,
  token,
  username,
  password,
  runAs,
  children,
  ...otherProps
}: VidispineApiProps) => {
  const axiosClient = getAxiosInstance();
  useLayoutEffect(() => {
    if (serverUrl) {
      axiosClient.defaults.baseURL = serverUrl;
    } else {
      delete axiosClient.defaults.baseURL;
    }
    if (token) {
      axiosClient.defaults.headers.Authorization = `token ${token}`;
    } else {
      delete axiosClient.defaults.headers.Authorization;
    }
    if (username && password) {
      axiosClient.defaults.auth = { username, password };
    } else {
      delete axiosClient.defaults.auth;
    }
    if (runAs) {
      axiosClient.defaults.headers.RunAs = runAs;
    } else {
      delete axiosClient.defaults.headers.RunAs;
    }
  }, [axiosClient, serverUrl, token, username, password, runAs]);

  return Children.map(children, (child) =>
    cloneElement(child, { serverUrl, username, ...otherProps }),
  );
};

export default VidispineApi;
