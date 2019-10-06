import React, { createContext } from 'react';
const ForceContext = createContext({
  config: null
});

const ForceProvider = props => {
  let {
    config: {
      instanceUrl,
      authToken,
      apiVersion
    }
  } = props;
  apiVersion = apiVersion || 47;

  if (typeof apiVersion === 'number') {
    apiVersion = apiVersion.toFixed(1);
  }

  return React.createElement(ForceContext.Provider, {
    value: {
      config: {
        instanceUrl,
        authToken,
        apiVersion
      }
    }
  }, props.children);
};

export default ForceContext;
export { ForceProvider };