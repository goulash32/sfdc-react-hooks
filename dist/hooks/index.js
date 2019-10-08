import { useEffect, useRef } from 'react';
import Axios from 'axios';
import urlencode from 'urlencode';
import { useForceContext, useDefaultStates } from '../util';
const variableRegex = /:[A-z][A-z0-9]*/g;

const formatQueryList = interpolatedVariable => {
  if (!Array.isArray(interpolatedVariable)) {
    throw new Error('Invalid variable. Accepted types are strings, numbers, and arrays.');
  }

  const baseType = typeof interpolatedVariable[0];

  if (baseType !== 'string' && baseType !== 'number') {
    throw new Error('Lists can contain only strings and numbers.');
  }

  const allTypesMatch = interpolatedVariable.slice(1).every(iv => typeof iv === baseType);

  if (!allTypesMatch) {
    throw new Error('Invalid variable. All types in a list must match.');
  }

  const isNumberList = baseType === 'number';
  const formattedList = interpolatedVariable.map(value => isNumberList ? value : `'${value}'`);
  interpolatedVariable = `(${formattedList.join(', ')})`;
  return interpolatedVariable;
};

const interpolateVariables = (searchOrQuery, variables, isSearch) => {
  const foundVariableKeys = searchOrQuery.match(variableRegex);

  if (foundVariableKeys) {
    if (!variables) {
      throw new Error('Variables must be provided for dynamic query.');
    }

    foundVariableKeys.forEach(vk => {
      let interpolatedVariable = variables[vk.substr(1)];

      if (interpolatedVariable === undefined) {
        throw new Error('All interpolated variables must be present in variables argument.');
      }

      switch (typeof interpolatedVariable) {
        case 'string':
          interpolatedVariable = isSearch ? `{${interpolatedVariable}}` : `'${interpolatedVariable}'`;
          break;

        case 'object':
          interpolatedVariable = formatQueryList(interpolatedVariable);
          break;

        case 'number':
          break;

        default:
          throw new Error('Invalid variable. Accepted types are strings, numbers, and arrays.');
      }

      searchOrQuery = searchOrQuery.replace(vk, interpolatedVariable);
    });
  }

  return searchOrQuery;
};

const trimInterpolateAndUrlEncode = (searchOrQuery, variables, isSearch) => {
  searchOrQuery = searchOrQuery.trim();

  if (variables) {
    searchOrQuery = interpolateVariables(searchOrQuery, variables, isSearch);
  }

  searchOrQuery = urlencode.encode(searchOrQuery);
  return searchOrQuery;
};

const useSearchOrQuery = (searchOrQuery, variables, isSearch) => {
  const forceContext = useForceContext();
  const {
    loadingState: [loading, setLoading],
    errorState: [error, setError],
    dataState: [data, setData]
  } = useDefaultStates();
  const variableReference = useRef(variables);
  console.log(variableReference);

  if (JSON.stringify(variables) !== JSON.stringify(variableReference.current)) {
    variableReference.current = variables;
  }

  const {
    config: {
      instanceUrl,
      authToken,
      apiVersion
    }
  } = forceContext;
  searchOrQuery = trimInterpolateAndUrlEncode(searchOrQuery, variables, isSearch);
  useEffect(() => {
    setLoading(true);
    Axios.get(`${instanceUrl}/services/data/v${apiVersion}/${isSearch ? 'search' : 'query'}?q=${searchOrQuery}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then(({
      data
    }) => {
      setData(data);
      setLoading(false);
    }).catch(error => {
      if (error.response) {
        setError(error.response);
      } else {
        setError(error);
      }

      setLoading(false);
    });
  }, [instanceUrl, authToken, apiVersion, searchOrQuery, setLoading, setError, setData, isSearch, variableReference]);
  return {
    loading,
    error,
    data
  };
};

const useSOQL = (query, variables = null) => {
  return useSearchOrQuery(query, variables, false);
};

const useSOSL = (search, variables = null) => {
  return useSearchOrQuery(search, variables, true);
};

const useDescribe = sobject => {
  const forceContext = useForceContext();
  const {
    loadingState: [loading, setLoading],
    errorState: [error, setError],
    dataState: [data, setData]
  } = useDefaultStates();
  const {
    config: {
      instanceUrl,
      authToken,
      apiVersion
    }
  } = forceContext;
  sobject = trimInterpolateAndUrlEncode(sobject, null, false);
  useEffect(() => {
    setLoading(true);
    Axios.get(`${instanceUrl}/services/data/v${apiVersion}/sobjects/${sobject}/describe`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then(({
      data
    }) => {
      setData(data);
      setLoading(false);
    }).catch(error => {
      if (error.response) {
        setError(error.response);
      } else {
        setError(error);
      }

      setLoading(false);
    });
  }, [instanceUrl, authToken, apiVersion, sobject, setLoading, setError, setData]);
  return {
    loading,
    error,
    data
  };
};

export { useSOQL, useSOSL, useDescribe };