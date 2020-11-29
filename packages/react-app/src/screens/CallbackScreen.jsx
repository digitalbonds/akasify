import React, { useState, useEffect } from 'react'
import { Redirect, useHistory, withRouter } from 'react-router-dom'
import { Layout } from 'antd'
import * as moment from 'moment'
import { parcelConfig } from '../helpers/parcelConfig'
import { OidcClient, Log } from 'oidc-client'
import jwt_decode from 'jwt-decode'

const { Content, Footer } = Layout

function CallbackScreen() {

    const [logIn, setLogIn] = useState(false);
    const oidcClient = new OidcClient(parcelConfig);
    let history = useHistory();

    useEffect(() => {
        let callback = async () => {
          if (logIn) return;
          
          const response = await oidcClient.processSigninResponse(window.location.href);
          const access_token = response.access_token;
          const idToken = response.id_token;
          const decoded = jwt_decode(idToken);
          const address = decoded.sub;
          localStorage.setItem('akasify-oasis-address', address);
          localStorage.setItem('akasify-oasis-token', access_token);

          console.log("history, ", history);

          setLogIn(true);
        };
    
        callback();
      }, [logIn]);

      return logIn ? <Redirect to={localStorage.getItem('akasify-oasis-previous')} /> : '';
}

export default withRouter(CallbackScreen);