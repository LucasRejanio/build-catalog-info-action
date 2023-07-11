const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const uploadFileToS3 = async (localFilePath, objectKey) => {
  const awsRegion = process.env.AWS_REGION
  const client = new S3Client({
    region: awsRegion,
  });

  try {
    const fileStream = fs.createReadStream(localFilePath);
    
    const catalogBucket = process.env.BACKSTAGE_CATALOG_BUCKET_NAME
    if (!catalogBucket) {
      throw new Error(`BACKSTAGE_CATALOG_BUCKET_NAME environment variable is not defined.`);
    }
    const uploadParams = {
      Bucket: catalogBucket,
      Key: objectKey,
      Body: fileStream,
    };

    const response = await client.send(new PutObjectCommand(uploadParams));

    console.log("[Info]:: File uploaded successfully!");
    console.log("[Info]:: ETag:", response.ETag);
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
};
