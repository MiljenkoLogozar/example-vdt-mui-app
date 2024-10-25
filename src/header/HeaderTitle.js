import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { APP_TITLE, HEADER_LOGO } from '../const';

const TitleText = styled(Typography)(() => ({}));

export default function HeaderTitle({ subheader }) {
  return (
    <Grid container alignItems="center">
      <Box pr={2}>
        <Avatar variant="square" src={HEADER_LOGO} alt={APP_TITLE} />
      </Box>
      <Box>
        <TitleText color="inherit">{APP_TITLE}</TitleText>
        {subheader && (
          <Typography variant="caption" color="inherit">
            {subheader}
          </Typography>
        )}
      </Box>
    </Grid>
  );
}
