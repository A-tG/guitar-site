export function lerp(from: number, to: number, value: number)
{
    return from * (1 - value) + to * value
}

export function isPowerOfTwo(val: number)
{
    return (val != 0) && ((val & (val - 1)) == 0)
}