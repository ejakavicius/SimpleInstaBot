import React from 'react';
import { Card, Container, Dropdown } from 'semantic-ui-react';

const AudienceCard = ({ usersToFollowFollowersOf, onUsersToFollowFollowersOfChange }) => {
  const options = usersToFollowFollowersOf.map((el) => ({ key: el, text: el, value: el }));
  const handleChange = (_, { value }) => onUsersToFollowFollowersOfChange(value);

  return (
    <Card fluid>
      <Card.Content header="2. Select Audience" />
      <Card.Content>
        <Container text style={{ paddingBottom: '1em' }}>
        Usernames of accounts whose followers bot should follow
        </Container>
        <Dropdown
          options={options}
          value={usersToFollowFollowersOf}
          onChange={handleChange}
          fluid
          search
          selection
          multiple
          allowAdditions
          style={{ minHeight: 76 }}
          noResultsMessage="Add an account name e.g. @instagram"
          icon={null}
        />
      </Card.Content>
    </Card>

  );
};

export default AudienceCard;
