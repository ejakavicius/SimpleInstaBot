import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import OldUI from './old-ui';
import NewUI from './new-ui';

function Counter() {
  const [chosenUI, pickUI] = useState();

  return <NewUI />;


  if (!chosenUI) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button content="OLD UI" onClick={() => pickUI('old')} />
        <Button content="NEW UI" onClick={() => pickUI('new')} />
      </div>
    );
  }

  if (chosenUI === 'new') {
    return <NewUI />;
  }

  return <OldUI />;
}

export default Counter;
