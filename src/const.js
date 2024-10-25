import backgroundImage from './assets/denise-jans-Lq6rcifGjOU-unsplash.jpg';
import headerLogo from './assets/header-logo.svg';
import logo from './assets/logo.svg';
import logoReversed from './assets/logoReversed.svg';

export const VIDISPINE_URL = process.env.REACT_APP_VIDISPINE_URL || 'http://localhost:8080';
export const APP_TITLE = 'VDT Example';
export const APP_LOGO = logo;
export const APP_LOGO_WHITE = logoReversed;
export const HEADER_LOGO = headerLogo;
export const BACKGROUND_IMAGE = backgroundImage;

export const SETTINGS_LOCAL_STORAGE_KEY = 'APP_SETTINGS';

// PUBLIC_URL is retrieved from homepage in package.json
const getBasenameFromPublicUrl = () => {
  const publicUrlOrBaseName = process.env.PUBLIC_URL === '' ? undefined : process.env.PUBLIC_URL;
  if (publicUrlOrBaseName && publicUrlOrBaseName.startsWith('http')) {
    const url = new URL(publicUrlOrBaseName);
    return url.pathname.replace(/(.+?)\/+$/, '$1');
  }
  return publicUrlOrBaseName || '/';
};

export const BASENAME = getBasenameFromPublicUrl();
