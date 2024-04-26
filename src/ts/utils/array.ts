export class ArrayUtils
{
    static previousValIndex<T>(arr: Array<T>, i: number): T | null
    {
        const len = arr.length
        if (len == 0) return null

        return --i < 0 ? arr[len - 1] : arr[i] 
    }

    static nextValIndex<T>(arr: Array<T>, i: number): T | null
    {
        const len = arr.length
        if (len == 0) return null

        return arr[++i % len]
    }

    static previousValue<T>(arr: Array<T>, val: T): T | null
    {
        let len = arr.length
        if (len == 0) return null

        let i = arr.indexOf(val)
        if (i == -1) return null

        return this.previousValIndex(arr, i)
    }

    static nextValue<T>(arr: Array<T>, val: T): T | null
    {
        if (arr.length == 0) return null

        let i = arr.indexOf(val)
        if (i == -1) return null

        return this.nextValIndex(arr, i)
    }

    static nextKey<Tkey, Tval>(map: Map<Tkey, Tval>, key: Tkey): Tkey | null
    {
        if (map.size == 0) return null

        const first = map.keys().next().value
        let result = first
        let isFound = false
        for (let [k] of map)
        {
            if (isFound)
            {
                result = k
                break
            }
            isFound = k === key
        }
        return isFound ? result : null
    }

    static prevKey<K, V>(map: Map<K, V>, key: K): K | null
    {
        const len = map.size
        if (len == 0) return null

        const first: K = map.keys().next().value
        const isFirstElement = first === key
        let result = first
        let last = first
        let isFound = isFirstElement

        if (isFirstElement)
        {
            return this.lastElement(map)?.[0] ?? null
        }
        
        for (const [k] of map)
        {
            isFound = k === key
            if (isFound)
            {
                result = last
                break
            }
            last = k
        }
        return isFound ? result : null
    }

    private static lastElement<K, V>(map: Map<K, V>): [K, V] | null
    {
        let result = null
        for (const val of map)
        {
            result = val
        }
        return result
    }
}