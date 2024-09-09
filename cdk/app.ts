import path from 'path';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const catSimStack = new cdk.Stack(app, "Cat-Simulator", {});

const websiteBucket = new cdk.aws_s3.Bucket(catSimStack, "Web Interface", {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    // blockPublicAccess: new cdk.aws_s3.BlockPublicAccess({
    //     blockPublicAcls: false,
    //     blockPublicPolicy: false,
    //     ignorePublicAcls: false,
    //     restrictPublicBuckets: false
    // }),
    // websiteErrorDocument: 'index.html',
    // websiteIndexDocument: 'index.html',
});

const websiteBucketDeployment = new cdk.aws_s3_deployment.BucketDeployment(catSimStack, "Bucket interface deployment", {
    sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname, '../build'))],
    destinationBucket: websiteBucket,
    retainOnDelete: false,
    extract: true,
});

// websiteBucket.policy?.document!.addStatements(new cdk.aws_iam.PolicyStatement({
//     actions: ['s3:GetObject'],
//     effect: cdk.aws_iam.Effect.ALLOW,
//     resources: [`${websiteBucket.bucketArn}/*`],
//     principals: [new cdk.aws_iam.AnyPrincipal()],
// }));

// new cdk.CfnOutput(catSimStack, 'Bucket Website Url', {
//     value: websiteBucket.bucketWebsiteUrl,
// });

const apiLambdaFunction = new cdk.aws_lambda.Function(catSimStack, 'Api Function', {
    runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
    code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, './api-lambda')),
    handler: 'index.handler',
    timeout: cdk.Duration.seconds(10),
});

apiLambdaFunction.role?.attachInlinePolicy(new cdk.aws_iam.Policy(catSimStack, 'Bedrock policy for api', {
    statements: [
        new cdk.aws_iam.PolicyStatement({
            actions: ["bedrock:InvokeModel"],
            effect: cdk.aws_iam.Effect.ALLOW,
            resources: ['*'],
        }),
    ],
}));

new cdk.aws_logs.LogGroup(catSimStack, 'Api LogGroup', {
    logGroupName: `/aws/lambda/${apiLambdaFunction.functionName}`,
    retention: cdk.aws_logs.RetentionDays.ONE_DAY,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const api = new cdk.aws_apigateway.LambdaRestApi(catSimStack, 'Api Gateway', {
    handler: apiLambdaFunction,
    proxy: false,
});

const apiResource = api.root.addResource('api', {
    defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
    },
});
const proxyResource = apiResource.addResource('{proxy+}', {
    defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
    },
});
proxyResource.addMethod('ANY');


const dist = new cdk.aws_cloudfront.Distribution(catSimStack, "Distribution for Site", {
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
            ttl: cdk.Duration.days(1)
        },
        {
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: '/index.html',
            ttl: cdk.Duration.days(1)
        }
    ]
});

new cdk.CfnOutput(catSimStack, 'CloudfrontDistributionUrl', {
    value: `https://${dist.distributionDomainName}/`,
});

new cdk.CfnOutput(catSimStack, 'CloudfrontDistributionID', {
    value: dist.distributionId,
});