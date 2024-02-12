import React from "react";

export function WsConnection(props: any) {
  React.useEffect(() => {
    const ws = new WebSocket(props.url);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      props.onOpen()
      props.onChannelOpened(function (message: any) {
        if (ws.readyState === 1) {
          ws.send(message);
        }
      })
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const json = JSON.parse(event.data);
        switch (json.type) {
          case 'accepted':
          case 'message':
            props.onMessage(json)
            break;
        }
      } catch (e) {
        console.error('Invalid JSON: ', event.data);
      }
    };

    ws.onclose = function (event) {
      console.log('WebSocket connection closed', ws.readyState, event);
      props.onClose()
    };

    ws.onerror = function (error:any) {
      console.log('WebSocket error: ', error);
      if (ws.readyState === 1) {  // open
        props.onError(error)
        ws.close(error);
      }
    };

    return function cleanup() {
      console.log('WebSocket connection cleanup');
    };
  }, []);

  return false
}