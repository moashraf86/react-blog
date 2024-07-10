/* eslint-disable react/prop-types */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
export const Filter = ({ handleFilter }) => {
  return (
    <Select onValueChange={(value) => handleFilter(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="tech">Tech</SelectItem>
          <SelectItem value="science">Science</SelectItem>
          <SelectItem value="culture">Culture</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
