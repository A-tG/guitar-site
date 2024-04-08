defaults.scales = {
    state: {},

    readFromStorage: function()
    {
        return window.localStorage.getItem("defaultScaleOptions");
    },

    saveToStorage: function()
    {
        window.localStorage.setItem("defaultScaleOptions", JSON.stringify(this.state))
    },

    init: function()
    {
        this.state = new ScalesStateBase();
        this.state.deserialize(this.readFromStorage());
    }
}
