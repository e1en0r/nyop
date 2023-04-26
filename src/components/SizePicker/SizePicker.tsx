import React from 'react';
import { Button, Flex, FlexProps, Rhythm } from '@phork/phorkit';
import { SizePickerItem } from './SizePickerItem';

const GRID_SIZE = 4;
const GRID_MAPPER = Array(GRID_SIZE)
  .fill(null)
  .map((_, i) => i + 1);

export type SizePickerValue = { x: number; y: number };

export type SizePickerProps = Omit<FlexProps, 'direction' | 'onChange'> & {
  disabled?: boolean;
  onChange: (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element> | React.TouchEvent<Element>,
    value: SizePickerValue,
  ) => void;
  value?: SizePickerValue;
};

export function SizePicker({ disabled, onChange, value, ...props }: SizePickerProps): JSX.Element {
  return (
    <Flex direction="row" justifyContent="space-between" {...props}>
      <Rhythm my={3}>
        {GRID_MAPPER.map(filled => (
          <Button
            color={value?.x === filled && value?.y === filled ? 'primary' : 'neutral'}
            disabled={disabled}
            key={`square${filled}`}
            onClick={e => onChange(e, { x: filled, y: filled })}
            shape="brick"
            style={{ padding: 0, margin: 0 }}
            weight="ghost"
          >
            <SizePickerItem filled={{ x: filled, y: filled }} rendered={{ x: GRID_SIZE, y: GRID_SIZE }} size="small" />
          </Button>
        ))}
      </Rhythm>
    </Flex>
  );
}

SizePicker.displayName = 'SizePicker';
