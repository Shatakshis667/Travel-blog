import React, {useEffect, useState} from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {useHttpClient} from '../../shared/hooks/http-hook';
import Button from '../../shared/components/FormElements/Button';
import './bg.css';

const Users = () => {

  const{isLoading, error, sendRequest, clearError}=useHttpClient();
  const[loadedUsers, setLoadedUsers] = useState();
  const[searchedUsers, setSearchedUsers] = useState();
  const[isClicked, setIsClicked]=useState(false);
  const[text, setText]=useState();


  // const USERS = [
  //   {
  //     id: 'u1',
  //     name: 'Shatakshi',
  //     image: 'data:image/jpeg;base64,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',
  //     places: 2
  //   }
  // ];

  useEffect(()=>{   // rerenders only when some dependencies change
    const fetchUsers=async ()=>{
      
     try{
      const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users');  // we're not sending any data so no attached headers and bosy needed
    
      setLoadedUsers(responseData.users);
     }catch(err){
     }
     
    };
    fetchUsers();  

  }, [sendRequest]); //array contains the list of dependencies on the change of which it is supposed to rerender, although we'll keep it empty because we want to rerun it just once

  const searchClickHandler=event=>{
    setText(event.target.value);
  }

  const searchHandler=event=>{
      setIsClicked(true);
      setSearchedUsers(loadedUsers);
      const key=text.toLowerCase();
      setSearchedUsers(allusers=> allusers.filter(user=>user.name.toLowerCase()===key));
    
  }

  const cancelSearchHandler=event=>{
    setIsClicked(false);
  }

  return(
   <React.Fragment>
      
    <ErrorModal  error={error} onClear={clearError}/>
    {isLoading && <div className="center">
      <LoadingSpinner/>
      </div>}
      
    {!isLoading && loadedUsers && !isClicked && <UsersList items={loadedUsers}/>}
    <div className='search-bar'>
                
                <input
                 className="search-bar-input"
                 type="text"
                 placeholder="Search user..."
                 onChange={searchClickHandler}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                
                <Button
                 onClick={searchHandler}
                >Search</Button>
                <Button
                onClick={cancelSearchHandler}
                >Cancel</Button>
            </div>
            
    {isClicked && <UsersList items={searchedUsers}/>}
    </React.Fragment>
    
    );
};

export default Users;