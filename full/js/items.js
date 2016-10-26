var menuItems = [];
var usedIDs = [];

var itemsJSONs = [];

function getIDforNewItem()
{
    var digit = 0
    while ((usedIDs.indexOf("menuItem" + digit)) >= 0)
    {
        digit++;
    }
    return ("menuItem" + digit);
}

function createNewItem()
{
    var id = getIDforNewItem();
    if (menuItems.length < MAX_ITEMS_NUMBER)
    {
        menuItems.push(new ScalesItem(id));
        usedIDs.push(id);
        itemsJSONs.push(menuItems[menuItems.length - 1].getItemJSON());
        changeURLitemsParameters();
    }
    else
    {
        $addNewItemBtn.hide(200);
    }
}

function createItemsFromURLparameters()
{
    for (var i = 0; (i < itemsJSONs.length) && (i < MAX_ITEMS_NUMBER); i++)
    {
        var id = getIDforNewItem();
        menuItems.push(new ScalesItem(id, itemsJSONs[i]));
        usedIDs.push(id);
    }
    if (menuItems.length >= MAX_ITEMS_NUMBER)
    {
        $addNewItemBtn.hide(200);
    }
}

function deleteItem(id)
{
    if (menuItems.length == MAX_ITEMS_NUMBER)
    {
        $addNewItemBtn.show(200);
    }
    for (var i = 0; i < menuItems.length; i++)
    {
        if(menuItems[i].id === id)
        {
            menuItems.splice(i, 1);
            itemsJSONs.splice(i, 1);
            usedIDs.splice(usedIDs.indexOf(id), 1);
            changeURLitemsParameters();
        }
    }
}

function changeURLitemsParameters()
{
    var urlString = '?';
    for (var i = 0; i < itemsJSONs.length; i++)
    {
        var encodedParameter = btoa(itemsJSONs[i]);
        urlString += 'i' + i + '=' + encodedParameter;
        if (i < (itemsJSONs.length - 1))
        {
            urlString += '&';
        }
    }
    history.replaceState({}, "", urlString);
}

function readURLitemsParameters()
{
    var url = window.location.href;
    var index = url.indexOf('?');
    var parameters = [];
    var preparedParameters = [];
    if (index != -1)
    {
        var parametersStr = url.slice(index + 1);
        parameters = parametersStr.split('&');
        for (var i = 0; i < parameters.length; i++)
        {
            var index = parameters[i].indexOf('=');
            if (index != -1)
            {
                var parameter = parameters[i].slice(index + 1);
                parameter = decodeURI(parameter);
                try
                {
                    parameter = atob(parameter);
                    preparedParameters.push(parameter);
                }
                catch (err)
                {
                    console.log(PARAMS_ATOB_ERROR_MSG + '\n' + err);
                }
            }
        }
    }
    itemsJSONs = preparedParameters;
}

function changeItemJSON(item)
{
    var index = $('.' + ITEM_CLASS).index(item.$itemBlock);
    itemsJSONs[index] = item.getItemJSON();
}

function itemsInit()
{
    readURLitemsParameters();
    if (itemsJSONs.length == 0)
    {
        createNewItem();
    }
    else
    {
        createItemsFromURLparameters();
    }
}

var $addNewItemBtn = $('#' + ADD_NEW_ITEM_BTN_ID);
$addNewItemBtn.click(createNewItem);
