itemsCreator = {
    getItem: function(id, JSONstring)
    {
        var item = {};
        var parsedArr = [];
        var type = SCALES_TYPE;
        try
        {
            parsedArr = JSON.parse(JSONstring, semiTonesPatternIntToBool);
            type = parsedArr[0];
        }
        catch (err) {}
        switch (type)
        {
            case SCALES_TYPE:
                item = new ScalesItem(id, JSONstring);
                break;
            case CHORDS_TYPE:
                item = new ChordsItem(id, JSONstring);
                break;
            default:
                item = new ScalesItem(id, JSONstring);
                console.log(WRONG_ITEM_TYPE_MSG + ' ' + type);
        }
        return item;
    }
}
