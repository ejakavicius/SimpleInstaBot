import React from 'react';
import { Button, Card, Item, Label } from 'semantic-ui-react';

const LoggedInCard = ({ userProfile, onLogoutClick, currentUsername }) => (
  <Card fluid>
    <Card.Content>
      <Button basic size="tiny" floated="right" icon="refresh" content="Switch Account" onClick={onLogoutClick} />
      <Card.Header content="1. Instagram Account" />
      <Item.Group>
        <Item>
          <Item.Image avatar size="tiny" src={userProfile.profilePicture} />
          <Item.Content verticalAlign="middle">
            <Item.Header content={currentUsername} />
            <Item.Description content={userProfile.fullName} />
            <Item.Extra>
              <Label content={`${userProfile.followersCount} followers`} />
              <Label content={`${userProfile.followCount} following`} />
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
    </Card.Content>
  </Card>
);

export default LoggedInCard;
