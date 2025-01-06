import {Minus, Plus} from "lucide-react";

import {Button} from "./button";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({value, onChange, min = 0, max}: StepperProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        className="h-8 w-8"
        disabled={value <= min}
        size="icon"
        variant="outline"
        onClick={() => onChange(value - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center">{value}</span>
      <Button
        className="h-8 w-8"
        disabled={max !== undefined && value >= max}
        size="icon"
        variant="outline"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
