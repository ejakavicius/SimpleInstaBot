import React, { memo, useEffect, useRef } from 'react';
import moment from 'moment';
import { Card, Message } from 'semantic-ui-react';

const LogView = memo(({ logs = [], style, fontSize } = {}) => {
  const logViewRef = useRef();
  useEffect(() => {
    if (logViewRef.current) logViewRef.current.scrollTop = logViewRef.current.scrollHeight;
  }, [logs]);

  if (logs.length === 0) {
    return (
      <Message
        info
        header="No logs"
        content="There are no logs to display for this session."
      />
    );
  }

  return (
    <Card fluid>
      <Card.Content>
        <div ref={logViewRef} style={{ width: '100%', height: 100, overflowY: 'scroll', overflowX: 'hidden', textAlign: 'left', ...style }}>
          {logs.map(({ args, level, time }, i) => {
            const color = {
              warn: '#f37121',
              error: '#d92027',
            }[level] || 'rgba(0,0,0,0.6)';

            return (
            // eslint-disable-next-line react/no-array-index-key
              <div key={i}>
                <span style={{ marginRight: 5, whiteSpace: 'pre-wrap', fontSize }}>{moment(time).format('LT')}</span>
                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize, color }}>
                  {args.map(arg => String(arg)).join(' ')}
                </span>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
});

export default LogView;
