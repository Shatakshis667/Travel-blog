// for http requests and responses

import {useState, useCallback, useRef, useEffect} from 'react';

export const useHttpClient=()=>{

    const[error, setError]= useState();
    const[isLoading, setIsLoading] = useState(false);

    //in case if we send a req but immediately change the page, so we want to cancel the ongoing req 
    const activeHttpRequests= useRef([]); //useRef will not have it re initialize each time


    const sendRequest= useCallback( async (url, method="GET", body=null, headers={} )=>{ //callback so that this function doesnt get recreated and it doesnt have infinite rerender cycle
    setIsLoading(false);
    const httpAbortCntrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCntrl);


    try{const response= await fetch(url,{
                   method,
                   headers,
                   body,
                   signal: httpAbortCntrl.signal
               }
               );
               const responseData= await response.json(); //parsing the response body

               activeHttpRequests.current= activeHttpRequests.current.filter(
                   reqCtrl=> reqCtrl!==httpAbortCntrl)

               if(!response.ok)
               {
                   throw new Error(responseData.message); //if we get a res msg like user already exists or something
               }        
               setIsLoading(false);
    return responseData;           
    }catch(err){
        setIsLoading(false);
        setError(err.message);
        throw err;
    }
    },[]);
   
    const clearError=()=>{
        setError(null);
    };

    useEffect(()=>{
        return ()=>{ //works as a cleanup function before the useEffect runs again or the component that uses useEffect unmounts
        activeHttpRequests.current.forEach(abortcntrl=> abortcntrl.abort());
        };
    }, []);
    return {isLoading, error, sendRequest, clearError};
}


