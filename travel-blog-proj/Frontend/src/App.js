// root component - at the top of the component heirarchy 
import React, {Suspense} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
// import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import {AuthContext} from './shared/context/auth-context';
import {useAuth} from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users=React.lazy(()=>import('./user/pages/Users'));
const NewPlace=React.lazy(()=>import('./places/pages/NewPlace'));
const UpdatePlace=React.lazy(()=>import('./places/pages/UpdatePlace'));
const Auth=React.lazy(()=>import('./user/pages/Auth'));
const UserPlaces=React.lazy(()=>import('./places/pages/UserPlaces'));


//import './bg.css';


const App = () => {

  const {token, login, logout, userId}= useAuth(); 

  let routes; //new variable

  if(token){ //the state we're managing to check login 
   routes=(
    <Switch>
    <Route path="/" exact>
      <Users />
    </Route>
    <Route path="/:userId/places" exact>
      <UserPlaces/>
    </Route>
    <Route path="/places/new" exact>
       <NewPlace />
    </Route>
    <Route path="/places/:placeId" exact> 
       <UpdatePlace />
    </Route>
    <Redirect to="/" />
  </Switch>
   );
  }
  else{
    routes=(
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/auth" exact> 
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>

    );
  }

  return (
    //AuthContext is an object which has a property Provider which is a React component
    <AuthContext.Provider 
    value={{
      isLoggedIn: !!token,
       token:token,
       userId: userId,
       login: login,
       logout: logout 
      }} 
    >
    
    <Router>
      <MainNavigation/>
      <main>
        <Suspense fallback={<div className="center"><LoadingSpinner/></div>}>{routes}</Suspense>
      </main>
    </Router>
    
    </AuthContext.Provider> 

  );
};

export default App;
