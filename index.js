// const core = require("@actions/core")

const catalogHandler = require('./src/catalog-handler')

async function main() {
  try {
    catalogHandler.catalogEntity()
  } catch (error) {
    throw Error(error)
  }
}

main()
