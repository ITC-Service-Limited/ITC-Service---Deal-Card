import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  hubspot,
} from '@hubspot/ui-extensions';

const DEAL_LINK_PROPERTIES = [
  'edit_quote_in_sell',
  'view_opportunity_in_connectwise',
];

hubspot.extend(({ actions }) => <DealLinksCard actions={actions} />);

const DealLinksCard = ({ actions }) => {
  const { fetchCrmObjectProperties, onCrmPropertiesUpdate } = actions;
  const [propertyValues, setPropertyValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchCrmObjectProperties(DEAL_LINK_PROPERTIES)
      .then((properties) => {
        if (!isMounted) {
          return;
        }

        setPropertyValues(properties);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error?.message || 'Unable to load deal properties.');
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchCrmObjectProperties]);

  onCrmPropertiesUpdate(DEAL_LINK_PROPERTIES, (properties) => {
    setPropertyValues(properties);
  });

  const actionsList = [
    {
      label: 'Edit quote in Sell',
      url: toExternalUrl(propertyValues.edit_quote_in_sell),
    },
    {
      label: 'View opportunity in ConnectWise',
      url: toExternalUrl(propertyValues.view_opportunity_in_connectwise),
    },
  ].filter((action) => action.url);

  if (loading) {
    return <Text>Loading deal links...</Text>;
  }

  if (errorMessage) {
    return (
      <Alert title="Unable to load deal links" variant="error">
        {errorMessage}
      </Alert>
    );
  }

  return (
    <Flex direction="column" gap="md">
      <Heading>Open linked systems</Heading>
      <Text variant="microcopy">
        Use the links stored on this deal to jump straight into Sell or
        ConnectWise.
      </Text>

      <Divider />

      {actionsList.length > 0 ? (
        <Flex direction="column" gap="sm">
          {actionsList.map((action, index) => (
            <Button
              key={action.label}
              href={{
                url: action.url,
                external: true,
              }}
              variant={index === 0 ? 'primary' : 'secondary'}
            >
              {action.label}
            </Button>
          ))}
        </Flex>
      ) : (
        <Text>
          No valid action URLs are currently stored on this deal. Populate
          `edit_quote_in_sell` or `view_opportunity_in_connectwise` to show
          buttons here.
        </Text>
      )}
    </Flex>
  );
};

function toExternalUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  try {
    const parsed = new URL(value.trim());
    const isAllowedProtocol =
      parsed.protocol === 'http:' || parsed.protocol === 'https:';

    return isAllowedProtocol ? parsed.toString() : null;
  } catch (error) {
    return null;
  }
}
