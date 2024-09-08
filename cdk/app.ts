import path from 'path';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const catSimStack = new cdk.Stack(app, "Cat-Simulator-Stack", {});

const websiteBucket = new cdk.aws_s3.Bucket(catSimStack, "Web Interface", {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    blockPublicAccess: new cdk.aws_s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
    }),
    websiteErrorDocument: 'index.html',
    websiteIndexDocument: 'index.html',
});

const websiteBucketDeployment = new cdk.aws_s3_deployment.BucketDeployment(catSimStack, "Bucket interface deployment", {
    sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname, '../build'))],
    destinationBucket: websiteBucket,
    retainOnDelete: false,
    extract: true,
});

websiteBucket.policy?.document!.addStatements(new cdk.aws_iam.PolicyStatement({
    actions: ['s3:GetObject'],
    effect: cdk.aws_iam.Effect.ALLOW,
    resources: [`${websiteBucket.bucketArn}/*`],
    principals: [new cdk.aws_iam.AnyPrincipal()],
}));

new cdk.CfnOutput(catSimStack, 'Bucket Website Url', {
    value: websiteBucket.bucketWebsiteUrl,
});

const apiLambdaFunction = new cdk.aws_lambda.Function(catSimStack, 'Api Function', {
    runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
    code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, './api-lambda')),
    handler: 'index.handler',
});

new cdk.aws_logs.LogGroup(catSimStack, 'Api LogGroup', {
    logGroupName: `/aws/lambda/${apiLambdaFunction.functionName}`,
    retention: cdk.aws_logs.RetentionDays.ONE_DAY,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const api = new cdk.aws_apigateway.LambdaRestApi(catSimStack, 'Api Gateway', {
    handler: apiLambdaFunction,
    proxy: false,
});

const apiResource = api.root.addResource('api');
const apiSendResource = apiResource.addResource('{proxy+}');
apiSendResource.addMethod('ANY');
