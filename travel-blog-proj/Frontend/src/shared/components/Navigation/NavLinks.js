import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';

import {AuthContext} from '../../context/auth-context';

import './NavLinks.css';

const NavLinks = props => {

   const auth= useContext(AuthContext); //useContext allows us to to tap into a context and listen to it and we get back an object 'auth' that will hold the latest context and this component will rerender whenever this context changes
    return <ul className="nav-links">
        <li>
           <NavLink to="/" exact>ALL USERS</NavLink> 
        </li>
        {auth.isLoggedIn && <li>
           <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
           <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>}
        {!auth.isLoggedIn &&<li>
           <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>}
        {auth.isLoggedIn &&<li>
           <button onClick={auth.logout}>LOG OUT</button>
        </li>}

    </ul>
  };

export default NavLinks;





  