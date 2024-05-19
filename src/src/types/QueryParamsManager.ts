const searchParams = new URLSearchParams(window.location.search)

export function encodeQueryParam(str: string)
{
    let result = "";
    const firstCh = str[0];
    const lastCh = str[str.length - 1];
    if ((firstCh == '[') && (lastCh == ']'))
    {
        str = str.replace(/\[/g, '(').replace(/\]/g, ')'); // square brackets to round
        result = str.replace(/["']/g, ""); // remove quotes
    }
    return result;
}

export function decodeQueryParam(str: string)
{
    let result = "";
    const firstCh = str[0];
    const lastCh = str[str.length - 1];
    if ((firstCh == '(') && (lastCh == ')'))
    {
        str = str.replace(/\(/g, '[').replace(/\)/g, ']'); // round brackets to square
        result = str.replace(/[^\d,\[\]"'-]\w*#*/g, function (match) { return '"' + match + '"' }); // add quotes
    }
    return result;
}

export function setParam(key: string, value: string)
{
    searchParams.set(key, value)
    replaceAdressQuery(decodeURIComponent(searchParams.toString()))
}

export function removeParam(key: string)
{
    searchParams.delete(key)
    let newState = decodeURIComponent(searchParams.toString())
    replaceAdressQuery(newState)
}

export function getParam(key: string)
{
    return searchParams.get(key)
}

export function getList()
{
    return new Map(searchParams)
}

function replaceAdressQuery(val: string)
{
    history.replaceState(undefined, '', '?' + val)
}