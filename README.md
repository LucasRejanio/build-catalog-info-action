<img src="./assets/gear-icon.png" width="130">

# Build Catalog Info Action

This action is responsible for creating Backstage entities for the information catalog.

## How this Action it works?

This action creates yaml manifests in Backstage format based on environment variables. This variable is generated through another action called [export-metadata](https://github.com/will-bank/export-metadata-action). After generate the manifest, this action also push the file to storage s3, and then the manifest is loaded by backstage and the entity is cataloged.

## Example usage

```yaml
- name: Build Catalog Info
  uses: will-bank/build-catalog-info-action@main
```
