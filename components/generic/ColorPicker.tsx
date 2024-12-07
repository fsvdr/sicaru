import { useIsMobile } from '@lib/hooks/use-mobile';
import { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './DropdownMenu';
import { FieldSlot } from './Form';

const ColorPicker = ({ defaultValue, onChange }: { defaultValue?: string; onChange: (color: string) => void }) => {
  const isMobile = useIsMobile();
  const [color, setColor] = useState(defaultValue || '#000000');

  return (
    <DropdownMenu>
      <div className="flex items-center gap-2">
        <DropdownMenuTrigger asChild>
          <div className="block border-2 rounded-full size-8 border-slate-200" style={{ backgroundColor: color }} />
        </DropdownMenuTrigger>

        <FieldSlot className="flex-1">
          <HexColorInput
            color={color}
            prefixed
            alpha
            onChange={(color) => {
              setColor(color);
              onChange(color);
            }}
          />
        </FieldSlot>
      </div>

      <DropdownMenuContent sideOffset={12} align={isMobile ? 'start' : 'center'} className="overflow-visible">
        <HexColorPicker
          color={color}
          onChange={(color) => {
            setColor(color);
            onChange(color);
          }}
          className="w-20 aspect-square"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorPicker;
