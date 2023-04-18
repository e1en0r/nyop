import { cx } from '@emotion/css';
import { Paper, PaperProps } from '@phork/phorkit';
import styles from './InputContainer.module.css';

export type InputContainerProps = PaperProps;

export function InputContainer({ children, className, ...props }: InputContainerProps): JSX.Element {
  return (
    <Paper className={cx(styles.container, className)} {...props}>
      {children}
    </Paper>
  );
}

InputContainer.displayName = 'InputContainer';
