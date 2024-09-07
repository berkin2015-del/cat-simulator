# Cat Simulator

React js combined with CDK for AWS.

## deploying

This project is a bit diffrent from the others, everything is held together by hopes and dreams. Combined bothe React JS and CDK in the same environment. What could go wrong.

Make sure you have both node js and cdk install.

```bash
npm i
npm run deploy
```

see [package.json](package.json)

## Deploy Script

```ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

console.log('Building React App and Deploying to AWS');

const deploy = async () => {
    try {
        console.log('calling build react app 🐒');
        const { stdout: buildStdout } = await execPromise('npm run build');
        console.log(`Build Successfully: ${buildStdout}`);

        console.log('calling cdk deploy ✨');
        const { stdout: deployStdout } = await execPromise('cdk deploy --all');
        console.log(`Deployed Successfully: ${deployStdout}`);
    } catch (error) {
        const typedError = error as Error;
        console.error(`Error: ${typedError.message}`);
    }
};

deploy();
```
