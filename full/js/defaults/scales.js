defaults.scales = {
    state: {},

    readFromCookie: function()
    {
        return Cookies.get("defaultScaleOptions");
    },

    saveToCookie: function()
    {
        Cookies.set("defaultScaleOptions", this.state, {expires: DEFAULT_SCALE_OPTIONS_EXPIRE_DAYS});
    },

    init: function()
    {
        this.state = new ScalesStateBase();
        this.state.deserialize(this.readFromCookie());
    }
}
