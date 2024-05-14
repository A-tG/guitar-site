export function getDistanceFromNut(scaleWidth: number, fretNumber: number)
{
    if ((scaleWidth <= 0) || (fretNumber < 0)) throw new Error()

    if (fretNumber == 0) return 0

    return scaleWidth - (scaleWidth / Math.pow(2, fretNumber / 12))
}

export function getFretWidth(scaleWidth: number, fretNumber: number)
{
    if (fretNumber < 1) throw new Error()

    return getDistanceFromNut(scaleWidth, fretNumber) - getDistanceFromNut(scaleWidth, fretNumber - 1)
}