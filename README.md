# Cat Simulator

React js combined with CDK for AWS.

## deploying

This project is a bit diffrent from the others, everything is held together by hopes and dreams. Combined bothe React JS and CDK in the same environment. What could go wrong.

Make sure you have both node js and cdk install.

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
```
