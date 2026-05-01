import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useFilters } from "@/store/filters";
import { AIRLINES, ORIGINS } from "@/data/options";
import { cn } from "@/lib/utils";

function MultiSelect({
  label, options, value, onChange, searchable = false,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[180px] justify-between">
          <span className="truncate">
            {value.length === 0 ? label : `${label}: ${value.length}`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="start">
        <Command>
          {searchable && <CommandInput placeholder={`Search ${label.toLowerCase()}…`} />}
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.value} onSelect={() => toggle(opt.value)}>
                  <Check className={cn("mr-2 h-4 w-4", value.includes(opt.value) ? "opacity-100" : "opacity-0")} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function FilterBar() {
  const { yearRange, airlines, origins, setYearRange, setAirlines, setOrigins, reset } = useFilters();
  const [localRange, setLocalRange] = useState<[number, number]>(yearRange);

  useEffect(() => setLocalRange(yearRange), [yearRange]);

  return (
    <div className="sticky top-0 z-30 -mx-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md md:-mx-6 md:px-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-[260px] flex-1 flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Year range</span>
            <span className="font-medium text-foreground">{localRange[0]} – {localRange[1]}</span>
          </div>
          <Slider
            min={2018}
            max={2022}
            step={1}
            value={localRange}
            onValueChange={(v) => setLocalRange(v as [number, number])}
            onValueCommit={(v) => setYearRange(v as [number, number])}
          />
        </div>
        <MultiSelect
          label="Airline"
          options={AIRLINES.map((a) => ({ value: a.code, label: `${a.code} — ${a.name}` }))}
          value={airlines}
          onChange={setAirlines}
          searchable
        />
        <MultiSelect
          label="Origin"
          options={ORIGINS.map((o) => ({ value: o, label: o }))}
          value={origins}
          onChange={setOrigins}
          searchable
        />
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
      {(airlines.length > 0 || origins.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {airlines.map((a) => (
            <Badge key={a} variant="secondary" className="cursor-pointer" onClick={() => setAirlines(airlines.filter((x) => x !== a))}>
              {a} ✕
            </Badge>
          ))}
          {origins.map((o) => (
            <Badge key={o} variant="secondary" className="cursor-pointer" onClick={() => setOrigins(origins.filter((x) => x !== o))}>
              {o} ✕
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}