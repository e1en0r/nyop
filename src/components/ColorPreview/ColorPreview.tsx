import { Flex, FlexProps, Typography } from '@phork/phorkit';
import styles from './ColorPreview.module.css';

export type ColorPreviewProps = Omit<FlexProps, 'direction'> & {
  color: string;
};

export function ColorPreview({ color, ...props }: ColorPreviewProps): JSX.Element {
  return (
    <Flex alignItems="center" direction="row" {...props}>
      <div className={styles.colorBox} style={{ backgroundColor: color }} />
      <Typography
        className={styles.colorText}
        size="3xlarge"
        variants={['letter-spacing-comfy', 'uppercase']}
        weight="bold"
      >
        {color}
      </Typography>
    </Flex>
  );
}

ColorPreview.displayName = 'ColorPreview';
