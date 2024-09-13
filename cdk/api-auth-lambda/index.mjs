import { signIn } from "./cognito-helper.mjs";

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

    if (!e.httpMethod === 'POST') {
        console.warn('Invalid HTTP request method, got:\n', e.httpMethod, ' ', e.path);
        responseTemplate.statusCode = 405;
        responseTemplate.body = JSON.stringify({ message: "~Meow! !!!" });
        return responseTemplate;
    };

    const rawRequestBody = e.body;
    if (!rawRequestBody) {
        console.warn("Missing Request Body, got:\n", e.body);
        responseTemplate.statusCode = 418;
        responseTemplate.body = JSON.stringify({ message: "~Meow!! !!" });
        return responseTemplate;
    };

    let requestBody;
    try {
        requestBody = JSON.parse(rawRequestBody);
    } catch {
        console.warn('Invalid Json body, got:\n', rawRequestBody);
        responseTemplate.statusCode = 400;
        responseTemplate.body = JSON.stringify({ message: "~Meow! ! !!" });
        return responseTemplate;
    };

    if (!requestBody.username || !requestBody.password) {
        console.warn('Missing username or password, got\n', requestBody);
        responseTemplate.statusCode = 422;
        responseTemplate.body = JSON.stringify({ message: "~Meow!!! !" });
        return responseTemplate;
    };

    // END Request precheck
    let authResault;
    try {
        authResault = await signIn({
            region: awsRegion,
            clientId: cognitoClientId,
            username: requestBody.username,
            password: requestBody.password,
        });
    } catch (err) {
        // Not exist user

        // Catch All Error
        console.error('Signin Auth Error\n', err)
        responseTemplate.statusCode = 500;
        responseTemplate.body = JSON.stringify({ message: "~Meow! !! !" });
        return responseTemplate;
    };

    responseTemplate.body = JSON.stringify(authResault);
    return responseTemplate;
};