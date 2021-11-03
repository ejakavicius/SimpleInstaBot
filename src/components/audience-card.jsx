import React, { useState } from 'react';
import { Card, Container, Dropdown } from 'semantic-ui-react';

const AudienceCard = ({ usersToFollowFollowersOf, onUsersToFollowFollowersOfChange }) => {
  const [hasEnoughInput, setHasEnoughInput] = useState(true);
  const options = usersToFollowFollowersOf.map((el) => ({ key: el, text: el, value: el }));
  const handleChange = (_, { value }) => {
    setHasEnoughInput(value.length >= 5);
    onUsersToFollowFollowersOfChange(value);
  };

  return (
    <Card fluid>
      <Card.Content header="2. Select Audience" />
      <Card.Content>
        <Container text style={{ paddingBottom: '1em' }}>
        Usernames of accounts whose followers bot should follow
        </Container>
        <Dropdown
          error={!hasEnoughInput}
          options={options}
          value={usersToFollowFollowersOf}
          onChange={handleChange}
          fluid
          search
          selection
          multiple
          allowAdditions
          style={{ minHeight: 76 }}
          noResultsMessage="Add at least five accounts e.g. @instagram"
          icon={null}
        />
      </Card.Content>
    </Card>

  );
};

export default AudienceCard;
