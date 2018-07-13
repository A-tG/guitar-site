itemsFactory = {
    getItem: function(id, JSONstring)
    {
        var item = {};
        var parsedArr = [];
        var type = "";
        if (JSONstring)
        {  
            try
            {
                parsedArr = JSON.parse(JSONstring);
                type = parsedArr[0];
            } 
            catch (err) 
            {
                console.error("Invalid JSON: " + JSONstring);
            }
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
                if (type)
                {
                    console.error("Invalid item type: " + type);
                }
                item = new ScalesItem(id);
        }
        return item;
    }
}
