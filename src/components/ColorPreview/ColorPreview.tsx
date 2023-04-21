import { Flex, FlexProps, Typography } from '@phork/phorkit';
import styles from './ColorPreview.module.css';

export type ColorPreviewProps = Omit<FlexProps, 'direction'> & {
  color: string;
};

export function ColorPreview({ color, ...props }: ColorPreviewProps): JSX.Element {
  return (
    <Flex alignItems="center" direction="row" {...props}>
      <div className={styles.colorBox} style={{ backgroundColor: color }} />
      <Typography<'div'>
        as="div"
        className={styles.colorText}
        size="2xlarge"
        variants={['letter-spacing-comfy']}
        weight="bold"
      >
        {color}
      </Typography>
    </Flex>
  );
}

ColorPreview.displayName = 'ColorPreview';
