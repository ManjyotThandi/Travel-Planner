// On click function of submit button

  //-------------------------------------CODE --------------------------------------
  restoretripPlanner();

  // S.L - Commented this out as I would rather the html sit in the html file, I will hide if required
  // restorepointsOfInterest()

  clickSubmit();

//Global Scoped variables required by POI function(s)
globalObjectslist = [];

$("body").on("click", "#poiSubmit", function() {
  event.preventDefault();
  $("#poiRow").empty();
  globalObjectslist.splice(0, globalObjectslist.length);
  let city = $("#poiDestination")
    .val()
    .trim();
  // let poiType = $("#poiType").val().trim() COMING SOON
  pointsOfinterest(city);
});