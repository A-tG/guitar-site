var menuItems = {
    itemsNumber: 0,
    items: {},
    itemsSerializedStates: {},

    getIDforNewItem: function()
    {
        var digit = 0
        while (this.items[ITEMS_ID_BASE + digit] !== undefined)
        {
            digit++;
        }
        return (ITEMS_ID_BASE + digit);
    },
    
    deleteItem: function(id)
    {
        if (this.itemsNumber == MAX_ITEMS_NUMBER)
        {
            this.$addNewItemBtn.show(0);
        }
        if (delete(this.items[id]))
        {
            delete(this.itemsSerializedStates[id]);
            this.updateItemsQueryParams();
            this.itemsNumber--;
        }
    },

    hideAddItemBtnIf: function()
    {
        if (this.itemsNumber >= MAX_ITEMS_NUMBER)
        {
            this.$addNewItemBtn.hide(0);
        }
    },
    
    updateItemsQueryParams: function()
    {
        var urlString = '?';
        for (var i = 0; i < MAX_ITEMS_NUMBER; i++)
        {
            var id = ITEMS_ID_BASE + i;
            if (this.itemsSerializedStates[id] !== undefined)
            {
                if (i != 0)
                {
                    urlString += '&';
                }
                var encodedParameter = this.itemsSerializedStates[id];
                urlString += 'i' + i + '=' + this.encodeQueryParamString(encodedParameter);
            }
        }
        history.replaceState({}, "", urlString);
    },
    
    updateItemSerializedData: function(id, data)
    {
        this.itemsSerializedStates[id] = data;
    },

    createNewItem: function()
    {
        var id = this.getIDforNewItem();
        if (this.itemsNumber < MAX_ITEMS_NUMBER)
        {
            this.items[id] = new ItemBase(id);
            this.itemsNumber++;
        }
        this.hideAddItemBtnIf();
    },
    
    createItemsFromQueryParams: function(itemsSerializedStates)
    {
        for (var i = 0; (i < itemsSerializedStates.length) && (i < MAX_ITEMS_NUMBER); i++)
        {
            var id = this.getIDforNewItem();
            this.items[id] = new ItemBase(id, itemsSerializedStates[i]);
            this.itemsNumber++;
        }
        this.hideAddItemBtnIf();
    },

    readItemsQueryParams: function()
    {
        var url = window.location.href;
        var index = url.indexOf('?');
        var parameters = [];
        var serializedStates = [];
        if (index != -1)
        {
            var parametersStr = url.slice(index + 1);
            parameters = parametersStr.split('&');
            for (var i = 0; (i < parameters.length) && (i < MAX_ITEMS_NUMBER); i++)
            {
                var index = parameters[i].indexOf('=');
                if (index != -1)
                {
                    var parameter = parameters[i].slice(index + 1);
                    parameter = this.decodeQueryParamString(parameter);
                    serializedStates.push(parameter);
                }
            }
        }
        return serializedStates;
    },

    encodeQueryParamString: function(str)
    {
        var result = "";
        var firstCh = str[0];
        var lastCh = str[str.length - 1];
        if ((firstCh == '[') && (lastCh == ']'))
        {
            str = str.replace(/\[/g, '(').replace(/\]/g, ')'); // square brackets to round
            result = str.replace(/["']/g, ""); // remove quotes
        }
        return result;
    },

    decodeQueryParamString: function(str)
    {
        var result = "";
        var firstCh = str[0];
        var lastCh = str[str.length - 1];
        if ((firstCh == '(') && (lastCh == ')'))
        {
            str = str.replace(/\(/g, '[').replace(/\)/g, ']'); // round brackets to square
            result = str.replace(/[^\d,\[\]"'-]\w*#*/g, function(match) {return '"' + match + '"'}); // add quotes
        }
        return result;
    },

    onNewItemButton: function(event)
    {
        that = event.data.that;
        that.createNewItem();
    },

    updateNoteNotation: function()
    {
        for (id in this.items)
        {
            this.items[id].updateNoteNotation();
        }
    },

    init: function()
    {
        this.$addNewItemBtn = $('#' + ADD_NEW_ITEM_BTN_ID);
        this.$addNewItemBtn.click({that: this}, this.onNewItemButton);
        var serializedStates = this.readItemsQueryParams();
        if (serializedStates.length == 0)
        {
            this.createNewItem();
        }
        else
        {
            this.createItemsFromQueryParams(serializedStates);
        }
    }
}
