export default class AssetsMap<T> {
    private lockedIds = new Set<string>()
    private map = new Map<string, { count: number, value: T }>()


    private async lockAsync(id: string): Promise<void> {
        const sleepDelay = 100
        const { lockedIds } = this
        while (lockedIds.has(id)) {
            await sleepAsync(sleepDelay)
        }
        lockedIds.add(id)
    }

    private unlock(id: string) {
        this.lockedIds.delete(id)
    }

    /**
     * If the ID already exist, the link counter is incremented and nothing else is done.
     * Otherwise, the async function `createValue` is called and its return is stored in the map.
     *
     * This function is thread-safe.
     * Fo the same ID, `createValue` is only called for the first call of `add`.
     */
    async addAsync(id: string, createValue: () => Promise<T>): Promise<T> {
        await this.lockAsync(id)
        try {
            const { map } = this
            if (map.has(id)) {
                const item = map.get(id)
                if (!item) throw Error("Impossible error on map!")
                item.count++
                return item.value
            }
            const value = await createValue()
            map.set(id, { count: 1, value })
            return value
        } finally {
            this.unlock(id)
        }
    }

    add(id: string, createValue: () => T): T {
        const { map } = this
        if (map.has(id)) {
            const item = map.get(id)
            if (!item) throw Error("Impossible error on map!")
            item.count++
            return item.value
        }
        const value = createValue()
        map.set(id, { count: 1, value })
        return value
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


async function sleepAsync(delayInMs: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, delayInMs))
}
