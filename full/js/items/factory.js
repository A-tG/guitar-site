itemsFactory = {
    getItem: function(id, JSONstring)
    {
        var item = {};
        var parsedArr = [];
        var type = SCALES_TYPE;
        if (JSONstring)
        {  
            try
            {
                parsedArr = JSON.parse(JSONstring);
                type = parsedArr[0];
            } 
            catch (err) {}
        }
        switch (type)
        {
            case SCALES_TYPE:
                item = new ScalesItem(id, JSONstring);
                break;
            case CHORDS_TYPE:
                item = new ChordsItem(id, JSONstring);
                break;
            default:
                item = new ScalesItem(id);
        }
        return item;
    }
}
