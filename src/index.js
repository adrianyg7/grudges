import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Application from './Application';

import Amplify from 'aws-amplify';
import config from './aws-exports';

const awsmobile =  {
    "aws_appsync_graphqlEndpoint": "https://kcclpryi25dnvad4su4war2icu.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-l3q5tnzdmbcddgk6pgo4pckz74",
};

Amplify.configure({ ...config, ...awsmobile });

ReactDOM.render(<Application />, document.getElementById('root'));
