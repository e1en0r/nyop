import { cx } from '@emotion/css';
import { Card, CardProps, Paper, PaperProps } from '@phork/phorkit';
import styles from './InputContainer.module.css';

export type InputContainerProps = CardProps & Pick<PaperProps, 'color'>;

export function InputContainer({
  children,
  className,
  color = 'extreme',
  full,
  ...props
}: InputContainerProps): JSX.Element {
  return (
    <Card className={cx(styles.container, full && styles['container--full'], className)} raised={40} {...props}>
      <Paper full color={color}>
        {children}
      </Paper>
    </Card>
  );
}

InputContainer.displayName = 'InputContainer';
