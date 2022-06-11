
var material = {
    '48': {
        inches: 31.1,
        description: "PASSARP 103.200.01"
    },
    '72': {
        inches: 59.3,
        description: "VARIERA 800.128.53"
    },
};

function GetMaterialByLength(l) {
    for (k in material)
        if (material[k].inches == l)
            return material[k];
    return undefined;
}

function GetMaterialInputHTML(i) {
    if (material[i] !== undefined)
        return "<input type='checkbox' id='AvailMaterial" + i + "' " + (material[i].default ? " CHECKED" : "") + " /> " + material[i].description + ' (' + material[i].inches + '")';
    else
        return "";
}

function UpdateAvailableMaterial() {
    d = document.getElementById('AvailabileMaterial');
    d.innerHTML = "";
    for (key in material) {
        d.innerHTML += GetMaterialInputHTML(key) + "<br/>";
    }
}


function GetSelectedMaterial() {
    var stockLengths = Array();
    for (i in material) {
        if (document.getElementById('AvailMaterial' + i).checked)
            stockLengths[stockLengths.length] = material[i].inches;
    }
    return stockLengths;
}

function print_r(o) {
    m = "{\n";
    for (k in o)
        m += '  "' + k + '":' + o[k] + "\n";
    m += '}';
    return m;
}

function Calculate() {
    var tbl = document.getElementById('PieceTable');
    outHTML = '';

    var piecesNeeded = Array();

    if (tbl.rows.length < 2) {
        outHTML += '<b>No pieces were set to be produced (step 4)</b>';
    } else {


        // Build an array of each necessary piece length
        // Sort the array from smallest to largest
        for (i = 1; i < tbl.rows.length; i++) {
            var pId = parseInt(tbl.rows[i].cells[0].innerHTML);
            var pQty = parseInt(tbl.rows[i].cells[1].innerHTML);
            var pLen = parseFloat(tbl.rows[i].cells[2].innerHTML);
            var startIdx = 0;

            if (pId > 0) {

                for (startIdx = 0; startIdx < piecesNeeded.length && piecesNeeded[startIdx][0] <= pLen; startIdx++);

                for (j = 0; j < pQty; j++) {
                    piecesNeeded.splice(startIdx, 0, Array(pLen, pId));
                }
            }
        }

        // Build an array of available material lengths, sorted in ascending order
        var stockLengths = GetSelectedMaterial();

        if (stockLengths.length == 0) {
            outHTML += '<br /><br /><b>ERROR: liner not selected!</b><br />';
        } else {
            ;


            // Ensure that the longest piece is shorter than the longest available material
            if (piecesNeeded[piecesNeeded.length - 1][0] > stockLengths[stockLengths.length - 1]) {
                outHTML += '<br /><br /><b>Cannot continue: the longest component required is longer than the longest material available.</b><br />';
            } else {
                var cutWidth = 0;

                var pieces = Array();
                // piece[?] = Array(pieceLength, usedLength, Array(componentIDs ...))

                // Main loop
                while (piecesNeeded.length > 0) {
                    // Create a new piece of the largest material size
                    var thisPiece = Array(
                        stockLengths[stockLengths.length - 1],
                        0,
                        Array()
                    );

                    // Iterate through the needed components list
                    for (j = piecesNeeded.length - 1; j >= 0; j--) {
                        // Add component if it will fit, subtracting it from the list
                        if (thisPiece[0] - thisPiece[1] - piecesNeeded[j][0] >= 0) {
                            thisPiece[1] += piecesNeeded[j][0];
                            thisPiece[2].splice(-1, 0, piecesNeeded[j]);
                            piecesNeeded.splice(j, 1);

                            // Adjust for cutting losses
                            if (thisPiece[1] + cutWidth >= thisPiece[0])
                                thisPiece[1] = thisPiece[0];
                            else
                                thisPiece[1] += cutWidth;
                        }
                    }

                    // Attempt to reduce the length of the piece to the shortest material length that will accommodate
                    for (j = stockLengths.length - 1; j >= 0; j--) {
                        if (stockLengths[j] >= thisPiece[1])
                            thisPiece[0] = stockLengths[j];
                    }

                    if (thisPiece[2].length == 0) {
                        alert('Got stuck!');
                        break;
                    }
                    pieces[pieces.length] = thisPiece;
                }
                // exit when no more pieces are needed

                resultHTML = '<br /><b>Cutting Diagram:</b><div id="ResultVisualContainer">';

                pieceSummaryList = {};

                for (i = 0; i < pieces.length; i++) {
                    t = 0;
                    if (pieceSummaryList[pieces[i][0]] !== undefined)
                        t = pieceSummaryList[pieces[i][0]];
                    t++;
                    pieceSummaryList[pieces[i][0]] = t;

                    visual = '<div class="Piece" style="width: ' + (pieces[i][0] / 14) + 'in;">';

                    for (j = 0; j < pieces[i][2].length; j++) {
                        1
                        resultHTML += '<p>';
                        visual += '<div class="Segment" style="width: ' + (pieces[i][2][j][0] / 14) + 'in;">' + pieces[i][2][j][0] + '&quot;  ' + '</div>';
                    }

                    visual += '</div>';
                    resultHTML += visual;
                }

                resultHTML += '</div>';
                outHTML += resultHTML;

                outHTML += "<br/><br/><b>Total product needed:</b>&nbsp;";
                for (bl in pieceSummaryList)
                    outHTML += "&nbsp;" + pieceSummaryList[bl] + " of " + GetMaterialByLength(bl).description + "<br/>";
            }
        }
    }

    var outPane = document.getElementById(' ');
    outPane.innerHTML = outHTML;

    if (document.getElementById('OutputInNewWindow').checked) {
        w = window.open();
        w.document.write(
            '<html><head><title> </title></head>' +
            '<style>' +
            ' #ResultVisualContainer {}' +
            ' #ResultVisualContainer .Piece {' +
            '   border: 1px solid black;' +
            '   white-space: nowrap;' +
            '   font-size: 15pt;' +
            '   text-align: left;' +
            '   height: 15px;' +
            '   padding: 0px;' +
            '   display: block;' +
            '	width: 900px;' +
            '	margin: 0 auto;' +
            '   background: #C0C0C0;' +
            ' }' +
            ' #ResultVisualContainer .Piece .Segment {' +
            '	width: 900px;' +
            '	margin: 0 auto;' +
            '   border-right: 1px solid black;' +
            '   text-align: center;' +
            '   height: 15px;' +
            '   display: inline-block;' +
            '   background: #FFFFFF;' +
            '   background: #FFFFFF;' +
            '   font-size: 15px;' +
            ' }' +
            ' #h1 {' +
            '   display: block;' +
            '	width: 900px;' +
            '	margin: 0 auto;' +
            ' }' +
            '</style></head><body>' +
            '<center>' +
            '<h1>Drawer Liner Cutting Guide</h1>' + outHTML +
            '</center>' +
            '</body></html>');
    }
}
