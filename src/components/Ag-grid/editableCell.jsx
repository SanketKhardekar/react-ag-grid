import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { ReactComponent as EditIcon } from "../../assets/Icons/editIcon.svg";
const EditableCell = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
  const isEditable = props.colDef?.editable;
  const onClickEditIcon = () => {
    props.api.startEditingCell({
      rowIndex: props.rowIndex,
      colKey: props.column.getId(),
    });
  };
  return (
    <Stack
      height="100%"
      width="100%"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      direction="row"
      alignItems="center"
    >
      <Typography variant="hl_paragraphBold">{cellValue}</Typography>
      {isHovered && isEditable && (
        <EditIcon style={{ marginLeft: "10px" }} onClick={onClickEditIcon} />
      )}
    </Stack>
  );
};

export default EditableCell;
