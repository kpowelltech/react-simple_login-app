import React, { useState, useEffect, useReducer, useContext, useRef } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../Store/auth-context";
import Input from "../UI/Input/Input";

// =========================================================-->
// useReducer functions to handle the email and password fields
// - logic is handled outside of the functional componenent
// =========================================================-->
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.value, isValid: action.value.includes("@") };
  }

  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.value, isValid: action.value.trim().length > 6 };
  }

  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }

  return { value: "", isValid: false };
};
const Login = (props) => {
  // ==================-->
  // useState variables
  // ==================-->
  const [formIsValid, setFormIsValid] = useState(false);

  // ====================================================-->
  // useContext call
  // - handles app wide state management, i.e authentication
  // ====================================================-->
  const authCtx = useContext(AuthContext);

  // =============================================================================-->
  // useReducer calls
  // - logic is handled within functional component
  // - logic is handling input and validation for email and password state management
  // =============================================================================-->
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", value: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  // ===========================================-->
  // Object destructuring to use in useEffect hook
  // ===========================================-->
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // ===================================================-->
  // - useEffect hook includes timeout logic to
  //   reduce API calls on every keystroke
  // - also includes a clean up function to reset the timer
  //   after every keystroke
  // ===================================================-->
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking from validity");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("CLEANUP");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus()
    } else {
      passwordInputRef.current.focus()
    }
  };

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}>
          <Input
            ref={emailInputRef}
            labelText="E-mail"
            labelMetaData="email"
            value={emailState.value}
            onChangeHandler={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}>
          <Input
            ref={passwordInputRef}
            labelText="Password"
            labelMetaData="password"
            value={passwordState.value}
            onChangeHandler={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
