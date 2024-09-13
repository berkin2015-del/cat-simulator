export const handler = async (e) => {
    console.log(e);

    let responseTemplate = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Hello, World!" }),
    };

    const cognitoUserPoolId = process.env.USER_POOL_ID;
    const cognitoClientId = process.env.CLIENT_ID;
    const awsRegion = process.env.AWS_REGION;

    return responseTemplate;

};