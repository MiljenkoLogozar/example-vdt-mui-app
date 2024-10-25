/* eslint-disable react/jsx-props-no-spreading */
import { useRef, useState } from 'react';

import { TextField, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

const SERVER_URL_PARAM = 'to';
const params = new URLSearchParams(window.location.search);
const defaultServerUrl = params.get(SERVER_URL_PARAM) || '';

function LoginForm({ onSubmit, username, serverUrl, onBack }) {
  const { t } = useTranslation();
  const [error, setError] = useState();
  const usernameRef = useRef<{ value: string }>();
  const passwordRef = useRef<{ value: string }>();

  const handleSubmit = () => {
    setError(undefined);
    const values = {
      username: username ?? usernameRef.current?.value,
      password: passwordRef.current?.value,
      serverUrl,
    };
    onSubmit({
      values,
      onError: setError,
    });
  };

  const submitOnEnter = ({ key }) => {
    if (key === 'Enter') {
      handleSubmit();
    }
  };
  return (
    <form style={{ textAlign: 'right', paddingTop: 16 }}>
      <TextField
        inputRef={usernameRef}
        label={t('Username')}
        autoComplete="username"
        variant="outlined"
        margin="dense"
        required
        fullWidth
        onChange={() => setError(undefined)}
        onKeyDown={submitOnEnter}
        size="medium"
        InputProps={{
          size: 'medium',
        }}
      />
      <TextField
        inputRef={passwordRef}
        label={t('Password')}
        type="password"
        autoComplete="current-password"
        variant="outlined"
        margin="dense"
        required
        fullWidth
        onChange={() => setError(undefined)}
        onKeyDown={submitOnEnter}
        size="medium"
        InputProps={{
          size: 'medium',
        }}
      />
      <Box display="flex" flexDirection="column" gap={1} marginTop={2}>
        <Button variant="contained" disableElevation onClick={handleSubmit}>
          {t('Login')}
        </Button>
        <Button onClick={() => onBack()} variant="outlined">
          {t('Back To Server List')}
        </Button>
      </Box>
      {!!error && (
        <Alert style={{ marginTop: 8 }} severity="error">
          {t(error)}
        </Alert>
      )}
    </form>
  );
}

export default function Login({
  username,
  serverUrl = defaultServerUrl,
  onLogin,
  onBack,
  AppTitleComponent,
}) {
  return (
    <Container maxWidth="sm">
      <div style={{ height: '30vh' }} />
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        style={{ width: '100%' }}
      >
        <Grid item>
          <AppTitleComponent subheader={serverUrl} />
        </Grid>
      </Grid>
      <LoginForm onSubmit={onLogin} username={username} serverUrl={serverUrl} onBack={onBack} />
    </Container>
  );
}
