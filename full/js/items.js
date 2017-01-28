var menuItems = [];
var usedIDs = [];

var serializedItems = [];

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
        serializedItems.push(menuItems[menuItems.length - 1].state.serialize());
        updateItemsQueryParams();
    }
    else
    {
        $addNewItemBtn.hide(200);
    }
}

function createItemsFromQueryParams()
{
    for (var i = 0; (i < serializedItems.length) && (i < MAX_ITEMS_NUMBER); i++)
    {
        var id = getIDforNewItem();
        menuItems.push(new ScalesItem(id, serializedItems[i]));
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
        if(menuItems[i].state.id === id)
        {
            menuItems.splice(i, 1);
            serializedItems.splice(i, 1);
            usedIDs.splice(usedIDs.indexOf(id), 1);
            updateItemsQueryParams();
        }
    }
}

function updateItemsQueryParams()
{
    var urlString = '?';
    for (var i = 0; i < serializedItems.length; i++)
    {
        var encodedParameter = btoa(serializedItems[i]);
        urlString += 'i' + i + '=' + encodedParameter;
        if (i < (serializedItems.length - 1))
        {
            urlString += '&';
        }
    }
    history.replaceState({}, "", urlString);
}

function readItemsQueryParams()
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
    serializedItems = preparedParameters;
}

function updateItemSerializedData(index, data)
{
    serializedItems[index] = data;
}

function itemsInit()
{
    getDefaultScaleOptionsFromCookie();
    readItemsQueryParams();
    if (serializedItems.length == 0)
    {
        createNewItem();
    }
    else
    {
        createItemsFromQueryParams();
    }
}

var $addNewItemBtn = $('#' + ADD_NEW_ITEM_BTN_ID);
$addNewItemBtn.click(createNewItem);
