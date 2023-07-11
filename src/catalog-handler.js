const builder = require('./utils/builder')
const s3 = require('./utils/s3')

async function catalogEntity(params) {
  const applicationType = process.env.APPLICATION_TYPE;
  if (!applicationType) {
    throw new Error('APPLICATION_TYPE environment variable is not defined.');
  } 
  
  if (applicationType === 'workload') {
    try {
      const componentFilePath = await builder.buildComponent();
      s3.uploadFileToS3(componentFilePath, `components/${componentFilePath}`);
    } catch (error) {
      throw error;
    }
  } else if (applicationType === 'openapi') {
    try {
      const componentFilePath = await builder.buildComponent(true);
      await s3.uploadFileToS3(componentFilePath, `components/${componentFilePath}`);

      const apiFilePath = await builder.buildApi();
      await s3.uploadFileToS3(apiFilePath, `api/${apiFilePath}`);
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error('APPLICATION_TYPE must be either "openapi" or "workload".');
  }
}

module.exports = {
  catalogEntity
}
