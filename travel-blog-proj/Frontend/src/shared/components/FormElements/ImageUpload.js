import React, {useRef, useState, useEffect} from 'react';
import Button from './Button';

import './ImageUpload.css';


const ImageUplaod=props=>{
    const filePickerRef= useRef(); //to not create ref that survives rerender cycles but to get a reference to the click method of the input that we set invisible so that we can access it using our button's onclick function

    const[file, setFile]=useState();
    const[previewUrl, setPreviewUrl]=useState();
    const[isValid, setIsValid]=useState(false);

   // in this we want to generate a preview of our picked image
    useEffect(()=>{   //whenever the file as a dependency changes, it rerenders
        if(!file)
        return;

        //now we have an file, we'll generate an image preview url with this built in browswer api
        const fileReader= new FileReader();
        fileReader.onload=()=>{  // we have to execute this function everytime fileReaer loads a new file or is done parsing a file //executes after 
             setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file); //create a url we can output(parsing a file) //executes first

    }, [file]);


    const pickImageHandler=()=>{
    filePickerRef.current.click();
    };


    //trigerred whenever we upload a file, we'll generate something in here that'll help us preview our file and also help in tranfer of it to componenets that need our imageUpload componenet 
    const pickedHandler=event=>{
     //event.target.files holds the files that the user selected
     let pickedFile;
     let fileIsValid=isValid;
     if(event.target.files && event.target.files.length===1)
     {
         pickedFile=event.target.files[0];
         setFile(pickedFile);
         setIsValid(true);
         fileIsValid=true;         
     }
     else{
         setIsValid(false);
         fileIsValid=false;  //because setIsValid wouldn't set right away, it'll schedule it so it would take time
     }
     props.onInput(props.id, pickedFile, fileIsValid);
     
    };

    
  return(
      <div className='form-control'>
      <input id={props.id}
       ref={filePickerRef} // reference set so that this input func can be accessed using this ref
       style={{display: 'none'}}
       type="file"
       accept=".jpg,.png,.jpeg" //accept is a default attribute you can add on type="file"
       onChange={pickedHandler}
       />
       <div className={`image-upload ${props.center && 'center'}`}>
           <div className="image-upload__preview">
           {previewUrl && <img src={previewUrl} alt="Preview"/>}
           {!previewUrl && <p>Please pick an image.</p>}
           </div>
           <Button type="button" onClick={pickImageHandler}>
               PICK IMAGE!
           </Button>
       </div>
       {!isValid && <p>{props.errorText}</p>}
      </div>
  );
};

export default ImageUplaod;
