import { NotAuthorizedException, UserNotFoundException } from "@aws-sdk/client-cognito-identity-provider";

export const signInAction = async ({ responseTemplate, event, cognitoClientId, awsRegion }) => {

    if (!e.httpMethod === 'POST') {
        console.warn('Invalid HTTP request method, got:\n', e.httpMethod, ' ', e.path);
        responseTemplate.statusCode = 405;
        responseTemplate.body = JSON.stringify({ message: "~Meow! !!!" });
        return responseTemplate;
    };

    const rawRequestBody = event.body;
    if (!rawRequestBody) {
        console.warn("Missing Request Body, got:\n", event.body);
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
        authResault = await initiateAuth({
            region: awsRegion,
            clientId: cognitoClientId,
            username: requestBody.username,
            password: requestBody.password,
        });
        responseTemplate.body = JSON.stringify({
            message: 'Success',
            authResault: authResault,
        });
        return responseTemplate
    } catch (err) {
        // Not exist user
        if (err instanceof NotAuthorizedException) {
            console.warn('Failed signin attemp for user, InvalidPassword: ', username);
            responseTemplate.statusCode = 403;
            responseTemplate.body = JSON.stringify({ message: "Invalid Login" });
            return responseTemplate;
        };
        if (err instanceof UserNotFoundException) {
            console.warn('Failed signin attemp for user, Not Found: ', username);
            responseTemplate.statusCode = 404;
            responseTemplate.body = JSON.stringify({ message: "Invalid Login" });
            return responseTemplate;
        };
        // Catch All Error
        console.error('Signin Auth Error\n', err)
        responseTemplate.statusCode = 500;
        responseTemplate.body = JSON.stringify({ message: "~Meow! !! !" });
        return responseTemplate;
    };

}