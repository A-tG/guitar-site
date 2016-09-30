var intervalID = null;

function metronomeTick()
{
    postMessage('tick');
}

onmessage = function(e)
{
    var action = e.data;
    if (action == 'start')
    {
        intervalID = setInterval(metronomeTick, 1000 / 60);
    } 
    else if (action == 'stop')
    {
        if (intervalID != undefined)
        {
            clearInterval(intervalID);
        }
    }
}
