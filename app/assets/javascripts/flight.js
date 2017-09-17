document.addEventListener("turbolinks:load", function() {
  $('form#flight').on("submit", function(e) {
    e.preventDefault();
    flightParams = {};
    
    $(this).serializeArray().forEach(function(param) {
      flightParams[param["name"]] = param["value"] 
    });

    JsonParams = {"ResponseVersion": "VERSION41",
      "FlightSearchRequest": {
      "Adults": flightParams["adult"],
      "Child": flightParams["children"],
      "ClassOfService": "ECONOMY",
      "InfantInLap": "0",
      "InfantOnSeat": "0",
      "Seniors": "0",
      "TypeOfTrip": "ROUNDTRIP",
      "SegmentDetails": 
        [
          { //outbound flight
            "DepartureDate": "2017-10-16",
            "DepartureTime": "0000",
            "Destination": "NYC", //from
            "Origin": "BKK" //to
          },
          { //return flight
            "DepartureDate": "2017-10-26",
            "DepartureTime": "0000",
            "Destination": "BKK", //from
            "Origin": "NYC" //to
          }
        ]
      }
    };

    $.ajax({
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa("w.kuttiya@gmail.com" + ":" + "p053851238")
      },
      url: "https://api-dev.fareportallabs.com/air/api/Search/SearchFlightAvailability",
      dataType: "json",
      data: JSON.stringify(JsonParams),
      contentType: "application/json; charset=utf-8",
      success: function(json) {
        var endpoint = json.FlightResponse.FpSearch_AirLowFaresRS,
            destinations = endpoint.OriginDestinationOptions,
            inbounds = destinations.InBoundOptions.InBoundOption,
            outbounds = destinations.OutBoundOptions.OutBoundOption,
            flightArrays = endpoint.SegmentReference.RefDetails
            flights = []
            flightArrays.forEach(function(flight) {
              var inboundId = flight.InBoundOptionId[0],
                  outboundId = flight.OutBoundOptionId[0];
                  flightJson = {};
              
              inbounds.find(function(inbound) {
                if (inbound.Segmentid === inboundId) {
                  flightJson.inbound = inbound.FlightSegment;
                }
              });

              outbounds.find(function(outbound) {
                if (outbound.Segmentid === outboundId) {
                  flightJson.outbound = outbound.FlightSegment;
                }
              });

              flightJson.Adult = flight.PTC_FareBreakdown.Adult.TotalAdultFare;
                  
              if (flight.PTC_FareBreakdown.Child !== null) {
                flightJson.Child = flight.PTC_FareBreakdown.Child.TotalChildFare;
              }

              flights.push(flightJson);
            });

        // console.log("destinations")
        // console.log(destinations)
        // console.log("inbounds")
        // console.log(inbounds)
        // console.log("outbounds")
        // console.log(outbounds)  
        // console.log("flightArrays")        
        // console.log(flightArrays)        
        // console.log("flights")
        console.log(flights)
        // debugger
      },
      error: function(error) {
        console.log(error)
      },
    });

  });
});