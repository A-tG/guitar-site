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

    static nextKey<Tkey, Tval>(map: Map<Tkey, Tval> | ReadonlyMap<Tkey, Tval>, key: Tkey): Tkey | null
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

export function sumArrElements(arr: ReadonlyArray<number>, to: number, from: number = 0)
{
    if (to < 0) throw new RangeError()

    let result = 0
    for (let i = 0; i < to; i++)
    {
        result += arr[i]
    }  
    return result
}

export function isArraysEqual<T>(arr1: ReadonlyArray<T>, arr2: ReadonlyArray<T>)
{
    const len1 = arr1.length
    const len2 = arr2.length
    if (len1 != len2) return false

    for (let i = 0; i < len1; i++)
    {
        if (arr1[i] != arr2[i]) return false
    }
    return true
}

export function exchangeArrValues<T>(arr1: Array<T>, arr2: Array<T>)
{
    const len1 = arr1.length
    const len2 = arr2.length
    if (len1 != len2) throw new RangeError()

    for (let i = 0; i < len1; i++)
    {
        const v1 = arr1[i]
        arr1[i] = arr2[i]
        arr2[i] = v1
    }
}

export function copyValues<T>(from: Array<T>, to: Array<T>)
{
    const len1 = from.length

    for (let i = 0; i < len1; i++)
    {
        to[i] = from[i]
    }
}

export function clearArr<T>(arr: T[])
{
    while(arr.length > 0)
    {
        arr.pop()
    }
}