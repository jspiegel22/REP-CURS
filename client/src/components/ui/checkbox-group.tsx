import React, { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  items: { id: string; label: string }[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
  className?: string;
}

export function CheckboxGroup({
  items,
  selectedItems,
  onChange,
  className,
}: CheckboxGroupProps) {
  const id = useId();

  const handleItemChange = (checked: boolean, itemId: string) => {
    if (checked) {
      onChange([...selectedItems, itemId]);
    } else {
      onChange(selectedItems.filter((id) => id !== itemId));
    }
  };

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {items.map((item) => (
        <div key={`${id}-${item.id}`} className="flex items-center space-x-2">
          <Checkbox
            id={`${id}-${item.id}`}
            checked={selectedItems.includes(item.id)}
            onCheckedChange={(checked) => handleItemChange(checked as boolean, item.id)}
          />
          <Label
            htmlFor={`${id}-${item.id}`}
            className="text-sm font-normal cursor-pointer"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}

interface CheckboxItemProps {
  children: React.ReactNode;
  value: string;
}

export function CheckboxItem(props: CheckboxItemProps) {
  // This is just a typing component for better DX
  return null;
}