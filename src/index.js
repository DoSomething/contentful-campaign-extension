import React from 'react';
import { get } from 'lodash';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import { GraphQLClient, ClientContext } from 'graphql-hooks';

import App from './components/App';

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const graphQLUrls = {
  dev: 'https://graphql-dev.dosomething.org',
  qa: 'https://graphql-qa.dosomething.org',
  master: 'https://graphql.dosomething.org',
};

const northstarUrls = {
  dev: 'https://identity-dev.dosomething.org',
  qa: 'https://identity-qa.dosomething.org',
  master: 'https://identity.dosomething.org',
};

init(sdk => {
  // Choose the appropriate GraphQL environment to query:
  const environment = sdk.contentType.sys.environment.sys.id;
  const graphql = new GraphQLClient({ url: get(graphQLUrls, environment) });
  const northstarUrl = get(northstarUrls, environment);

  ReactDOM.render(
    <ClientContext.Provider value={graphql}>
      <App sdk={sdk} northstarUrl={northstarUrl} />
    </ClientContext.Provider>,
    document.getElementById('root'),
  );
});
