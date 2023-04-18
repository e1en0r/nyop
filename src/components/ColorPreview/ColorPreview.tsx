import { cx } from '@emotion/css';
import { Flex, FlexProps, Typography } from '@phork/phorkit';
import styles from './ColorPreview.module.css';

export type ColorPreviewProps = Omit<FlexProps, 'direction'> & {
  color: string;
};

export function ColorPreview({ className, color, style, ...props }: ColorPreviewProps): JSX.Element {
  return (
    <Flex alignItems="center" direction="row" {...props}>
      <div className={cx(styles.colorBox, className)} style={{ backgroundColor: color, ...style }} />
      <Typography size="3xlarge" variants={['letter-spacing-comfy', 'uppercase']} weight="bold">
        {color}
      </Typography>
    </Flex>
  );
}

ColorPreview.displayName = 'ColorPreview';
