import React from 'react';
import { GraphQLClient, ClientContext } from 'graphql-hooks';
import {
  FieldGroup,
  TextInput,
  TextLink,
} from '@contentful/forma-36-react-components';

import ErrorBoundary from './ErrorBoundary';
import CampaignPreview from './CampaignPreview';
import useContentfulField from '../hooks/useContentfulField';

const graphql = new GraphQLClient({
  url: 'https://graphql.dosomething.org',
});

const App = props => {
  const [value, onChange] = useContentfulField(props.sdk);

  return (
    <ClientContext.Provider value={graphql}>
      <FieldGroup row={true} style={{ alignItems: 'center' }}>
        <TextInput
          type="number"
          width="large"
          placeholder="Paste a campaign ID here (e.g. 9001)..."
          value={value}
          onChange={onChange}
        />
        <TextLink
          icon="ChevronRight"
          href="https://activity.dosomething.org/campaign-ids"
        >
          Find a campaign ID...
        </TextLink>
      </FieldGroup>
      <ErrorBoundary>
        <CampaignPreview id={value} />
      </ErrorBoundary>
    </ClientContext.Provider>
  );
};

export default App;
