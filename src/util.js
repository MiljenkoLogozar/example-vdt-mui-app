// PUBLIC_URL is retrieved from homepage in package.json
export const getBasenameFromPublicUrl = () => {
  const publicUrlOrBaseName = process.env.PUBLIC_URL === '' ? undefined : process.env.PUBLIC_URL;
  if (publicUrlOrBaseName && publicUrlOrBaseName.startsWith('http')) {
    const url = new URL(publicUrlOrBaseName);
    return url.pathname.replace(/(.+?)\/+$/, '$1');
  }
  return publicUrlOrBaseName || '/';
};
