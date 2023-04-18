import React from 'react';
import { Button, Flex, FlexProps, Rhythm } from '@phork/phorkit';
import { SizePickerItem } from './SizePickerItem';

const GRID_SIZE = 4;
const GRID_MAPPER = Array(GRID_SIZE)
  .fill(null)
  .map((_, i) => i + 1);

export type SizePickerValue = { x: number; y: number };

export type SizePickerProps = Omit<FlexProps, 'direction' | 'onChange'> & {
  onChange: (
    event: React.MouseEvent<Element> | React.KeyboardEvent<Element> | React.TouchEvent<Element>,
    value: SizePickerValue,
  ) => void;
  value: SizePickerValue;
};

export function SizePicker({ onChange, value = { x: 1, y: 1 }, ...props }: SizePickerProps): JSX.Element {
  return (
    <Flex direction="row" justifyContent="space-between" {...props}>
      <Rhythm my={3}>
        {GRID_MAPPER.map(filled => (
          <Button
            color={value.x === filled && value.y === filled ? 'primary' : 'neutral'}
            key={`square${filled}`}
            onClick={e => onChange(e, { x: filled, y: filled })}
            shape="brick"
            style={{ padding: 0, margin: 0 }}
            weight="ghost"
          >
            <SizePickerItem filledX={filled} filledY={filled} renderedX={GRID_SIZE} renderedY={GRID_SIZE} />
          </Button>
        ))}
      </Rhythm>
    </Flex>
  );
}

SizePicker.displayName = 'SizePicker';