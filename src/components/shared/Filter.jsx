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
          <SelectItem value="web-development">Web</SelectItem>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="html">HTML</SelectItem>
          <SelectItem value="css">CSS</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
