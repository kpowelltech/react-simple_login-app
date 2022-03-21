import React, { useRef, useImperativeHandle } from "react";

const Input = React.forwardRef((props, ref) => {

    const inputRef = useRef()

    const activate = () => {
        inputRef.current.focus();
    }

    useImperativeHandle(ref, ()=> {
        return {
            focus: activate
        }
    })

  return (
    <React.Fragment>
      <label htmlFor={props.labelMetaData}>{props.labelText}</label>
      <input
        ref={inputRef}
        type={props.labelMetaData}
        id={props.labelMetaData}
        value={props.value}
        onChange={props.onChangeHandler}
        onBlur={props.onBlur}
      />
    </React.Fragment>
  );
});

export default Input;
