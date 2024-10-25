import { Children, cloneElement, useEffect, useState } from 'react';

import { Whoami as WhoamiApi, Debug as DebugApi } from '@vidispine/api';

export default function ValidTokenGate({ onInvalidToken, children, ...props }) {
  const [hasValidToken, setHasValidToken] = useState(false);

  const checkIfVidicoreIsOnline = async () => {
    /**
     * Use debug echo to check if vidicore is online
     *
     * Can't use "noauth.isOnline()" as it duplicates cors headers for subsequent requests
     * Vidicore ticket: https://dev.azure.com/arvato-systems-dmm/VidiCore/_workitems/edit/196989
     */
    try {
      await DebugApi.echoDebugNoAuth({
        data: '<ItemSearchDocument xmlns="http://xml.vidispine.com/schema/vidispine"></ItemSearchDocument>',
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    WhoamiApi.whoami({})
      .then(() => {
        // Assume valid token if successful request
        setHasValidToken(true);
      })
      .catch((error) => {
        if (!window.navigator.onLine) setHasValidToken(true);

        /* Vidicore CORS support missing for 401 requests.
         * As a workaround we assume invalid token for 'Network Error' if client has network connection
         * Vidicore ticket: https://dev.azure.com/arvato-systems-dmm/VidiCore/_workitems/edit/197853
         */
        if (error.message === 'Network Error') {
          checkIfVidicoreIsOnline().then((isOnline) => {
            if (isOnline) onInvalidToken();
            // Assume token is valid if we can't access VidiCore
            else setHasValidToken(true);
          });
        }
      });
  }, [onInvalidToken]);

  const cloneChild = (child) => cloneElement(child, props);
  return hasValidToken ? Children.map(children, cloneChild) : null;
}
