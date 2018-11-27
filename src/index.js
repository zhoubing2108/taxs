import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router'
import { AppContainer } from 'react-hot-loader';
import App from './pages/app'

const root = document.getElementById('root');

const render = (Com) => {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  renderMethod(
    <AppContainer>
        <Com history={history}  />
    </AppContainer>,
    root)
};

render(App);

if (module.hot) {
  module.hot.accept();
}