import { useEffect, useRef } from 'react';

import { VdtPlayer } from '@vidispine/vdt-player';
import type { VdtPlayerProps } from '@vidispine/vdt-player';

import '@vidispine/vdt-player/dist/index.css';

export function VdtPlayerReact(props: VdtPlayerProps) {
  const { options } = props;
  const optionsRef = useRef<VdtPlayerProps['options']>(options);
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VdtPlayer>();

  const createPlayer = () => {
    if (targetRef.current) {
      playerRef.current = new VdtPlayer({
        target: targetRef.current,
        ...props,
      });
    }
  };

  const disposePlayer = () => {
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = undefined;
    }
  };

  // Since options only can be set in constructor
  if (JSON.stringify(optionsRef.current) !== JSON.stringify(options)) {
    optionsRef.current = options!;
    disposePlayer();
    createPlayer();
  }

  // Create and dispose on mount/unmount
  useEffect(() => {
    createPlayer();
    return () => {
      disposePlayer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current;
      Object.entries(props)
        .filter(([key]) => !key.match(/^on[A-Z]/g)) // skip callbacks
        .forEach(([key, value]) => {
          if (typeof player?.[key] === 'function') player?.[key](value);
        });
    }
  }, [props]);

  return <div ref={targetRef} />;
}
