import path from 'path';
import * as cdk from 'aws-cdk-lib';

export const app = new cdk.App();

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