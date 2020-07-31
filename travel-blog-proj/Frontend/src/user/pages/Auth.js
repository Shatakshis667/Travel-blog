import React, {useState, useContext} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/components/Util/validators';
import {useForm } from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import './Auth.css';

const Auth=()=>{
    
    const auth= useContext(AuthContext);

    const[isLoginMode, setIsLoginMode]= useState(true);
    const{isLoading, error, sendRequest, clearError}= useHttpClient();


    const[formState, inputHandler, setFormData]=useForm({
        email:{
            value: '',
            isValid: false
        },
        password:{
            value:'',
            isValid:false
        }
    }, false);

const switchModeHandler=()=>{

    if(!isLoginMode){ // we're now in sign up mode and switching back to login mode
       setFormData({
       ...formState.inputs,
       name: undefined, // to drop the name and image when we go to login mode
       image: undefined
       }, formState.inputs.email.isValid && formState.inputs.password.isValid); // so the overall form validity depends only on the email and password validity 
    }
    else{ // now in login mode and switching to signup mode
        setFormData({
       ...formState.inputs, //keep the email and password from login mode
       name:{
           value:'', // value is empty for name and validity is false
           isValid: false
        },
        image: {
            value: null,
            isValid:false
        }
        }, false); // will initially be false because we're just about to add the name, it's not there beforehand
    }
    setIsLoginMode(prevMode=> !prevMode);
};

const authSubmitHandler= async event=>{
    event.preventDefault();
    console.log(formState.inputs);
    
    if(isLoginMode)
    {
                           
            try{
                const responseData=await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users/login', 
                'POST',
                 JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                    }),
                 { //headers attached to the ongoing req, contains key-value pairs
                  'Content-Type': 'application/json' // so that the bodyparsing json data works correctly
                 }
                
             );
             auth.login(responseData.userId, responseData.token);  //after authentication, change to login status
            }catch(err){}
    }
    else{
        const formData= new FormData(); //browser api
        //on form data you can append normal text data as well as binary data 
        formData.append('email', formState.inputs.email.value);  //pass key value pairs
        formData.append('name', formState.inputs.name.value); 
        formData.append('password', formState.inputs.password.value); 
        formData.append('image', formState.inputs.image.value); 



        try{                     
            const responseData=await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users/signup', 
                'POST',
                 formData //instead of sending json stringify data we're sendinf formData              
            );
            auth.login(responseData.userId, responseData.token);  //after authentication, change to login status
         }catch(err){}
            
         
    }
    
};

    return(
        
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        
        <Card className="authentication" >
            {isLoading && <LoadingSpinner asOverlay/>}
          <h2>LOGIN REQUIRED</h2>
          <hr/>
          <form onSubmit={authSubmitHandler}>
          {!isLoginMode && 
              <Input
               element="input"
               id="name"
               type="text"
               label="Your Name"
               validators={[VALIDATOR_REQUIRE()]}
               errorText="Please enter a name."
               onInput={inputHandler}

              />}

           {!isLoginMode && 
              <ImageUpload center id="image" onInput={inputHandler} />
            }            
          <Input
          element= "input"
          id="email"
          type="email"
          label="E-mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address!"
          onInput={inputHandler}
          />
          <Input
          element= "input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(8)]}
          errorText="Please enter a valid password! (at least 8 characters)"
          onInput={inputHandler}
          /> 
          <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode?'LOGIN' : 'SIGNUP'}
          </Button>
          </form>
          <p>{ isLoginMode?'New here? Sign up today!':'Already have an account?' }</p>
          <Button inverse onClick={switchModeHandler} >SWITCH TO {isLoginMode?'SIGNUP' : 'LOGIN'}</Button>
        </Card>
        </React.Fragment>
        
    );
};


export default Auth;