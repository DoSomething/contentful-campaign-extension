import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { format, parseISO } from 'date-fns';
import { init } from 'contentful-ui-extensions-sdk';
import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import {
  FieldGroup,
  TextInput,
  TextLink,
  EntryCard,
  Note,
} from '@contentful/forma-36-react-components';

import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const graphql = new ApolloClient({
  uri: 'https://graphql.dosomething.org',
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

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

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
    const id = Number(this.state.value);

    return (
      <ApolloProvider client={graphql}>
        <FieldGroup row={true} style={{ alignItems: 'center' }}>
          <TextInput
            type="text"
            width="large"
            id="campaign-id"
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
        <Query query={CAMPAIGN_QUERY} variables={{ id }}>
          {({ loading, error, data }) => {
            const campaign = data.campaign;

            if (loading) {
              return <EntryCard isLoading={loading} />;
            }

            if (!campaign || error) {
              return (
                <Note noteType="warning">This isn't a valid campaign ID.</Note>
              );
            }

            const startDate = format(parseISO(campaign.startDate), 'PP');
            const endDate = campaign.endDate
              ? format(parseISO(campaign.endDate), 'PP')
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
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
