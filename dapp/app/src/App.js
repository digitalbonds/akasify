import React from "react";
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import store from "./store";
import drizzleOptions from "./drizzleOptions";
import Loader from "./components/loader/loader.component";

import "./App.css"

import LandingPage from './components/pages/landingPage.component'
import BeneficiaryPage from './components/pages/beneficiaryPage.component'
import OrganizationPage from './components/pages/organizationPage.component'

import Navbar from "./components/layout/navbar.component";
import { Layout, Row, Typography } from 'antd';
import StyledComponents from './styles';

const { StyledContent, ButtonsWrapper, StyledButton, Image, StyledColLeft, StyledColRight, RegisterWrapper } = StyledComponents;
const { Footer } = Layout;
const drizzle = new Drizzle(drizzleOptions, store);
const { DrizzleProvider } = drizzleReactHooks;

const App = () => {

  return (
    <DrizzleProvider drizzle={drizzle}>
      <Loader>
        <BrowserRouter>
          <Layout>
            <Navbar/>
            <StyledContent>
              <Switch>
                <Route exact path='/' component={LandingPage} />
                <Route exact path='/beneficiary' component={BeneficiaryPage} />
                <Route exact path='/organization' component={OrganizationPage} />
              </Switch>
              <Footer style={{ textAlign: 'center', bottom: '0px', width: '100%', background: '#F6EAD1' }}>© 2020 Created by Digital Bonds</Footer>
            </StyledContent>
          </Layout>
      </BrowserRouter>
      </Loader>
    </DrizzleProvider>
  );
}

export default App;
