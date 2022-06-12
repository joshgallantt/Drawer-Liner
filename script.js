$(document).ready(function () {

    $('.add-button').click(function () {
        $(this).prev().val(+$(this).prev().val() + 1);
    });
    $('.sub-button').click(function () {
        if ($(this).next().val() > 0) $(this).next().val(+$(this).next().val() - 1);
    });

    $('input').bind('keypress', function (e) {
        return !(e.which != 8 && e.which != 0 &&
            (e.which < 48 || e.which > 57) && e.which != 46);
    });

    $('.incrementor input').click(function () {
        $(this).select();
    });

    $('.calculate').click(calculate);

    $('.reset').click(function () {
        $(".drawer").val('0');
        $("#diagram").empty();
    });



});

function calculate() {

    var sum = 0;
    $('.drawer').each(function(){
        sum += parseFloat(this.value);
    });
    
    if (sum == 0) return

    $("#diagram").empty();

    //corresponding inner dimensions of the drawers
    const trueLength12 = 7;
    const trueLength15 = 10.25;
    const trueLength18 = 13.5;
    const trueLength21 = 16.25;
    const trueLength24 = 19.25;
    const trueLength30 = 25.25;
    const trueLength36 = 31;

    //get data from form
    let qtyReq12 = document.getElementById("12").value;
    let qtyReq15 = document.getElementById("15").value;
    let qtyReq18 = document.getElementById("18").value;
    let qtyReq21 = document.getElementById("21").value;
    let qtyReq24 = document.getElementById("24").value;
    let qtyReq30 = document.getElementById("30").value;
    let qtyReq36 = document.getElementById("36").value;
    let chosenMaterial = document.querySelector('input[name="liner"]:checked').value;

    //create arrays to loop through
    lengthArray = [trueLength12, trueLength15, trueLength18, trueLength21, trueLength24, trueLength30, trueLength36];
    needed = [qtyReq12, qtyReq15, qtyReq18, qtyReq21, qtyReq24, qtyReq30, qtyReq36];

    let pieces = [];
    let cutsList = [];
    let offcuts = new Array(pieces.length);
    let usedCount = 0;

    //for each number of cuts, push the corresponding true size to an array
    let index = 0;
    needed.forEach(element => {
        for (i = 0; i < element; i++) {
            pieces.push(lengthArray[index])
        };
        index++;
    });
    pieces.reverse()

    // Create an array to store remaining offcuts

    // Place items one by one
    for (let i = 0; i < pieces.length; i++) {
        // Find the first bin that can accommodate
        // our piece
        let j;
        for (j = 0; j < usedCount; j++) {
            if (offcuts[j] >= pieces[i]) {
                offcuts[j] = offcuts[j] - pieces[i];
                cutsList[j].push(pieces[i])
                break;
            }
        }

        // If no remaining piece could accommodate liner[i]
        if (j == usedCount) {
            offcuts[usedCount] = chosenMaterial - pieces[i];
            cutsList.splice(j, 0, [pieces[i]])
            usedCount++;
        }
    }

    $(".diagram").append("<h3>Cutting Diagram:<h3>");


    for (let i = 0; i < cutsList.length; i++) {
        let cutsUsed = 0;
        const element = cutsList[i];
        for (let j = 0; j < cutsList[i].length; j++) {
            const element = cutsList[i][j];
            $(".diagram").append('<div class="segment" style="width: ' + Math.floor(((element / chosenMaterial) * 100)) + '%;">' + element + '&quot;  ' + '</div>')
            cutsUsed += element
        }
        if (cutsUsed != chosenMaterial) {
            $(".diagram").append('<div class="segment" style="background-color: whitesmoke; width: ' + Math.floor(((((chosenMaterial - cutsUsed)) / chosenMaterial) * 100)) + '%;">' + '&nbsp' + '</div>')
        }
        $(".diagram").append(`<br>`)
    }



};

