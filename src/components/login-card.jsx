import React from 'react';
import { Card, Form } from 'semantic-ui-react';

const LogInCard = ({ username, password, onUsernameChange, onPasswordChange }) => (
  <Card fluid>
    <Card.Content header="1. Instagram Account" />
    <Card.Content>
      <Form>
        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          isInvalid={username.length < 1}
          value={username}
          onChange={onUsernameChange}
          placeholder="Instagram username"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          value={password}
          isInvalid={password.length < 4}
          onChange={onPasswordChange}
          type="password"
          placeholder="Password"
        />
      </Form>
    </Card.Content>
  </Card>
);

export default LogInCard;
