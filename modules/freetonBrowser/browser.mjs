const $ = Dom7;



let location = decodeURIComponent(window.location.hash).substr(1);

console.log(location);

$('#browser').attr('src', location + '?fromFreetonBorwser=fromFreetonBorwser');