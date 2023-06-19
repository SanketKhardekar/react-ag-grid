import { FormControl, MenuItem, Select } from "@mui/material";
import React, { forwardRef, useImperativeHandle } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const dropdownCellEditor = forwardRef((props, ref) => {
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [value, setValue] = useState(props.value);
  const refInput = useRef(null);
  useEffect(() => {
    // get ref from React component
    window.setTimeout(() => {
      const eInput = refInput.current;
      eInput.focus();
    });
  }, []);

  useImperativeHandle(ref, () => {
    console.log(ref);
    return {
      getValue() {
        return value;
      },
    };
  });
  return (
    <select
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      autoFocus
      className="simple-input-editor"
    >
      <option value="Speed Skaing">Speed Skaing</option>
      <option value="Swimming">Swimming</option>
      <option value="Gymnastics">Gymnastics</option>
      <option value="Cycling">Cycling</option>
    </select>
  );
});

export default dropdownCellEditor;
