import {useCallback, useReducer} from 'react';

const formReducer=(state, action)=>{
    switch (action.type){
      case 'INPUT_CHANGE':
        let formIsValid = true;
        for(const inputId in state.inputs){
            if(!state.inputs[inputId])  // in case where some quantinty is undefined as name is undefined when we switch to signup mode
            {
              continue;   
            }            
            if(inputId === action.inputId){ // if the input we're currently looking at same as the input id getting updated by the action
              formIsValid = formIsValid && action.isValid;
            }
            else{
              formIsValid= formIsValid && state.inputs[inputId].isValid; //stored value for this input id
            }
        }
        return {
          ...state,  //existing state
          inputs: {
            ...state.inputs,
            [action.inputId]: {value: action.value, isValid: action.isValid}
          },
          isValid: formIsValid //overall form validity
        };
        case 'SET_DATA':  //overriding the existing state
            return{
                inputs: action.inputs ,
                isValid: action.formIsValid
            };
        default:
          return state; // return the unchanged state in case nothing happens
    }
  }

export const useForm =(initialInputs, isFormValidity)=>{ //custon hook useForm
  //useReducer is similar to useState but handles more complex states which are interconnected and also returns an array of two quantities like useState
    const [formState, dispatch] = useReducer(formReducer, {  //formReducer is the function that updates the state
        inputs: initialInputs ,  // inputs property for the things the user will enter
        isValid: isFormValidity  //isValid for the overall form
      });


      const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
          type: 'INPUT_CHANGE',
          value: value,
          isValid: isValid,
          inputId: id
        });
      }, []);

      const setFormData= useCallback((inputData, formValidity)=>{ //in case of updating the form
          dispatch({
              type: 'SET_DATA',
              inputs: inputData,
              formIsValid: formValidity
          });
      },[]);

      return[formState, inputHandler, setFormData];
};