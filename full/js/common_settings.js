function ColorSchemeSwitcher()
{
    var $blockToSwitchClass = $('.' + BG_BLOCK_CLASS);
    this.schemeClass = "night";

    function resetScheme()
    {
        COLOR_SCHEMES_CLASSES.forEach(function(item) {$blockToSwitchClass.toggleClass(item, false)});
    }

    this.saveToCookies = function()
    {
        Cookies.set("colorScheme", this.schemeClass);
    }

    this.switchScheme = function(name)
    {
        var schemeExist = COLOR_SCHEMES_CLASSES.indexOf(name) >= 0;
        if (schemeExist)
        { 
            this.schemeClass = name;
            resetScheme();
            switch (name)
            {
                case "day":
                {
                    $blockToSwitchClass.toggleClass("day", true);
                    break;
                }
                case "night":
                {
                    $blockToSwitchClass.toggleClass("night", true);
                    break;
                }
            }
            this.saveToCookies();
        }
    }

    this.init = function()
    {
        if (Cookies.getJSON("colorScheme") !== undefined)
        {
            this.schemeClass = Cookies.getJSON("colorScheme");

        }
        this.switchScheme(this.schemeClass);
    }
}

var commonSettings = {
    $openBtn: $('#' + COMMON_SETTINGS_BTN_ID),
    $closeBtn: $('#' + COMMON_SETTINGS_BLOCK_CLOSE_BTN_ID),
    $settingsBlock: $('#' + COMMON_SETTINGS_BLOCK_ID),
    $switchToDayColorBtn: $('#' + COMMON_SETTINGS_BLOCK_DAY_COLOR_BTN_ID),
    $switchToNightColorBtn: $('#' + COMMON_SETTINGS_BLOCK_NIGHT_COLOR_BTN_ID),
    colorSchemeSwitcher: new ColorSchemeSwitcher(),

    showMenuToggle: function(isShow)
    {
        if (isShow)
        {
            this.$settingsBlock.show(100, "linear");
        } 
        else
        {
            this.$settingsBlock.hide(100, "linear");
        }
    },

    onOpenBtnClick: function(event)
    {
        var that = event.data.that;
        that.showMenuToggle(true);
    },

    onCloseBtnClick: function(event)
    {
        var that = event.data.that;
        that.showMenuToggle(false);
    },

    onSwitchToDayColorBtn: function(event)
    {
        var that = event.data.that;
        that.colorSchemeSwitcher.switchScheme("day");
        $(this).hide();
        that.$switchToNightColorBtn.show();
    },

    onSwitchToNightColorBtn: function(event)
    {
        var that = event.data.that;
        that.colorSchemeSwitcher.switchScheme("night");
        $(this).hide();
        that.$switchToDayColorBtn.show();
    },

    init: function()
    {
        this.$settingsBlock.toggleClass(COMMON_SETTINGS_BLOCK_HIDE_CLASS, false);
        this.$settingsBlock.hide();
        if (this.colorSchemeSwitcher.schemeClass == "day")
        {
            this.$switchToDayColorBtn.hide();
        }
        else
        {
            this.$switchToNightColorBtn.hide();
        }
        this.$openBtn.click({that: this}, this.onOpenBtnClick);
        this.$closeBtn.click({that: this}, this.onCloseBtnClick);
        this.colorSchemeSwitcher.init();
        this.$switchToDayColorBtn.click({that: this}, this.onSwitchToDayColorBtn);
        this.$switchToNightColorBtn.click({that: this}, this.onSwitchToNightColorBtn);
    }
}
