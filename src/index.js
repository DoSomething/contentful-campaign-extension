import React from 'react';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';

import App from './components/App';

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

init(sdk => {
  const root = document.getElementById('root');
  ReactDOM.render(<App sdk={sdk} />, root);
});
