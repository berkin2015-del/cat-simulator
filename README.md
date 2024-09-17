# Cat Simulator

React js combined with CDK for AWS.

## deploying

This project is a bit diffrent from the others, everything is held together by hopes and dreams. Combined bothe React JS and CDK in the same environment. What could go wrong.

Make sure you have both node js, aws cdk, aws cli, jq installed.

```bash
npm i
chmod +x deploy.sh
./deploy.sh
```

### Deploy Script

```bash
echo 'building react app 🐒'
npm run build

echo 'cdk deploying ✨'
cdk deploy --all

echo 'invalidating cloudfront 🚫'
DIST_ID=$(aws cloudformation describe-stacks --stack-name Cat-Simulator | jq '.Stacks | .[] | .Outputs | reduce .[] as $i ({}; .[$i.OutputKey] = $i.OutputValue)| .CloudfrontDistributionID ' -r)
echo 'using' $DIST_ID
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths '/index.html' '/settings'
```
