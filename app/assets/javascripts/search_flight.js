document.addEventListener("turbolinks:load", function() {
  //handlebars
  var source   = $("#flight-template").html();
  var template = Handlebars.compile(source);

  $('form#flight').on("submit", function(e) {
    $('#search-results').empty()
    e.preventDefault();
    flightParams = {};
    
    $(this).serializeArray().forEach(function(param) {
      flightParams[param["name"]] = param["value"] 
    });

    console.log(flightParams)
    
    JsonParams = {"ResponseVersion": "VERSION41",
      "FlightSearchRequest": {
      // "Adults": flightParams.adult,
      "Adults": "1",
      // "Child": flightParams.children,
      "Child": "2",      
      "ClassOfService": "ECONOMY",
      "InfantInLap": "0",
      "InfantOnSeat": "0",
      "Seniors": "0",
      "TypeOfTrip": "ROUNDTRIP",
      "SegmentDetails": 
        [
          { //outbound flight
            // "DepartureDate": flightParams.depart, //"2017-09-29"
            "DepartureDate": "2017-09-29", //"2017-09-29"
            "DepartureTime": "0000",
            "Destination": "NYC", //from "NYC"
            // "Destination": flightParams.from, //from "NYC"
            // "Origin": flightParams.to //to "BKK"
            "Origin": "PAR" //to "PAR"            
          },
          { //return flight
            "DepartureDate": "2017-10-10", //"2017-10-10"
            // "DepartureDate": flightParams.return, //"2017-10-10"            
            "DepartureTime": "0000",
            "Destination": "PAR", //from "NYC"
            "Origin": "NYC" //to "PAR"   
            // "Destination": flightParams.to, //from BKK
            // "Origin": flightParams.from //to NYC
          }
        ]
      }
    };

    var flights = []

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
            flightArrays = endpoint.SegmentReference.RefDetails;
            
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

              flightJson.Adult = Math.round(flight.PTC_FareBreakdown.Adult.TotalAdultFare);
                  
              if (flight.PTC_FareBreakdown.Child !== null) {
                flightJson.Child = Math.round(flight.PTC_FareBreakdown.Child.TotalChildFare);
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
        var flightsData = flights.splice(0, 10);
        console.log(flightsData)
        flightsData.forEach(function(flight) {
          //handlebars
          var context = {
            Adult: flight.Adult,
            Child: flight.Child,
            //In
            InAirline: flight.inbound[0].OperatedByAirline.CompanyText,
            InDepartport: flight.inbound[0].DepartureAirport.LocationCode,
            InArriveport: flight.inbound[0].ArrivalAirport.LocationCode,
            InDuration: parseInt(flight.inbound[0].FlightDuration, 10),
            InAirline: flight.inbound[0].OperatedByAirline.CompanyText,
            //Out
            OutAirline: flight.outbound[0].OperatedByAirline.CompanyText,
            OutDepartport: flight.outbound[0].DepartureAirport.LocationCode,
            OutArriveport: flight.outbound[0].ArrivalAirport.LocationCode,
            OutDuration: parseInt(flight.outbound[0].FlightDuration, 10),
          };
              
          var html    = template(context);

          $('#search-results').append(html);
          // debugger
        });

        $.ajax({
          url: "/widgets",
          type: "POST",
          data: {
            flightParams: flightParams,
          },
          dataType: "json",
          });
      },
      error: function(error) {
        console.log(error)
      },
    });

  });
});