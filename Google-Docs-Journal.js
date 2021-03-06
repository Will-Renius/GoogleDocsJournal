/* What should the add-on do after it is installed */
function onInstall() {
onOpen();
}

function onOpen() {
  var ui = DocumentApp.getUi();
  // Or FormApp or SpreadsheetApp.
  ui.createMenu('Custom Journal Menu')
      .addItem('New Entry', 'newEntry')
      .addItem('Export Journal', 'exportDataModal')
      .addToUi();

}

function insertDate() {
   
  var body = DocumentApp.getActiveDocument().getBody();
  var date = getDateString();
  // Append a paragraph, with heading 1.
  var par1 = body.appendParagraph(date);
  par1.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  var par2 = body.appendParagraph("\n");
  par2.setHeading(DocumentApp.ParagraphHeading.NORMAL);
  return_position =  DocumentApp.getActiveDocument().newPosition(par2, 0);

  return(return_position);

}

//appends new journal template above end position
function newEntry() {
  var doc = DocumentApp.getActiveDocument();
  var new_pos = insertDate();
  doc.setCursor(new_pos);
  
}

function getDateString () {
  var d = new Date();
  var min = d.getMinutes();
  min = pad(min, 2);
  var hr = d.getHours();
  hr = pad(hr, 2);
  var dd = d.getDate();
  dd = pad(dd, 2)
  var mm = d.getMonth() + 1; //Months are zero based
  mm = pad(mm, 2)
  var yyyy = d.getFullYear();
  var date = mm + "-" + dd + "-" +  yyyy + " " + hr + ":" + min;
  
  return(date);
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function exportDataModal() {
  var html = HtmlService.createHtmlOutputFromFile('download');
  DocumentApp.getUi().showModalDialog(html, 'Export Journal Data');
}

function sanitizeString (desc) {
    var itemDesc;
    if(desc){
      desc = desc.replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/[\u2026]/g, '...');
    }
    if (desc) {
        itemDesc = desc.replace(/(\r\n|\n|\r|\s+|\t|&nbsp;)/gm,' ');
        itemDesc = itemDesc.replace(/"/g, '""');
        itemDesc = itemDesc.replace(/ +(?= )/g,'');
    } else {
        itemDesc = '';
    }
    return itemDesc;
}

function exportJournal(){

	var doc = DocumentApp.getActiveDocument();
	var body = doc.getBody();
	var paragraphs = body.getParagraphs()
    var date = "NA"
    var myExport = []
    for (var i = 0; i < paragraphs.length; i++) {
      if(paragraphs[i].getHeading() == "Heading 1")
      {
        date = paragraphs[i].getText()
      }
      else
      {
        myExport.push([date,paragraphs[i].getText()])
      }
    };
    
    var csvContent = "data:text/csv;charset=UTF-8,";
    myExport.forEach(function(rowArray){

     rowArray.forEach(function(part, index, theArray) {
        theArray[index] = '"' + sanitizeString(part) + '"';
    });
     var row = rowArray.join(",");
     csvContent += row + "\r\n";
    }); 
//   Logger.log(csvContent)

   var encodedUri = encodeURI(csvContent);
   return {
    url: encodedUri,
    filename: "myJournal.csv"
  };
}


