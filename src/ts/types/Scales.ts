const intervals = new Map([
    ["major", [2, 2, 1, 2, 2, 2, 1]],
    ["minor", [2, 1, 2, 2, 1, 2, 2]],
    ["harmonic_min", [2, 1, 2, 2, 1, 3, 1]],
    ["chromatic", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    ["dorian", [2, 1, 2, 2, 2, 1, 2]],
    ["phrygian", [1, 2, 2, 2, 1, 2, 2]],
    ["phrygian_dom", [1, 3, 1, 2, 1, 2, 2]],
    ["lydian", [2, 2, 2, 1, 2, 2, 1]],
    ["myxolydian", [2, 2, 1, 2, 2, 1, 2]],
    ["locrian", [1, 2, 2, 1, 2, 2, 2]],
    ["melodic_min", [2, 1, 2, 2, 2, 2, 1]],
    ["alt_dom", [1, 2, 1, 2, 2, 2, 2]],
    ["blues_min_hex", [3, 2, 1, 1, 3, 2]],
    ["blues_pent", [3, 2, 1, 4, 2]],
    ["blues", [3, 2, 1, 1, 3, 1, 1]],
    ["major_pent", [2, 2, 3, 2, 3]],
    ["suspended_pent", [2, 3, 2, 3, 2]],
    ["phrygian_pent", [3, 2, 3, 2, 2]],
    ["myxolydian_pent", [2, 3, 2, 2, 3]],
    ["aeolian_pent", [3, 2, 2, 3, 2]],
    ["major_beb", [2, 2, 1, 2, 1, 1, 2, 1]],
    ["minor_beb", [2, 1, 1, 1, 2, 2, 1, 2]],
    ["dom_beb", [2, 2, 1, 2, 2, 1, 1, 1]],
    ["whole_tone", [2, 2, 2, 2, 2, 2]],
    ["whole_half_tone", [2, 1, 2, 1, 2, 1, 2, 1]],
    ["half_whole_tone", [1, 2, 1, 2, 1, 2, 1, 2]],
    ["acoustic", [2, 2, 2, 1, 2, 1, 2]],
    ["bartok", [2, 2, 2, 1, 2, 1, 2]]
])

intervals.set("ionian", intervals.get("major")!)
intervals.set("aeolian", intervals.get("minor")!)
intervals.set("spanish_mod", intervals.get("phrygian")!)

const altScale = intervals.get("alt_dom")!
intervals.set("sup_locrian", altScale)
intervals.set("dim_whole_tone", altScale)
intervals.set("alt_scale", altScale)

intervals.set("dorian_pent", intervals.get("suspended_pent")!)
intervals.set("minor_pent", intervals.get("aeolian_pent")!)
intervals.set("dorian_beb", intervals.get("minor_beb")!)
intervals.set("dim", intervals.get("whole_half_tone")!)

const halfWhole = intervals.get("half_whole_tone")!
intervals.set("dom_dim", halfWhole)
intervals.set("symm_dim", halfWhole)

intervals.set("bartok", intervals.get("acoustic")!)

export function getIntervals(scaleName: string): ReadonlyArray<number>
{
    return intervals.get(scaleName) ?? []
}

export function getScalesIdNames()
{
    return Array.from(intervals.keys())
}