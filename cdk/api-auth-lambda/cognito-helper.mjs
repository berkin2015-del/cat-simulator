import { InitiateAuthCommand, CognitoIdentityProviderClient, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_cognito-identity-provider_code_examples.html
const initiateAuth = ({ username, password, clientId }) => {
    if (!username || !password) {
        return null
    };
    const client = new CognitoIdentityProviderClient({});
    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
        ClientId: clientId,
    });

    return client.send(command);
};