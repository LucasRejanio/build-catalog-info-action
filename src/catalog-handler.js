const builder = require('./utils/builder')
const s3 = require('./utils/s3')

async function catalogEntity(params) {
    const applicationType = process.env.APPLICATION_TYPE;
    if (!applicationType) {
        throw new Error('APPLICATION_TYPE environment variable is not defined.');
    } 
    
    if (applicationType === 'workload') {
        try {
            const componentFileName = await builder.buildComponent();
            s3.uploadFileToS3(componentFileName, `components/${componentFileName}`);
        } catch (error) {
            throw error;
        }
    } else if (applicationType === 'openapi') {
        console.log("[Info]:: APPLICATION_TYPE openapi not supported yet.");
    } else {
        throw new Error('APPLICATION_TYPE must be either "openapi" or "workload".');
    }
}

module.exports = {
    catalogEntity
}
