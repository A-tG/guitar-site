var Note = {
    isCorrect: function(note)
    {
        if (typeof note !== "string")
        {
            return false;
        }
        var isCorrect = false;
        if (NOTES.indexOf(note.toUpperCase()) >= 0)
        {
            isCorrect = true;
        }
        else
        {
            console.log(note + ': ' + WRONG_NOTE_MSG);
        }
    return isCorrect;
    },

    next: function(note)
    {
        resultNote = "C";
        if (Note.isCorrect(note))
        {
            var index = NOTES.indexOf(note);
            index++;
            if (index == NOTES.length)
            {
                index = 0;
            }
            resultNote = NOTES[index];
        }
        return resultNote;
    },

    prev: function(note)
    {
        resultNote = "C";
        if (Note.isCorrect(note))
        {
            var index = NOTES.indexOf(note);
            index--;
            if (index < 0)
            {
                index = NOTES.length - 1;
            }
            resultNote = NOTES[index];
        }
        return resultNote;
    },

    nextSemiTones: function(note, semiTones)
    {
        var resultNote = note;
        if (semiTones > 0)
        {
            for (var i = 0; i < semiTones; i++)
            {
                resultNote = Note.next(resultNote);
            }
        }
        else
        {
            for (var i = 0; i > semiTones; i--)
            {
                resultNote = Note.prev(resultNote);
            }
        }
        return resultNote;
    },

    getNotesFromSemiTones: function(root, semiTones)
    {
        var notes = DEFAULT_SCALE_NOTES;
        root = root.toUpperCase();
        if ((Note.isCorrect(root)) && (Scale.isCorrectSemitonesSum(semiTones)))
        {
            notes = [];
            var note = root;
            notes.push(note);
            for (var i = 0; i < semiTones.length; i++)
            {
                for (var k = 1; k <= semiTones[i]; k++)
                {
                    note = Note.next(note);
                }
                notes.push(note);
            }
            notes.pop();
        }
        return notes
    }
}
