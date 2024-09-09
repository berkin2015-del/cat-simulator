
export const handler = async (event) => {
    console.log(event)

    let returnContent = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Hello, World!" }),
    };

    let path = event.path;
    if (path !== '/api/chat') {
        return returnContent;
    };

    let rawRequestBody = event.body;
    if (rawRequestBody === null) {
        returnContent.statusCode = 400;
        return returnContent;
    };

    try {
        let requestBody = JSON.parse(rawRequestBody);
        if (!requestBody.hasOwnProperty('message')) {
            returnContent.statusCode = 400;
            returnContent.body = JSON.stringify({ message: "Missing Message" });
            return returnContent;
        };

        let message = requestBody.message;
        // TODO: Impliment bedrock
        returnContent.body = JSON.stringify({ message: message });







        return returnContent

    } catch (error) {
        console.log(error);
        returnContent.statusCode = 500;
        returnContent.body = JSON.stringify({ message: "Server Error" });
        return returnContent;
    };

};