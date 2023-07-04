const fs = require('fs');
const dotenv = require('dotenv');
const yaml = require('yaml')

dotenv.config();

async function buildComponent(params) {
    const catalogData = getCatalogData()
    
    // Create component object
    const componentObject = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: catalogData.applicationName,
          description: catalogData.applicationDescription,
          annotations: {
            'backstage.io/techdocs-ref': 'dir:.',
            ...extractAnnotationsFromEnv(),
          },
          tags: [catalogData.applicationLanguage, catalogData.applicationFramework],
          links: extractLinksFromEnv(),
        },
        spec: {
          type: catalogData.catalogDefinitionType,
          lifecycle: catalogData.catalogLifecycle,
          owner: catalogData.applicationOwner,
          system: 'unknown',
          dependsOn: extractDependsOnFromEnv(),
          providesApis: extractProvidesApisFromEnv(),
        },
    };

    // Convert object in a string formated to YAML format
    const fileContent = `${yaml.stringify(componentObject, null, 2)}`;

    // Write content in outputFile
    const outputFile = `${catalogData.applicationName}.yaml`;
    fs.writeFileSync(outputFile, fileContent);

    console.log(`[Info]:: Component ${outputFile} file generated successfully.`);

    return outputFile
}

function getCatalogData() {
    const requiredEnvVars = [
      'APPLICATION_NAME',
      'APPLICATION_DESCRIPTION',
      'APPLICATION_OWNER',
      'APPLICATION_LANGUAGE',
      'APPLICATION_FRAMEWORK',
      'CATALOG_DEFINITION_TYPE',
      'CATALOG_LIFECYCLE',
    ];
  
    const applicationData = {};
  
    for (const envVar of requiredEnvVars) {
      const value = process.env[envVar];
      if (!value) {
        throw new Error(`${envVar} environment variable is not defined.`);
      }
  
      if (envVar === 'CATALOG_LIFECYCLE' && value !== 'development' && value !== 'production') {
        throw new Error('CATALOG_LIFECYCLE must be either "development" or "production".');
      }
  
      if (envVar === 'APPLICATION_TYPE' && value !== 'openapi' && value !== 'workload') {
        throw new Error('APPLICATION_TYPE must be either "openapi" or "workload".');
      }
  
      applicationData[envVar.toLowerCase().replace(/_(\w)/g, (_, letter) => letter.toUpperCase())] = value;
    }
  
    return applicationData;
}

// Const to extract environment variables starting with ANNOTATION_*
const extractAnnotationsFromEnv = () => {
    const annotationEnvVars = Object.keys(process.env).filter((envVar) =>
      envVar.startsWith('CATALOG_ANNOTATIONS_')
    );
  
    const annotations = {};
    const prefixLength = 'CATALOG_ANNOTATIONS_'.length;
  
    annotationEnvVars.forEach((envVar) => {
      const key = envVar.substring(prefixLength).replace(/_/g, '/').toLowerCase();
      const value = process.env[envVar];
      annotations[key] = value;
    });
  
    return annotations;
};

// Const to extract environment variables starting with CATALOG_LINKS_*
function extractLinksFromEnv() {
    const linksEnvVars = Object.keys(process.env).filter((envVar) =>
        envVar.match(/^CATALOG_LINKS_\d+_URL$/)
    );
  
    const linksList = [];
  
    linksEnvVars.forEach((envVar, index) => {
        const linkValue = process.env[envVar];
  
        const linkObject = {
            url: linkValue,
            title: process.env[`CATALOG_LINKS_${index}_TITLE`] || '',
            icon: process.env[`CATALOG_LINKS_${index}_ICON`] || '',
        };
  
        linksList.push(linkObject);
    });
  
    return linksList;
}

// Const to extract environment variables starting with DEPENDSON_*
const extractDependsOnFromEnv = () => {
    const dependsOnEnvVars = Object.keys(process.env).filter((envVar) =>
        envVar.startsWith('CATALOG_DEPENDSON_')
    );
  
    const dependsOn = dependsOnEnvVars.map((envVar) => process.env[envVar]);
  
    return dependsOn;
}


// Const to extract environment variables starting with PROVIDESAPI_*
const extractProvidesApisFromEnv = () => {
    const providesApiEnvVars = Object.keys(process.env).filter((envVar) =>
        envVar.startsWith('CATALOG_PROVIDESAPIS')
    );
  
    const providesApis = providesApiEnvVars.map((envVar) => process.env[envVar]);
  
    return providesApis;
}

module.exports = {
    buildComponent
}
