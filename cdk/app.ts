import path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

const catSim = new cdk.Stack(new cdk.App(), "Cat-Simulator", {});
const catSimApi = new Construct(catSim, 'Cat Simulator Api');
const catSimStore = new Construct(catSim, 'Cat Simulator Storage');
const catSimInterface = new Construct(catSim, 'Cat Simulator Interface');

const websiteBucket = new cdk.aws_s3.Bucket(catSimStore, "Web Interface", {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new cdk.aws_s3_deployment.BucketDeployment(catSimStore, "Bucket interface deployment", {
    sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname, '../build'))],
    destinationBucket: websiteBucket,
    retainOnDelete: false,
    extract: true,
});

const chatTable = new cdk.aws_dynamodb.Table(catSimStore, 'Chat Table', {
    readCapacity: 3,
    writeCapacity: 3,
    partitionKey: {
        name: 'chatId',
        type: cdk.aws_dynamodb.AttributeType.STRING
    },
    sortKey: {
        name: 'timestamp',
        type: cdk.aws_dynamodb.AttributeType.STRING
    },
    timeToLiveAttribute: 'TTL',
    deletionProtection: true,
    billingMode: cdk.aws_dynamodb.BillingMode.PROVISIONED,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const apiFunction = new cdk.aws_lambda.Function(catSimApi, 'Api Function', {
    runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
    code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, './api-lambda')),
    handler: 'index.handler',
    timeout: cdk.Duration.seconds(10),
    environment: {
        CHAT_TABLE_NAME: chatTable.tableName,
    },
});

apiFunction.role?.attachInlinePolicy(new cdk.aws_iam.Policy(catSimApi, 'Bedrock policy for api', {
    statements: [new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["bedrock:InvokeModel"],
        resources: ['*'],
    }),],
}));

apiFunction.role?.attachInlinePolicy(new cdk.aws_iam.Policy(catSimApi, 'Dynamo DB policy for api', {
    statements: [new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["dynamodb:Query", "dynamodb:PutItem"],
        resources: [chatTable.tableArn],
    }),],
}));

new cdk.aws_logs.LogGroup(catSimApi, 'Api LogGroup', {
    logGroupName: `/aws/lambda/${apiFunction.functionName}`,
    retention: cdk.aws_logs.RetentionDays.ONE_DAY,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const api = new cdk.aws_apigateway.LambdaRestApi(catSimInterface, 'Api Gateway', {
    handler: apiFunction,
    proxy: false,
});
api.root.addResource('api').addResource('{proxy+}', {
    defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
    },
}).addMethod('ANY');

const dist = new cdk.aws_cloudfront.Distribution(catSimInterface, "Distribution for Site", {
    defaultRootObject: 'index.html',
    defaultBehavior: {
        origin: cdk.aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    },
    additionalBehaviors: {
        '/api/*': {
            origin: new cdk.aws_cloudfront_origins.RestApiOrigin(api, {
                originPath: '/prod',
            }),
            cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
            viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        }
    },
    errorResponses: [
        {
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: '/index.html',
            ttl: cdk.Duration.days(1),
        },
        {
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: '/index.html',
            ttl: cdk.Duration.days(1),
        }
    ]
});

new cdk.CfnOutput(catSim, 'CloudfrontDistributionUrl', {
    value: `https://${dist.distributionDomainName}/`,
});

new cdk.CfnOutput(catSim, 'CloudfrontDistributionID', {
    value: dist.distributionId,
});