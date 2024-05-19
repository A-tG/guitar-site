export const enum ColorTheme
{
    day = 1,
    night
}

export const themes = new Map([
    [ColorTheme.day, "day"],
    [ColorTheme.night, "night"]
]) as ReadonlyMap<ColorTheme, string>