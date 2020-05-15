
/**
 * Setting class.
 */
export class Setting {
    public quadrants: string[];
    public rings: string[];
    public layout: SettingLayout;
    public data: SettingData[];

    /**
     * Create setting by default values.
     */
    public static create(data: Setting): Setting {
        if (!data.quadrants || data.quadrants.length === 0) {
            throw new Error("'setting.quadrants' should exists and have values");
        }

        if (!data.rings || data.rings.length === 0) {
            throw new Error("'setting.rings' should exists and have values");
        }

        return {
            quadrants: data.quadrants,
            rings: data.rings,
            layout: SettingLayout.create(data.layout),
            data: SettingData.create(data.data),
        };
    }
}

/**
 * Setting layout class.
 */
export class SettingLayout {
    public colors: string[][];
    public quadrantSpacement: number;

    /**
     * Create layout settings safely.
     */
    public static create(data: SettingLayout): SettingLayout {
        return {
            colors: data.colors ?? [
                ["#6da7d1", "#86adcf", "#9abddb", "#b1cbe0"],
                ["#6fbf7a", "#89c992", "#a3d4aa", "#b8e0be"],
                ["#e082b1", "#e69cc1", "#e0abc5", "#e3c5d4"],
                ["#dba374", "#e3b894", "#e6c3a5", "#f2dbc7"]
            ],
            quadrantSpacement: data.quadrantSpacement ?? 0,
        }
    }
}

/**
 * Setting data class.
 */
export class SettingData {
    quadrant: string;
    ring: string;
    value: string;
    index: number;

    /**
     * Create data settings safely.
     */
    public static create(data: SettingData[]): SettingData[] {
        if (data == null) {
            throw new Error("'setting.data' is required to instantiate chart");
        }

        return data.map((x, i) => {
            const item = new SettingData();
            item.quadrant = x.quadrant;
            item.ring = x.ring;
            item.value = x.value;
            item.index = i;

            return item;
        });
    }
}