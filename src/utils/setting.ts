import { ISetting } from "../types/setting";

/**
 * Validate and map setting.
 */
export function validateSetting(setting: ISetting) {
    if (!Array.isArray(setting.quadrants) || setting.quadrants.length === 0) {
        throw new Error("[Technology Chart] 'setting.quadrants' should exists and not be empty");
    }

    if (setting.quadrants.length > 4) {
        throw new Error("[Technology Chart] 'setting.quadrants' length should be lower than four");
    }

    if (!Array.isArray(setting.rings) || setting.rings.length === 0) {
        throw new Error("[Technology Chart] 'setting.rings' should exists and not be empty");
    }

    if (!Array.isArray(setting.data)) {
        throw new Error("[Technology Chart] 'setting.data' should exists");
    }

    const result: ISetting = {
        quadrants: setting.quadrants,
        rings: setting.rings,
        data: setting.data.map((x, i) => ({
            quadrant: x.quadrant,
            ring: x.ring,
            value: x.value,
            index: i,
            bg: x.bg,
            highlightBg: x.highlightBg,
        })),
        layout: {
            colors: setting.layout?.colors ?? [
                ["#6da7d1", "#86adcf", "#9abddb", "#b1cbe0"],
                ["#6fbf7a", "#89c992", "#a3d4aa", "#b8e0be"],
                ["#e082b1", "#e69cc1", "#e0abc5", "#e3c5d4"],
                ["#dba374", "#e3b894", "#e6c3a5", "#f2dbc7"]
            ],
            quadrantSpacement: setting.layout?.quadrantSpacement ?? 0,
            padding: 10,
            point: {
                highlightBg: setting.layout?.point?.highlightBg ?? "red",
                bg: setting.layout?.point?.bg ?? "black",
                textColor: setting.layout?.point?.textColor ?? "white",
            },
        }
    };

    return result;
}