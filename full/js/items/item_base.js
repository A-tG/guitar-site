function ItemBase(id, JSONstring)
{
    this.$itemBlock;
    this.item;
    this.init(id, JSONstring);
}

ItemBase.prototype.deleteItem = function()
{
    var $itemBlock = $(this);
    menuItems.deleteItem($itemBlock.attr("id"));
    $itemBlock.remove();
}

ItemBase.prototype.onItemTypeChange = function(event)
{
    var that = event.data.that;
    var newType = $(this).val().toLowerCase();
    console.log(newType);
}

ItemBase.prototype.onCloseButton = function(event)
{
    var that = event.data.that;
    that.$itemBlock.hide(200, that.deleteItem);
}

ItemBase.prototype.onSetDefaultButton = function(event)
{
    var that = event.data.that;
    that.item.state.saveToDefaultOptions();
}

ItemBase.prototype.initAnimation = function()
{
    this.$itemBlock.hide(0);
    this.$itemBlock.show(200);
}

ItemBase.prototype.init = function(id, JSONstring)
{
    menuItems.$addNewItemBtn.before(ITEM_BASE_BLOCK_TMPL({id: id}));
    this.$itemBlock = $('#' + id);
    this.item = itemsFactory.getItem(id, JSONstring);
    this.initAnimation();
    $('.' + ITEM_HEAD_SELECT_CLASS, this.$itemBlock).change({that: this}, this.onItemTypeChange);
    $('.' + CLOSE_BTN_CLASS, this.$itemBlock).click({that: this}, this.onCloseButton);
    $('.' + SET_DEFAULT_BTN_CLASS, this.$itemBlock).click({that: this}, this.onSetDefaultButton);
}
