function main() {
  
  // 1. Get all orders as a flattened array.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheet = ss.getSheetByName("Missing Orders");
  var lastRow = sheet.getLastRow();
  
  var rawNumbers = sheet.getRange(2,1,lastRow-1,1).getValues();
  
  // 2. Break out calls by 250.
  var allOrderNos = rawNumbers.map(function(val) {return val[0]});
  
  // Loop through in sections of 200
  var url = "https://api.shipwire.com/api/v3/orders?orderNo=";
  while (allOrderNos.length > 0 ) {
    var orders = allOrderNos.splice(0,200).map(function(i) { return i.substring(0,25);}).join(",");
    
    var options = {
      'method': 'get',
      'contentType': 'application/json',
      'headers': {
        'Authorization': 'Basic '+PASSWORD
      }
    };
    
    var fetchOrders = JSON.parse(UrlFetchApp.fetch(url+orders, options));
    
    fetchOrders.resource.items.forEach(function(order) {
      
      
    });
  }
 
}
