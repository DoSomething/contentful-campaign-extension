import React from 'react';
import ReactDOM from 'react-dom';
import dateFormat from 'dateformat';
import gql from 'tagged-template-noop';
import { init } from 'contentful-ui-extensions-sdk';
import { GraphQLClient, ClientContext, useQuery } from 'graphql-hooks';
import {
  FieldGroup,
  TextInput,
  TextLink,
  EntryCard,
  Note,
} from '@contentful/forma-36-react-components';

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const graphql = new GraphQLClient({
  url: 'https://graphql.dosomething.org',
});

const CAMPAIGN_QUERY = gql`
  query ContentfulCampaignExtension($id: Int!) {
    campaign(id: $id) {
      internalTitle
      startDate
      endDate
    }
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      <Note noteType="negative">Something went wrong!</Note>;
    }

    return this.props.children;
  }
}

const CampaignPreview = props => {
  const id = Number(props.id);

  if (!id) {
    return null;
  }

  const variables = { id };
  const { loading, error, data } = useQuery(CAMPAIGN_QUERY, { variables });

  if (loading) {
    return <EntryCard loading={true} />;
  }

  if (!data || !data.campaign || error) {
    return <Note noteType="warning">This isn't a valid campaign ID.</Note>;
  }

  const campaign = data.campaign;
  const startDate = dateFormat(new Date(campaign.startDate), 'shortDate');
  const endDate = campaign.endDate
    ? dateFormat(new Date(campaign.endDate), 'shortDate')
    : 'forever';

  return (
    <EntryCard
      title={campaign.internalTitle}
      contentType={`${startDate} – ${endDate}`}
      href={`https://activity.dosomething.org/campaign-ids/${id}`}
      onClick={() => alert('EntityListItem onClick')}
      size="small"
    />
  );
};

class App extends React.Component {
  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue(),
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange,
    );
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    this.setState({ value });
  };

  onChange = e => {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  render() {
    return (
      <ClientContext.Provider value={graphql}>
        <FieldGroup row={true} style={{ alignItems: 'center' }}>
          <TextInput
            type="number"
            width="large"
            placeholder="Paste a campaign ID here (e.g. 9001)..."
            value={this.state.value}
            onChange={this.onChange}
          />
          <TextLink
            icon="ChevronRight"
            href="https://activity.dosomething.org/campaign-ids"
          >
            Find a campaign ID...
          </TextLink>
        </FieldGroup>
        <ErrorBoundary>
          <CampaignPreview id={this.state.value} />
        </ErrorBoundary>
      </ClientContext.Provider>
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
