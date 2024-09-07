import path from 'path';
import * as cdk from 'aws-cdk-lib';

export const app = new cdk.App();

const catSimStack = new cdk.Stack(app, "Cat-Simulator-Stack", {});

const websiteBucket = new cdk.aws_s3.Bucket(catSimStack, "Web Interface", {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY
});

const websiteBucketDeployment = new cdk.aws_s3_deployment.BucketDeployment(catSimStack, "Bucket interface deployment", {
    sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname, '../build'))],
    destinationBucket: websiteBucket,
    retainOnDelete: false,
    extract: true,
});

