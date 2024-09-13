import { signInAction } from "./login.mjs";

export const handler = async (e) => {
    console.log(e);

    let responseTemplate = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Meow!" }),
    };

    const cognitoClientId = process.env.CLIENT_ID;
    const awsRegion = process.env.AWS_REGION;

    if (!cognitoClientId || !awsRegion) {
        console.error('ENV invalid UserPoolID: ', cognitoUserPoolId, ' Client ID: ', cognitoClientId, ' AWS Region: ', awsRegion);
        responseTemplate.statusCode = 500;
        responseTemplate.body = JSON.stringify({ message: "~Meow!!!!" });
        return responseTemplate;
    };

    if (e.path === '/api/auth') {
        return await signInAction({
            event: e,
            awsRegion: awsRegion,
            cognitoClientId: cognitoClientId,
            responseTemplate: responseTemplate,
        });
    };

    if (e.path === '/api/auth')

        responseTemplate.body = JSON.stringify(authResault);
    return responseTemplate;
};