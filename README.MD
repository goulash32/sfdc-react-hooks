# Description
A collection of React hooks that interface with the Salesforce REST API.

# Usage
## Salesforce Authentication
sfdc-react-hooks provides no mechanism for authentication. It is up to you to handle authentication and provide an Authorization token to sfdc-react-hooks.

## ForceProvider
All components that make use of the provided hooks must be direct or indirect descendents of a `<ForceProvider>`. `<ForceProvider>` accepts a _config_ property to specify the Salesforce _instanceUrl_, _apiVersion_ (defaults to 47.0), and _authToken_.

## Hooks
All hooks return an object with _data_, _loading_, and _error_ properties. _data_ contains the returned data from Salesforce in a format specific to the hook, _loading_ is a boolean that states whether the REST transaction is still in progress, and _error_ is either a collection of errors returned from Salesforce, or a non-Salesforce error thrown during the REST call.

### useDescribe(_sObjectType_)
Gets the metadata for the requested SObject type and stores it in _data_.

### useSOQL(_query_, _variables_)
Executes a SOQL query and returns the results in _data.records_.

### useSOSL(_searchString_, _variables_)
Executes a SOSL search and returns the results in _data.searchRecords_.

#### useSOQL and useSOSL Variables
Dynamic variables can be specified for queries and searches, similar to how they are handled in Apex. Presently, the only supported variable types are strings, numbers, and lists (of strings or numbers);

##### Variables Example 
```javascript
const QUERY_CONTACTS_IN_LIST = `
    SELECT Id, Name
    FROM Contact
    WHERE Id IN :contactIds
`;

...

const [queryVariables, setQueryVariables] = useState({
    contactIds: [
        'a040j000002sF4rAAE', 
        'a040j000002e0JEAAY', 
        'a040j000002e0K7AAI'
    ]
});
const { data, loading, error } = useSOQL(QUERY_CONTACTS_IN_LIST, queryVariables);
```

## Examples
### ForceProvider Example
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

## useSOQL( ) Example
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

### useSOSL( ) Example
```javascript
import React from 'react';
import { useSOSL } from 'sfdc-react-hooks';

// find some Jims in Accounts and Contacts
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

### useDescribe( ) Example
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
