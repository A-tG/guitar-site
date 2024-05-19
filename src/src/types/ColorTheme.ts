export const enum ColorTheme
{
    auto,
    day,
    night
}

export function isColorTheme(numb: number)
{
    return (numb >= ColorTheme.auto) && (numb <= ColorTheme.night)
}

export const themesNames = new Map([
    [ColorTheme.day, "day"],
    [ColorTheme.night, "night"]
]) as ReadonlyMap<ColorTheme, string>