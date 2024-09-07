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