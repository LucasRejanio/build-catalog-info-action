import "@actions/core"

import { catalogEntity } from './src/catalog-handler'

async function main() {
    try {
        catalogEntity()
    } catch (error) {
        throw Error(error)
    }
}

main()
