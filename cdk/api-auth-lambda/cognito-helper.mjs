import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";


export const signIn = async (params) => {
    if (!params.username || !params.password) {
        return null
    };
    const cognitoClient = new CognitoIdentityProviderClient({
        region: props.region
    });
    const authResault = await cognitoClient.send(new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: params.clientId,
    }));

}