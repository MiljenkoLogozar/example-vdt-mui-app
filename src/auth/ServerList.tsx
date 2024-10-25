import { useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Selftest as SelftestApi } from '@vidispine/api';

const hasErrorUrl = (value = '', helperText = 'Not a URL') => {
  const expression = /https?:\/\/[-a-zA-Z0-9@:%._+~#=]{2,256}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);
  const matches = value.match(regex);
  return matches ? undefined : helperText;
};

export default function ServerList({
  onClickServer,
  serverList = [],
  onAddServer,
  onRemoveServer,
  AppTitleComponent,
}) {
  const { t } = useTranslation();
  const [onlineServers, setOnlineServers] = useState<any[]>();
  const [isEditing, setIsEditing] = useState<boolean>(serverList.length === 0);
  const [helperText, setHelperText] = useState<string>();
  const [newServer, setNewServer] = useState('');
  const handleChange = (event) => {
    setNewServer(event.target.value);
  };
  const handleAddServer = (event) => {
    if (event && event.preventDefault) event.preventDefault();
    const hasError = hasErrorUrl(newServer);
    if (hasError) {
      setHelperText(hasError);
      return;
    }
    onAddServer(newServer);
    setIsEditing(false);
    setNewServer('');
    setHelperText(undefined);
  };
  useEffect(() => {
    Promise.all(
      serverList.map(
        (baseURL) =>
          new Promise((resolve) => {
            SelftestApi.getSelftestNoAuth({
              requestConfig: {
                baseURL,
              },
            })
              .then(() => resolve(true))
              .catch(() => resolve(false));
          }),
      ),
    ).then((output) => setOnlineServers(output));
  }, [serverList]);
  const toggleEditing = (event) => setIsEditing(event.target.checked);

  const ListItemComponent = isEditing ? ListItemButton : ListItem;

  return (
    <Container maxWidth="sm">
      <div style={{ height: '30vh' }} />
      <Grid container justifyContent="space-between" direction="row" style={{ width: '100%' }}>
        {AppTitleComponent && (
          <Grid item>
            <AppTitleComponent />
          </Grid>
        )}
        <Grid item>
          <FormControlLabel
            control={<Switch checked={isEditing} onChange={toggleEditing} />}
            label={t('Edit')}
            sx={{ marginRight: 0 }}
          />
        </Grid>
      </Grid>
      <List component="nav">
        {isEditing && (
          <ListItem disableGutters>
            <form onSubmit={handleAddServer} style={{ width: '100%' }}>
              <TextField
                value={newServer}
                onChange={handleChange}
                label={t('Add Server')}
                variant="outlined"
                fullWidth
                error={helperText !== undefined}
                helperText={t(helperText)}
                size="medium"
                InputProps={{
                  size: 'medium',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddServer}>
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </ListItem>
        )}
        {serverList.map((apiServer, idx) => (
          <ListItemComponent
            key={apiServer}
            onClick={isEditing ? undefined : () => onClickServer(apiServer)}
          >
            <ListItemText primary={apiServer} />
            <ListItemSecondaryAction>
              {isEditing ? (
                <IconButton edge="end" onClick={() => onRemoveServer(apiServer)}>
                  <DeleteIcon />
                </IconButton>
              ) : (
                Array.isArray(onlineServers) &&
                (onlineServers[idx] === true ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <ErrorOutlineIcon color="error" />
                ))
              )}
            </ListItemSecondaryAction>
          </ListItemComponent>
        ))}
      </List>
    </Container>
  );
}
