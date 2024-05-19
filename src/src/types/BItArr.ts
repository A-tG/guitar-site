export function toInt(arr: boolean[])
{
    return parseInt(arr.map((e) => +e).join(''), 2)
}

export function fromInt(number: number, size: number)
{
    if (size < 0) throw new RangeError

    if (number <= 0) throw new RangeError

    if (!Number.isInteger(number)) throw new Error

    const len = size
    let binArr = number.toString(2).split('')
    const binLen = binArr.length
    if (binArr.length < len)
    {
        for (let i = 0; i < (len - binLen); i++)
        {
            binArr.unshift('0');
        }
    } else
    {
        binArr = binArr.slice(binLen - len)
    }
    return binArr.map((el) => !!+el)
}