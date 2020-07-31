import {useState, useCallback, useEffect} from 'react';

export const useAuth=()=>{
    const[token, setToken]= useState(false);
    const[userId, setUserId]=useState(false);
  
   
  
    const login= useCallback((uid, token)=>{
      setToken(token);
      setUserId(uid);
      //accessing local storage to store user id and token
      //localstorage is a global js browser api, it takes a key and text (objects can be converted to string using stringify)
      localStorage.setItem('userData', JSON.stringify({ //setting the token
        userId: uid,
        token: token
      }));
    }, []);
  
    const logout= useCallback(()=>{
      setToken(null);
      setUserId(null);
      localStorage.removeItem('userData');
    }, []);
  
  
     //this will run only once when the component mounts
     useEffect(()=>{
      const storedData= JSON.parse(localStorage.getItem('userData')); //getting the token
      if(storedData && storedData.token)
      {
        login(storedData.userId, storedData.token);
      }
    }, [login]);

    return {token, login, logout, userId};
}