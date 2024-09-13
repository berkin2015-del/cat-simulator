import { InitiateAuthCommand, CognitoIdentityProviderClient, AuthFlowType, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_cognito-identity-provider_code_examples.html
export const initiateAuth = ({ username, password, clientId }) => {
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

export const signUp = ({ clientId, username, password, email }) => {
    const client = new CognitoIdentityProviderClient({});
    const command = new SignUpCommand({
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
    });

    return client.send(command);
};