import React, {useReducer, useEffect} from 'react';

import {validate} from '../Util/validators';
import './Input.css';


const inputReducer=(state, action)=>{
  switch(action.type){
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH':
      return{
        ...state,
        isTouched: true
      };  
    default:
      return state;  
  }
}
const Input = props => {
  const [inputState, dispatch]= useReducer(inputReducer,{
    value: props.initialValue||'',
    isTouched: false,
    isValid: props.initialValid||false
  });

  const{ id, onInput}= props; //array destructring
  const{ value, isValid}= inputState;

  useEffect(()=>{
   onInput(id, value, isValid)},
   [id, value, isValid, onInput]);

  const changeHandler= event=>{
    dispatch({type: 'CHANGE',
     val: event.target.value, //getting the value entered
     validators: props.validators //will recieve validators as props from newPlace
    });
  };
  const touchHandler=()=>{ //only show invalid or valid when the user had a change to atleast touch it means, click into the input box and then out of it
    dispatch({ type: 'TOUCH'});
  }
  const element =
    props.element === 'input' ? (
      <input
       id={props.id}
       type={props.type}
       placeholder={props.placeholder}
       onChange={changeHandler}
       onBlur={touchHandler} //onBlur is trigerred when the user loses focus on the input element, user had to click into it and then out of it
       value={inputState.value} //two way binding
       />
    ) : (
      <textarea id={props.id}
       rows={props.rows || 3}
       onChange={changeHandler}
       onBlur={touchHandler}
       value={inputState.value}
        />
    );

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>
       {props.label}
       </label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
