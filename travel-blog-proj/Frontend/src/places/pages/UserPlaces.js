import React, {useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {useHttpClient} from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {AuthContext} from '../../shared/context/auth-context';

// const DUMMY_PLACES = [
//     {
//       id: 'p1',
//       title: 'Empire State Building',
//       description: 'One of the most famous sky scrapers in the world!',
//       imageUrl:
//         'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
//       address: '20 W 34th St, New York, NY 10001',
//       location: {
//         lat: 40.7484405,
//         lng: -73.9878584
//       },
//       creator: 'u1'
//     },
//     {
//       id: 'p2',
//       title: 'Empire State Building',
//       description: 'One of the most famous sky scrapers in the world!',
//       imageUrl:
//         'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
//       address: '20 W 34th St, New York, NY 10001',
//       location: {
//         lat: 40.7484405,
//         lng: -73.9878584
//       },
//       creator: 'u2'
//     }
//   ];

const UserPlaces = props => {
  
  const auth = useContext(AuthContext);
  const{isLoading, error, sendRequest, clearError}=useHttpClient();
  const[loadedPlaces, setLoadedPlaces]=useState();

  const userId= useParams().userId;
    
  useEffect(()=>{
   const fetchPlaces= async ()=>{
     
     try{
      const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
      if(responseData.places.length===0)
      {   if(auth.userId===userId)
        setLoadedPlaces(responseData.places);
      }
      else
      {
       setLoadedPlaces(responseData.places);
      }
      
     }catch(err){ }
   }
   fetchPlaces();
  }, [sendRequest, userId, auth]);

   const placeDeletedHandler=deletePlaceId=>{
       setLoadedPlaces(prevPlace=> prevPlace.filter(place=>place.id!==deletePlaceId));
   } 
 
    return(
         <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
         {isLoading && (<div className="center"><LoadingSpinner/></div>) }
         {!isLoading && loadedPlaces &&(
         <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>)}
         </React.Fragment>
    );
  };

export default UserPlaces ;
