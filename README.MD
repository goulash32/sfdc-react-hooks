# Description
A collection of React hooks that interface with the Salesforce REST API.

# Usage
## Salesforce Authentication
sfdc-react-hooks provides no mechanism for authentication. It is up to you to handle authentication and provide an Authorization token to sfdc-react-hooks.

## ForceProvider
All children that make use of the provided hooks must be wrapped in a <ForceProvider>. ForceProvider accepts a _config_ property to specify the Salesforce _instanceUrl_, _apiVersion_ (defaults to 47.0) and _authToken_:

## ForceProvider Example
```javascript
import React from 'react';
import { ForceProvider } from 'sfdc-react-hooks';
import QueryExample from './QueryExample';
import SearchExample from './SearchExample';
import DescribeExample from './DescribeExample';

const config = {
    instanceUrl: 'https://yourdomain.my.salesforce.com',
    apiVersion: 45, // default is 47
    authToken: '*your token here*' // token only, omit "Bearer "
};

const App = () => {
    return (
        <ForceProvider config={config}>
            <QueryExample />
            <SearchExample />
            <DescribeExample />
        </ForceProvider>
    )
};

export default App;
```

## SOQL Example
```javascript
import React from 'react';
import { useSOQL } from 'sfdc-react-hooks';

// get up to 10 Jims
const TEN_JIMS = `
    SELECT Id, Name
    FROM Contact
    WHERE (Name LIKE 'Jim%')
    LIMIT 10
`;

const QueryExample = () => {
    const { data, loading, error } = useSOQL(TEN_JIMS);

    if(data) {
        return (
            <ul>
                { 
                    data.records.map(jim => 
                        <li key={jim.Id}>
                            {jim.Name}
                        </li>
                    ) 
                }
            </ul>
        );
    }

    if(loading) {
        // handle loading state here
    }

    if(error) {
        // handle error here
    }
};

export default QueryExample;
```

## SOSL Example
```javascript
import React from 'react';
import { useSOSL } from 'sfdc-react-hooks';

// get up to 10 Jims
const SEARCH_ACCOUNTS_CONTACTS = `
    FIND {Jim*}
    IN NAME FIELDS
    RETURNING Contact(Id, Name), Account(Id, Name)
`;

const SearchExample = () => {
    const { data, loading, error } = useSOSL(SEARCH_ACCOUNTS_CONTACTS);

    if(data) {
        return (
            <ul>
                { 
                    data.searchRecords.map(record => (
                        <li key={record.Id}>
                            {record.attributes.type}: {record.Name}
                        </li>
                    )
                }
            </ul>
        );
    }

    if(loading) {
        // handle loading state here
    }

    if(error) {
        // handle error here
    }
};

export default SearchExample;
```

## SObject Describe Example
```javascript
import React from 'react';
import { useDescribe } from 'sfdc-react-hooks';

const DescribeExample = () => {
    const { data, loading, error } = useDescribe('Contact');

    if(data) {
        return (
            <div>
                <ul>
                    {
                        data.fields.map(field => 
                            <li key={field.label}>
                                {field.label}
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }

    if(loading) {
        // handle loading state here
    }

    if(error) {
        // handle error here
    }
};

export default DescribeExample;
```
