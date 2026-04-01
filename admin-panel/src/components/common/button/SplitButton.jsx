import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "./Button";

export const SplitButton = ({ label, onMain, options = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex">
      <Button onClick={onMain} className="rounded-r-none">
        {label}
      </Button>

      <Button onClick={() => setOpen(!open)} className="rounded-l-none px-2">
        <FiChevronDown />
      </Button>

      {open && (
        <div className="absolute top-full mt-1 bg-white shadow rounded w-40">
          {options.map((item, i) => (
            <div
              key={i}
              onClick={item.onClick}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
