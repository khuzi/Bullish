import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';
import { ROUTES } from '../../const';
 
// handle the public routes
function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: ROUTES.MARKET }} />}
    />
  )
}
 
export default PublicRoute;