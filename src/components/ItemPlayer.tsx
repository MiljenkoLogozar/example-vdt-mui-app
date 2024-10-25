import { useMemo } from 'react';

import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import * as mpdParser from 'mpd-parser';
import urlJoin from 'url-join';

import type { ItemType } from '@vidispine/types';
import { filterShapeSource, metadataTypeToWebVtt } from '@vidispine/vdt-js';

import { VIDISPINE_URL } from '../const';

import { VdtPlayerReact } from './VdtPlayerReact';

const VIDISTREAM_SERVERS = ['https://demo-eu.vidispine.net/stream/dash/v4'];

const TEMP_URLS = {
  VIDISTREAM_FILE:
    'file:///vpmsmounts/smb/assets/storages/proxy/2023-05-25/ITEM-VX-972_2023-05-25_09-20-50Z.mxf',
  DASH: 'https://dash.akamaized.net/dash264/TestCases/1b/qualcomm/1/MultiRatePatched.mpd',
};

const getVidistreamSrc = ({
  streamingServer,
  url,
  ending = 'mpd',
}: {
  streamingServer: string;
  url: string;
  ending?: string;
}) => urlJoin(streamingServer, window.btoa(url), `.${ending}`);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getParsedDashSource = (manifest, manifestUri) =>
  // Use type: 'application/vnd.videojs.vhs+json'
  `data:application/vnd.videojs.vhs+json,${JSON.stringify(
    mpdParser.parse(manifest, {
      manifestUri,
    }),
  )}`;

const getItemSources = (itemType: ItemType) =>
  filterShapeSource(itemType, {}).map(({ src, type, parsedShape }) => ({
    src,
    type,
    label: parsedShape.tag,
    timeBase: parsedShape.timeBase,
  }));

type ItemPlayerProps = { itemType: ItemType; isLoading: boolean };

function ItemPlayer({ itemType, isLoading, ...props }: ItemPlayerProps) {
  const theme = useTheme() as { palette: { mode: 'light' | 'dark' } };

  const sourcesWithTempDash = [
    ...getItemSources(itemType),
    {
      src: TEMP_URLS.DASH,
      type: 'application/dash+xml',
      label: 'DASH Example',
      timeBase: 25,
    },
    {
      src: getVidistreamSrc({
        streamingServer: VIDISTREAM_SERVERS[0],
        url: TEMP_URLS.VIDISTREAM_FILE,
      }),
      type: 'application/dash+xml',
      label: 'DASH Example (VidiStream)',
      timeBase: 25,
    },
  ];

  const subtitles = useMemo(() => {
    const webVttString = metadataTypeToWebVtt(itemType?.metadata, {
      subtitleGroup: 'stl_subtitle',
      subtitleField: 'stl_text',
    });
    return !webVttString
      ? undefined
      : [
          {
            src: webVttString,
            language: 'en',
          },
        ];
  }, [itemType?.metadata]);

  return isLoading ? null : (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box {...props}>
      <VdtPlayerReact
        sources={sourcesWithTempDash}
        subtitles={subtitles}
        theme={theme.palette.mode}
        crossOrigin={VIDISPINE_URL.startsWith('http://localhost') ? undefined : 'anonymous'}
      />
    </Box>
  );
}

export { ItemPlayer };
