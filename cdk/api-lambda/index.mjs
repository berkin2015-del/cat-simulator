exports.handler = async (event) => {
    console.log(event)
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/jso" },
        body: JSON.stringify({ message: "Hello, World!" }),
    };
};