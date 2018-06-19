function Scale(scaleName, rootNote)
{
    this._root = new Note();
    this._name = this.getDefaultName();
    this._semiTones = this.getDefaultSemiTones();

    if (this._isArgReceived(scaleName))
    {
        this.setName(scaleName);
    }
    if (this._isArgReceived(rootNote))
    {
        this.setRoot(rootNote);
    }
}

Scale.prototype._IS_DEBUG = IS_DEBUG;
// associative array "scale_name" => semitones_array
Scale.prototype._ALL_SCALES = SCALES;
Scale.prototype._ST_SUM = 12;

Scale.prototype._isArgReceived = function(arg)
{
    return arg !== undefined; 
}

Scale.prototype._getSemiTonesFromName = function(scaleName)
{
    return this._ALL_SCALES[scaleName];
}

Scale.prototype._isValidSemiTonesSum = function(semiTones)
{
    var semiTonesSum = 0;
    for (var i = 0; i < semiTones.length; i++)
    {
        semiTonesSum += semiTones[i];
    }
    if (semiTonesSum == this._ST_SUM)
    {
        return true;
    }
    return false;
}

Scale.prototype.getDefaultName = function()
{
    return "major";
}

Scale.prototype.getDefaultSemiTones = function()
{
    return [2, 2, 1, 2, 2, 2, 1];
}

Scale.prototype.isValidScaleName = function(scaleName)
{
    if (typeof scaleName !== "string")
    {
        if (this._IS_DEBUG)
        {
            console.error("Scale name must be a string");
        }
        return false;
    }
    var semiTones = this._getSemiTonesFromName(scaleName);
    if (semiTones !== undefined)
    {
        if (this.isValidSemiTones(semiTones))
        {
            return true;
        } else
        {
            if (this._IS_DEBUG)
            {
                console.error("Invalid semitones for scale: " + scaleName);
            }
            return false;
        }
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid scale Name: " + scaleName);
    }
    return false;
}

Scale.prototype.isValidSemiTones = function(semiTones)
{
    var isArray = (typeof semiTones === "object") && (Array.isArray(semiTones));
    if (!isArray)
    {
        if (this._IS_DEBUG)
        {
            console.error("Semitones must be Array");  
        }
        return false;
    }
    if (this._isValidSemiTonesSum(semiTones))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid semitones sum, must be: " + this._ST_SUM);
    }
    return false;
}

Scale.prototype.setName = function(scaleName)
{
    if (this.isValidScaleName(scaleName))
    {
        this._name = scaleName;
        this._semiTones = this._getSemiTonesFromName(scaleName);
    }
    return this;
}

Scale.prototype.setRoot = function(noteName)
{
    this._root = new Note(noteName);
    return this;
}

Scale.prototype.getName = function()
{
    return this._name;
}

Scale.prototype.getRoot = function()
{
    return this._root;
}

Scale.prototype.getSemiTones = function()
{
    return this._semiTones.slice();
}

Scale.prototype.getNotes = function()
{
    var notes = [];
    var note = this._root.getCopy();
    notes.push(note);
    for (var i = 0; i < this._semiTones.length; i++)
    {
        note = note.higherST(this._semiTones[i], note.getName());
        notes.push(note);
    }
    notes.pop();
    return notes;
}

Scale.prototype.getNotesNames = function()
{
    var notes = this.getNotes();
    return notes.map(function(item) {return item.getName()});
}

Scale.prototype.getSemiTonesPatternForString = function(stringTuning)
{
    stringTuning = stringTuning.getCopy();
    var semiTones = this.getSemiTones();
    var scaleNotes = this.getNotesNames();
    var pattern = [];
    var stringTuneOffset = 0;
    var stringTuneIndex = scaleNotes.indexOf(stringTuning.getName());
    while (stringTuneIndex < 0)
    {
        stringTuning.higher();
        stringTuneIndex = scaleNotes.indexOf(stringTuning.getName());
        stringTuneOffset++;
    }
    pattern.push(stringTuneOffset);
    for (var i = stringTuneIndex; i < semiTones.length; i++)
    {
        pattern.push(semiTones[i]);
    }
    for (var i = 0; i < stringTuneIndex; i++)
    {
        pattern.push(semiTones[i]);
    }
    return pattern;
}

Scale.prototype.serialize = function()
{
    var arr = [this._root, this._name];
    return arr;
}

Scale.prototype.deserialize = function(arr)
{
    if (arr)
    {  
        this.setRoot(arr[0]);
        this.setName(arr[1]);
    }
    return this;
}

Scale.prototype.toJSON = Scale.prototype.serialize;
