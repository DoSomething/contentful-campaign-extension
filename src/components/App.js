import React from 'react';
import {
  FieldGroup,
  TextInput,
  TextLink,
} from '@contentful/forma-36-react-components';

import ErrorBoundary from './ErrorBoundary';
import CampaignPreview from './CampaignPreview';
import useContentfulField from '../hooks/useContentfulField';

const App = ({ sdk, northstarUrl }) => {
  const [value, onChange] = useContentfulField(sdk);

  return (
    <>
      <FieldGroup row={true} style={{ alignItems: 'center' }}>
        <TextInput
          type="number"
          width="large"
          placeholder="Paste a campaign ID here (e.g. 9001)..."
          value={value || ''}
          onChange={onChange}
        />
        <TextLink
          target="_blank"
          icon="ChevronRight"
          href={`${northstarUrl}/admin/campaigns`}
        >
          Find a campaign ID...
        </TextLink>
      </FieldGroup>
      <ErrorBoundary>
        <CampaignPreview id={value} northstarUrl={northstarUrl} />
      </ErrorBoundary>
    </>
  );
};

export default App;
