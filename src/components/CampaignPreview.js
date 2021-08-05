import React from 'react';
import dateFormat from 'dateformat';
import gql from 'tagged-template-noop';
import { useQuery } from 'graphql-hooks';
import { EntryCard, Note } from '@contentful/forma-36-react-components';

const CAMPAIGN_QUERY = gql`
  query ContentfulCampaignExtension($id: Int!) {
    campaign(id: $id) {
      internalTitle
      startDate
      endDate
    }
  }
`;

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
      size="small"
      title={campaign.internalTitle}
      contentType={`${startDate} – ${endDate}`}
      href={`${props.northstarUrl}/admin/campaigns/${id}`}
      target="_blank"
    />
  );
};

export default CampaignPreview;
