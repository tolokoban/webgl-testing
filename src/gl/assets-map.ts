export default class AssetsMap<T> {
    private map = new Map<string, { count: number, value: T }>()

    /**
     * Warning!
     * If this function returns true,
     * it also increments the link counter on the found item.
     */
    exists(id: string): boolean {
        const { map } = this
        if (map.has(id)) {
            const item = map.get(id)
            if (item) item.count++
            return true
        }
        return false
    }

    get(id: string): T | undefined {
        const item = this.map.get(id)
        if (!item) return
        return item.value
    }

    /**
     * Warning!
     * If an item with the same id already exists,
     * this functioin will throw an exception.
     */
    add(id: string, value: T) {
        const item = this.map.get(id)
        if (!item) {
            this.map.set(id, { count: 1, value })
        } else {
            throw Error(`An item with id "${id}" already exists!`)
        }
    }

    /**
     * Remove an item from the map and return -1 if this item does not exist.
     * Otherwise, it will return the number of links still attached to this item.
     * 0 means that no one is using this item anymore and cleanup can be performed.
     */
    remove(id: string): number {
        const item = this.map.get(id)
        if (!item) return -1
        item.count--
        if (item.count <= 0) {
            this.map.delete(id)
        }
        return item.count
    }
}
