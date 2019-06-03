import React from 'react';
import { GraphQLClient, ClientContext, useQuery } from 'graphql-hooks';
import {
  FieldGroup,
  TextInput,
  TextLink,
} from '@contentful/forma-36-react-components';

import CampaignPreview from './CampaignPreview';
import ErrorBoundary from './ErrorBoundary';

const graphql = new GraphQLClient({
  url: 'https://graphql.dosomething.org',
});

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

export default App;
