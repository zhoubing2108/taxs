import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route,
} from 'react-router-dom'
import { AppContainer } from 'react-hot-loader';
import App from './pages/app';
import globalStore from './globalStore';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const root = document.getElementById('root');

const render = (Com) => {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  renderMethod(
    <AppContainer>
      <LocaleProvider locale={zh_CN}>
      <HashRouter>
        <Route render={props => <Com {...props} globalStore={globalStore} />} >
        </Route>
      </HashRouter>
      </LocaleProvider>
    </AppContainer>,
    root)
};

render(App);

if (module.hot) {
  module.hot.accept();
}