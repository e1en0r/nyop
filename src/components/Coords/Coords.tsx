import React from 'react';
import { Flex, FlexProps, Typography } from '@phork/phorkit';
import styles from './Coords.module.css';

export type CoordsProps = Omit<FlexProps, 'direction'> & {
  x: number;
  y: number;
};

export function Coords({ x, y, ...props }: CoordsProps): JSX.Element {
  return (
    <Flex alignItems="center" direction="row" {...props}>
      <Typography className={styles.coords} size="3xlarge" variants={['letter-spacing-comfy', 'uppercase']}>
        <Typography weight="bold">X:</Typography>
        {` ${x}`}
      </Typography>
      <Typography className={styles.coords} size="3xlarge" variants={['letter-spacing-comfy', 'uppercase']}>
        <Typography weight="bold">Y:</Typography>
        {` ${y}`}
      </Typography>
    </Flex>
  );
}

Coords.displayName = 'Coords';
