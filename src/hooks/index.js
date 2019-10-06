import { useEffect } from 'react';
import Axios from 'axios';
import urlencode from 'urlencode';
import { useForceContext, useDefaultStates } from '../util';

const useSearchOrQuery = (searchOrQuery, search) => {
    const forceContext = useForceContext();
    const {
        loadingState: [loading, setLoading],
        errorState: [error, setError],
        dataState: [data, setData]
    } = useDefaultStates();
    const { config: { instanceUrl, authToken, apiVersion } } = forceContext;
    searchOrQuery = searchOrQuery.trim();
    searchOrQuery = urlencode.encode(searchOrQuery);
    useEffect(() => {
        setLoading(true);
        Axios.get(`${instanceUrl}/services/data/v${apiVersion}/${search ? 'search' : 'query'}?q=${searchOrQuery}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(({ data }) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response) {
                    setError(error.response);
                }
                else {
                    setError(error);
                }
                setLoading(false);
            });
    }, [instanceUrl, authToken, apiVersion, searchOrQuery, setLoading, setError, setData, search]);
    return { loading, error, data };
}

const useSOQL = (query) => {
    return useSearchOrQuery(query, false);
};

const useSOSL = (search) => {
    return useSearchOrQuery(search, true);
}

const useDescribe = (sobject) => {
    const forceContext = useForceContext();
    const {
        loadingState: [loading, setLoading],
        errorState: [error, setError],
        dataState: [data, setData]
    } = useDefaultStates();
    const { config: { instanceUrl, authToken, apiVersion } } = forceContext;
    sobject = sobject.trim();
    sobject = urlencode.encode(sobject);
    useEffect(() => {
        setLoading(true);
        Axios.get(`${instanceUrl}/services/data/v${apiVersion}/sobjects/${sobject}/describe`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(({data}) => {
            setData(data);
            setLoading(false);
        })
        .catch((error) => {
            if(error.response) {
                setError(error.response);
            } else {
                setError(error);
            }
            setLoading(false);
        });
    }, [instanceUrl, authToken, apiVersion, sobject, setLoading, setError, setData]);

    return { loading, error, data };
};

export {
    useSOQL,
    useSOSL,
    useDescribe
}
