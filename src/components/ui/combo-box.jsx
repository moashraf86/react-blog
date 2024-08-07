/* eslint-disable react/prop-types */
"use client";

import * as React from "react";
import { RiCheckLine, RiHashtag } from "@remixicon/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ComboboxDemo({ tags, onSelect, selectedValue }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedValue || "Select Tag...");

  /**
   * Handle Value Selection
   */
  const handleSelect = (value) => {
    setValue(value);
    setOpen(false);
    onSelect({ target: { name: "tag", value } });
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-start"
        >
          <RiHashtag className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tag..." className="h-9" />
          <CommandList>
            <CommandEmpty>No tag found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={handleSelect}
                >
                  {tag.label}
                  <RiCheckLine
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === tag.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
