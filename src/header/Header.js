import { useMemo } from 'react';

import UserIcon from '@mui/icons-material/Person';
import { Select } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useSettings, useSettingsActions } from '@vidispine/vdt-react';

import i18n from '../locale/i18n';

import AvatarMenu from './AvatarMenu';
import HeaderTitle from './HeaderTitle';
import ThemeToggle from './ThemeToggle';

const MenuSection = styled('div')(({ theme: { spacing } }) => ({
  paddingLeft: spacing(2),
  paddingRight: spacing(2),
  paddingTop: spacing(0.75),
  paddingBottom: spacing(0.75),
  display: 'flex',
  alignItems: 'center',
  gap: spacing(1),
}));
const StyledButton = styled(Button)(({ theme: { typography, palette, spacing } }) => ({
  ...typography.subtitle1,
  height: spacing(7),
  textTransform: 'none',
  '&::after': {
    color: palette.primary.main,
    transition: 'width 0.25s ease-in-out 0.05s',
    width: 0,
    height: '.3em',
    background: `linear-gradient(to right, ${palette.secondary.main} 0%, ${palette.primary.main} 28%, ${palette.success.main} 64%, ${palette.success.light} 97%)`,
    position: 'absolute',
    bottom: 0,
    left: 0,
    content: '""',
  },
  '&:hover, &.active': {
    opacity: 1,
    backgroundColor: 'unset',
    '&::after': {
      width: '100%',
    },
  },
  '&:not(:last-child)': {
    marginRight: spacing(2),
  },
}));

export default function Header({ username, serverUrl, onLogout }) {
  const { t } = useTranslation();
  const switchServerUrl = useMemo(() => {
    const { href } = window.location;
    return href.split('server')[0];
  }, []);

  const languageOptions = [
    { label: 'Swedish', value: 'sv' },
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
  ];

  const { updateSetting } = useSettingsActions();
  const {
    settings: { theme },
  } = useSettings();

  const handleChangeThemeMode = (_, mode) => {
    if (mode) updateSetting({ theme: mode });
  };

  const handleChangeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    updateSetting({ language: newLanguage });
  };

  return (
    <AppBar position="relative" color="inherit" variant="outlined" elevation={0}>
      <Box px={2} width="100%" display="flex" justifyContent="space-between" alignItems="center">
        <Grid item sx={{ minWidth: '200px' }}>
          <HeaderTitle subheader={serverUrl} />
        </Grid>
        <Grid item>
          <StyledButton
            variant="text"
            component={NavLink}
            to="/upload/"
            color="inherit"
            disableRipple
            sx={{ minWidth: '100px' }}
          >
            {t('Upload')}
          </StyledButton>
          <StyledButton
            variant="text"
            component={NavLink}
            to="/item/"
            color="inherit"
            disableRipple
            sx={{ minWidth: '100px' }}
          >
            {t('Items')}
          </StyledButton>
          <StyledButton
            variant="text"
            component={NavLink}
            to="/collection/"
            color="inherit"
            disableRipple
            sx={{ minWidth: '100px' }}
          >
            {t('Collections')}
          </StyledButton>
          <StyledButton
            variant="text"
            component={NavLink}
            to="/timespans/"
            color="inherit"
            disableRipple
          >
            {t('Timespans')}
          </StyledButton>
        </Grid>
        <Grid item sx={{ minWidth: '200px', textAlign: 'right' }}>
          <AvatarMenu avatarCharacter={username ? username[0] : ''}>
            <MenuSection disabled>
              <UserIcon />
              {username}
            </MenuSection>
            <MenuSection>
              <ThemeToggle onChange={handleChangeThemeMode} value={theme} />
            </MenuSection>
            <MenuSection>
              <Select
                options={languageOptions}
                value={i18n.language || ''}
                onChange={({ target: { value } }) => handleChangeLanguage(value)}
                style={{
                  width: '100%',
                }}
              >
                {languageOptions.map(({ label, value }) => (
                  <MenuItem value={value} key={value}>
                    {t(label)}
                  </MenuItem>
                ))}
              </Select>
            </MenuSection>
            <MenuItem component={NavLink} to="/settings">
              {t('Settings')}
            </MenuItem>
            {!!serverUrl && (
              <MenuItem component="a" href={switchServerUrl}>
                {t('Switch Server')}
              </MenuItem>
            )}
            <MenuItem onClick={onLogout}>{t('Sign Out')}</MenuItem>
          </AvatarMenu>
        </Grid>
      </Box>
    </AppBar>
  );
}
