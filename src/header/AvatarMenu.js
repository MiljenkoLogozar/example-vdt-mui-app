/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

const StyledAvatar = styled(Avatar, { name: 'AvatarMenu', slot: 'avatar' })(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.main,
}));

const StyledMenu = styled(Menu, { name: 'AvatarMenu', slot: 'menu' })(() => ({
  '& .MuiMenu-list': {
    minWidth: 200,
  },
}));

export default function AvatarMenu({
  avatarCharacter = 'U',
  children = undefined,
  AvatarProps = {},
  ButtonBaseProps = {},
  MenuProps = {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <ButtonBase onClick={handleMenuClick} disableRipple {...ButtonBaseProps}>
        <StyledAvatar {...AvatarProps}>{avatarCharacter}</StyledAvatar>
        <ArrowDropDownIcon />
      </ButtonBase>
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleMenuClose}
        elevation={1}
        PaperProps={{ square: true }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        {...MenuProps}
      >
        {children}
      </StyledMenu>
    </div>
  );
}
