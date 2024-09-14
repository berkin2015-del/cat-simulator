echo 'building react app 🐒'
npm run build

echo 'cdk deploying ✨'
cdk deploy --all

echo 'invalidating cloudfront 🚫'
DIST_ID=$(aws cloudformation describe-stacks --stack-name Cat-Simulator | jq '.Stacks | .[] | .Outputs | reduce .[] as $i ({}; .[$i.OutputKey] = $i.OutputValue)| .CloudfrontDistributionID ' -r)
echo 'using' $DIST_ID
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths '/*'