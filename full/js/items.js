var menuItems = [];
var usedIDs = [];

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
    var id = getIDforNewItem()
    if (menuItems.length < MAX_ITEMS_NUMBER)
    {
        menuItems.push(new ScalesItem(id));
        usedIDs.push(id);
    }
    else
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
            usedIDs.splice(usedIDs.indexOf(id), 1);
        }
    }
}

var $addNewItemBtn = $('#' + ADD_NEW_ITEM_BTN_ID);
$addNewItemBtn.click(createNewItem);
