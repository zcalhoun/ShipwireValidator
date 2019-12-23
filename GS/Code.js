function main() {
  
  // 1. Get all orders as a flattened array.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheet = ss.getSheetByName("1. Missing Orders in NS");
  var lastRow = sheet.getLastRow();
  
  var rawNumbers = sheet.getRange(2,1,lastRow-1,1).getValues();
  
  // 2. Break out calls by 250.
  var allOrderNos = rawNumbers.map(function(val) {return val[0]});
  
  // 3. Loop through in sections of 200
  var url = "https://api.shipwire.com/api/v3/orders?orderNo=",
      deliveredSheet = ss.getSheetByName("2. Delivered Orders in Shipwire"),
      deliveredRow;
  var i =0;
  while (allOrderNos.length > 0 ) {
    Logger.log(i++);
    var orders = allOrderNos.splice(0,40).map(function(i) { return i.substring(0,25);}).join(",");
    
    var options = {
      'method': 'get',
      'contentType': 'application/json',
      'headers': {
        'Authorization': 'Basic '+PASSWORD
      }
    };
    
    var fetchOrders = JSON.parse(UrlFetchApp.fetch(url+orders, options));
    //Logger.log("Fetched Orders: "+fetchOrders);
    // 4. Parse through the data and add to spreadsheet.
    var completedOrders = [];
    fetchOrders.resource.items.forEach(function(order) {
      completedOrders.push([
             order.resource.orderNo,
             order.resource.status,
             order.resource.routing.resource.warehouseName,
             order.resource.events.resource.completedDate
        ]);
    });
    if(completedOrders.length > 0) {
      deliveredRow = deliveredSheet.getLastRow(); // this is the last row on the delivered sheet
      deliveredSheet.getRange(deliveredRow+1, 1, completedOrders.length,4).setValues(completedOrders);
    }
  }
}
