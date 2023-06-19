import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ReactComponent as GreenCheckedEdit } from "../../assets/Icons/greenCheck.svg";
import { ReactComponent as GreyCheckedEdit } from "../../assets/Icons/greyCheck.svg";
// backspace starts the editor on Windows
const KEY_BACKSPACE = "Backspace";
const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";

export default forwardRef((props, ref) => {
  const createInitialState = () => {
    let startValue;

    if (props.eventKey === KEY_BACKSPACE) {
      // if backspace or delete pressed, we clear the cell
      startValue = "";
    } else if (props.charPress) {
      // if a letter was pressed, we start with the letter
      startValue = props.charPress;
    } else {
      // otherwise we start with the current value
      startValue = props.value;
    }

    return {
      value: startValue,
    };
  };

  const initialState = createInitialState();
  const [value, setValue] = useState(initialState.value);
  const [isValueValid, setIsValueValid] = useState(true);
  const [isTickClicked, setIsTickClick] = useState(false);
  const refInput = useRef(null);
  // focus on the input
  useEffect(() => {
    // get ref from React component
    window.setTimeout(() => {
      const eInput = refInput.current;
      eInput.focus();
    });
  }, []);

  /* Utility Methods */
  const cancelBeforeStart =
    props.charPress && "1234567890".indexOf(props.charPress) < 0;

  const isLeftOrRight = (event) => {
    return ["ArrowLeft", "ArrowRight"].indexOf(event.key) > -1;
  };

  const isCharNumeric = (charStr) => {
    return !!/\d/.test(charStr);
  };

  const isKeyPressedNumeric = (event) => {
    const charStr = event.key;
    return isCharNumeric(charStr);
  };
  const onTickClickHandler = (event) => {
    setIsTickClick(true);
    setTimeout(() => props.api.stopEditing(), 100);
  };
  const isBackspace = (event) => {
    return event.key === KEY_BACKSPACE;
  };

  const onKeyDown = (event) => {
    if (isLeftOrRight(event) || isBackspace(event)) {
      event.stopPropagation();
      return;
    }
    if (props.inputType === "text" && isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
    if (props.inputType === "numeric" && !isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
    if (props.inputType === "tel" && !isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
  };
  const onChangeHandler = (event) => {
    setValue(event.target.value);
  };
  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        return Number(value);
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return cancelBeforeStart;
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        return !isTickClicked;
      },
    };
  });
  return (
    <TextField
      ref={refInput}
      autoFocus
      type={props.inputType}
      className={"simple-input-editor"}
      size="small"
      value={value}
      onChange={onChangeHandler}
      onKeyDown={(event) => onKeyDown(event)}
      InputProps={{
        endAdornment: (
          <IconButton
            style={{
              cursor: isValueValid ? "pointer" : "none",
            }}
            onClick={
              isValueValid
                ? () => {
                    setIsTickClick(true);
                    onTickClickHandler();
                  }
                : () => {}
            }
          >
            {isValueValid ? <GreenCheckedEdit /> : <GreyCheckedEdit />}
          </IconButton>
        ),
      }}
      helperText={!isValueValid ? `Enter valid ${props.colDef.field}` : ""}
    />
  );
});
