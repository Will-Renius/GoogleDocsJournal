function onOpen() {
  var ui = DocumentApp.getUi();
  // Or FormApp or SpreadsheetApp.
  ui.createMenu('Custom Journal Menu')
      .addItem('New Entry', 'newEntry')
      .addItem('Export Changes', 'listFileRevisions')
      .addToUi();

}
function listFileRevisions() {
  fileID =  DocumentApp.getActiveDocument().getId();
  var editList = [],
      revisions = Drive.Revisions.list(fileID);
  
  if (revisions.items && revisions.items.length > 0) {
    Logger.log(revisions.items.length);
    for (var i=0; i < revisions.items.length; i++) {
      var revision = revisions.items[i];
      editList.push([revision.id, (new Date(revision.modifiedDate)).toLocaleString(),
        revision.lastModifyingUserName, revision.lastModifyingUser.emailAddress
      ]);
    }
    Logger.log(editList);
  } else {
    Logger.log('No file revisions found.');
  }

}
function insertDate() {
  // Attempt to insert text at the cursor position. If insertion returns null,
  // then the cursor's containing element doesn't allow text insertions.
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
  var body = DocumentApp.getActiveDocument().getBody();
  
  // Append a paragraph, with heading 1.
  var par1 = body.appendParagraph(date);
  par1.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  var par2 = body.appendParagraph("\n");
  par2.setHeading(DocumentApp.ParagraphHeading.NORMAL);
  return_position =  DocumentApp.getActiveDocument().newPosition(par2, 0);

//      var element = pos.insertText(date);
//      var body = DocumentApp.getActiveDocument().getBody();
//      var date_style = {};
//      date_style[DocumentApp.Attribute.HEADING] = DocumentApp.ParagraphHeading.HEADING1;
//      element.getParent().setAttributes(date_style);
//      
//      //adjust for text entry position
//      var entry_position = DocumentApp.getActiveDocument().newPosition(element, date.length);
//      var entry_element = entry_position.insertText("\n");
//      var entry_style = {};
//      entry_style[DocumentApp.Attribute.HEADING] = DocumentApp.ParagraphHeading.NORMAL;
//      entry_element.getParent().setAttributes(entry_style);
//      
//     
//      return_position =  DocumentApp.getActiveDocument().newPosition(entry_element, 0);
//      

  return(return_position);

}
//creates spot for viewing template
function setTemplateRange(){
 // Create a named range that includes every table in the document.
 var doc = DocumentApp.getActiveDocument();
 var selection = DocumentApp.getActiveDocument().getSelection();
 var rangeBuilder = doc.newRange();
 rangeBuilder.addRange(selection);
 doc.addNamedRange('template', rangeBuilder.build());
}
//sets templete contents
function setTemplate(){
  var doc = DocumentApp.getActiveDocument();

  var templateNamedRange = doc.getNamedRanges("template");
  var templateRange = templateNamedRange.getRange();
  var elements = templateRange.getRangeElements();
  //replace range or elements idk

}
//sets range to designate journal end
function setJournalEnd(){
  var doc = DocumentApp.getActiveDocument();
  var selection = DocumentApp.getActiveDocument().getSelection();
  var rangeBuilder = doc.newRange();
  rangeBuilder.addRange(selection);
  doc.addNamedRange('end', rangeBuilder.build());
}
//appends new journal template above end position
function newEntry() {
  var doc = DocumentApp.getActiveDocument();
//  var templateNamedRange = doc.getNamedRanges("end")[0];
//  var templateRange = templateNamedRange.getRange();
//  var elements = templateRange.getRangeElements();
//  var pos = doc.newPosition(elements[0].getElement(), 0);
  var new_pos = insertDate();
  doc.setCursor(new_pos);
  
}
function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}


/* What should the add-on do when a document is opened */
function onOpen() {
  var ss = SpreadsheetApp.getActive();
  var items = [
      {name: 'Convert To Text', functionName: 'functionToText'},
      null, // Results in a line separator.
      {name: 'Convert To Formula', functionName: 'textToFunction'}
   ];
   ss.addMenu('Text Formula Converter', items);
 
}
/* What should the add-on do after it is installed */
function onInstall() {
  onOpen();
}