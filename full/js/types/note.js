/*
 * Class representation of musical note with useful methods.
 *
 * Methods returns result even with invalid parameters, error is printed in console (if _IS_DEBUG = true).
 *
 * JSON.Stringify(new Note("C#")) will return "Db", flat notes instead of sharps
 * for better query params and html links compability.
 *
 * Methods:
set("D#")                         sets note name, return this object
setName("D#")                     same
getName()                         returns note name
get()                             same
getCopy()                         returns copy of object

defaultNoteName()
getAllNotes()

isValid("D#")                     return true
isValid("Db")                     return true
isValid("D")                      return true
isValidNormal("C")                return true
isValidNormal("Db")               return false 
isValidFlat("Db")                 return true
isValidSharp("C#")                return true
isAltSharp("E#")                  return true

validateNoteName("F")             return "F"

flatToNormal("Db")                return "C#"

sharpToFlat("C#")                 return "Db"

sharpToNormal("E#")               return "F"

higherName("F")                   return "F#" - higher on semitone note name
higherName()                      same, object's note name used
higher("F")                       returns new object
higher()                          returns this object

lowerName("F")                    return "E" - lower on semitone note name
lowerName()                       same, object's note name used
lower("F")                        returns new object
lower()                           returns this object

higherSTName(3, "G")              return "A#" - higher note name by number of semitones
higherSTName(3)                   same, object's note name used
higherST(3, "G")                  returns new object
higherST(3)                       returns this object

lowerSTName(3, "G")               return "E" - lower note name by number of semitones
lowerSTName(3)                    same, object's note name used
lowerST(3, "G")                   returns new object
lowerST(3)                        returns this object

serialize()                       returns note name but sharp replaced with flat, used in toJSON()
deserialize()                     same as set()
*/

function Note(noteName)
{
    this._noteName = this.defaultNoteName();

    if (this._isArgReceived(noteName))
    {
        this.set(noteName);
    }
}

Note.prototype._IS_DEBUG = IS_DEBUG;
Note.prototype._ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
Note.prototype._FLAT_SYMBOL = "b";
Note.prototype._SHARP_SYMBOL = "#";

Note.prototype._isArgReceived = function(arg)
{
    return arg !== undefined; 
}

Note.prototype._validateSemiTonesArg = function(arg)
{
    var isValidSemiTones = this._isArgReceived(arg) && 
        (typeof arg == "number") && !isNaN(arg);
    if (!isValidSemiTones)
    {
        if (this._IS_DEBUG)
        {
            console.error("Invalid semitones number argument")
        }
        return 0;
    }
    return arg;
}

Note.prototype._noteNameArg = function(arg)
{
    return this._isArgReceived(arg)? arg: this._noteName;
}

Note.prototype._isValid = function(noteName)
{
    return this._isValidNormal(noteName) || 
        this._isValidFlat(noteName) || this._isAltSharp(noteName);
}

Note.prototype._isValidNormal = function(noteName)
{
    return this._ALL_NOTES.indexOf(noteName) > -1;
}

Note.prototype._isValidFlat = function(noteName)
{
    return (noteName[noteName.length - 1] === this._FLAT_SYMBOL) && 
        (this._isValidNormal(noteName.slice(0, -1)));
}

Note.prototype._isValidSharp = function(noteName)
{
    return (noteName[noteName.length - 1] === this._SHARP_SYMBOL) && 
        (this._isValidNormal(noteName));
}

Note.prototype._isAltSharp = function(noteName)
{
    return (noteName[noteName.length - 1] === this._SHARP_SYMBOL) && 
        (this._isValidNormal(noteName.slice(0, -1))) && !(this._isValidNormal(noteName));
}

Note.prototype._higher = function()
{
    this._noteName = this.higherName(this._noteName);
    return this;
}

Note.prototype._lower = function()
{
    this._noteName = this.lowerName(this._noteName);
    return this;
}

Note.prototype._higherST = function(semiTones)
{
    this._noteName = this.higherSTName(semiTones, this._noteName);
    return this;
}

Note.prototype._lowerST = function(semiTones)
{
    this._noteName = this.lowerSTName(semiTones, this._noteName);
    return this;
}

Note.prototype.set = function(noteName)
{
    this._noteName = this.validateNoteName(noteName);
    return this;
}

Note.prototype.setName = Note.prototype.set;

Note.prototype.get = function()
{
    return this._noteName;
}

Note.prototype.getName = Note.prototype.get;

Note.prototype.getCopy = function()
{
    var name = this.getName();
    return new Note(name);
}

Note.prototype.defaultNoteName = function()
{
    return this._ALL_NOTES[0];
}

Note.prototype.getAllNotes = function()
{
    return this._ALL_NOTES.slice();
}

Note.prototype.isValid = function(noteName)
{
    if (this._isValid(noteName))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid note name: " + noteName);
    }
    return false;
}

Note.prototype.isValidNormal = function(noteName)
{
    if (this._isValidNormal(noteName))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid note normal name: " + noteName);
    }
    return false;
}

Note.prototype.isValidFlat = function(noteName)
{
    if (this._isValidFlat(noteName))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid flat note name: " + noteName);
    }
    return false;
}

Note.prototype.isValidSharp = function(noteName)
{
    if (this._isValidSharp(noteName))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid sharp note name: " + noteName);
    }
    return false;
}

Note.prototype.isAltSharp = function(noteName)
{
    if (this._isAltSharp(noteName))
    {
        return true;
    }
    if (this._IS_DEBUG)
    {
        console.error("Invalid alternative sharp note name: " + noteName);
    }
    return false;
}

Note.prototype.validateNoteName = function(noteName)
{
    var resultNoteName = this.defaultNoteName();
    if (typeof noteName !== "string")
    {
        if (this._IS_DEBUG)
        {
            console.error("Note name must be a String");
        }
        return resultNoteName;
    }
    if (this.isValid(noteName))
    {
        if (this._isValidNormal(noteName))
        {
            resultNoteName = noteName;
        } else if (this._isValidFlat(noteName))
        {
            resultNoteName = this.flatToNormal(noteName);
        } else if (this._isAltSharp (noteName))
        {
            resultNoteName = this.sharpToNormal(noteName);
        }
    }
    return resultNoteName;
}

Note.prototype.flatToNormal = function(noteName)
{
    noteName = this._noteNameArg(noteName);
    var result = this.defaultNoteName();
    if (this.isValidFlat(noteName))
    {
        result = this.lowerName(noteName.slice(0, -1));
    }
    return result;
}

Note.prototype.sharpToFlat = function(noteName)
{
    noteName = this._noteNameArg(noteName);
    var result = this.defaultNoteName();
    if (this.isValidSharp(noteName))
    {
        result = this.higherName(noteName);
        result += this._FLAT_SYMBOL;
    }
    return result;
}

Note.prototype.sharpToNormal = function(noteName)
{
    noteName = this._noteNameArg(noteName);
    var result = this.defaultNoteName();
    if (this.isAltSharp(noteName))
    {
        result = this.higherName(noteName.slice(0, -1));
    }
    return result;
}

Note.prototype.higherName = function(noteName)
{
    noteName = this.validateNoteName(this._noteNameArg(noteName));
    var index = this._ALL_NOTES.indexOf(noteName);
    if ((++index) == this._ALL_NOTES.length)
    {
        index = 0;
    }
    return this._ALL_NOTES[index];
}

Note.prototype.higher = function(noteName)
{
    if (arguments.length == 0)
    {
        return this._higher();
    }
    return new Note(this.higherName(noteName));
}

Note.prototype.lowerName = function(noteName)
{
    noteName = this.validateNoteName(this._noteNameArg(noteName));
    var index = this._ALL_NOTES.indexOf(noteName);
    if ((--index) < 0)
    {
        index = this._ALL_NOTES.length - 1;
    }
    return this._ALL_NOTES[index];
}

Note.prototype.lower = function(noteName)
{
    if (arguments.length == 0)
    {
        return this._lower();
    }
    return new Note(this.lowerName(noteName));
}

Note.prototype.higherSTName = function(semiTones, noteName)
{
    var resultName = this.validateNoteName(this._noteNameArg(noteName));
    semiTones = this._validateSemiTonesArg(semiTones);
    if (semiTones < 0)
    {
        semiTones = -semiTones;
        return this.lowerSTName(semiTones, noteName);
    }
    for (var i = 0; i < semiTones; i++)
    {
        resultName = this.higherName(resultName);
    }
    return resultName;
}

Note.prototype.higherST = function(semiTones, noteName)
{
    if (arguments.length == 1)
    {
        return this._higherST(semiTones);
    }
    return new Note(this.higherSTName(semiTones, noteName));
}

Note.prototype.lowerSTName = function(semiTones, noteName)
{
    var resultName = this.validateNoteName(this._noteNameArg(noteName));
    semiTones = this._validateSemiTonesArg(semiTones);
    if (semiTones < 0)
    {
        semiTones = -semiTones;
        return this.higherSTName(semiTones, noteName);
    }
    for (var i = 0; i < semiTones; i++)
    {
        resultName = this.lowerName(resultName);
    }
    return resultName;
}

Note.prototype.lowerST = function(semiTones, noteName)
{
    if (arguments.length == 1)
    {
        return this._lowerST(semiTones);
    }
    return new Note(this.lowerSTName(semiTones, noteName));
}

Note.prototype.serialize = function()
{
    if (this._isValidSharp(this._noteName))
    {
        return this.sharpToFlat();
    }
    return this._noteName;
}

Note.prototype.deserialize = Note.prototype.set;

Note.prototype.toJSON = Note.prototype.serialize;

Note.prototype.toString = Note.prototype.getName;

Note.prototype.valueOf = function()
{
    return this._ALL_NOTES.indexOf(this._noteName) + 1;
}
