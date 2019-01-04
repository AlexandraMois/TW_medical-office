/**
 * Created by anamadincea on 03.06.2018.
 */
$(document).ready(function() {
    $.get("getProducts.php", adaugaProduse);
});

var tabel = document.getElementById("tabel");
document.getElementById("active").style.backgroundColor="yellow";
var butoaneSelectate = document.getElementsByClassName('filtreaza');

function adaugaProduse(data) {

    for (let i = 0; i < data.length; i++) {
        var coloane = '<td><input type="checkbox" value="'+ data[i].pret +'" name="'+ data[i].id +'"></td><td>' + data[i].id +'</td><td>'+ data[i].name + '</td><td id="2'+ data[i].id +'">' + data[i].stoc + '</td><td id="'+ data[i].id +'">' + data[i].pret + '</td><td>' + data[i].categorie + '</td>';
        var rand = document.createElement('tr');
        rand.innerHTML = coloane;
        if (data[i].stoc<=3){
            rand.style.color="red";
        }
        tabel.appendChild(rand);
    }
    for(let i = 0; i < butoaneSelectate.length; i++) {
        butoaneSelectate[i].addEventListener("click", function() {
            while (tabel.childNodes.length > 2) {
                tabel.removeChild(tabel.lastChild);
            }
            if (this.innerText === "Toate") {
                document.getElementById("active").style.backgroundColor = "yellow";
                for (let i = 0; i < data.length; i++) {
                    var coloane = '<td><input type="checkbox" value="'+ data[i].pret +'" name="'+ data[i].id +'"></td><td>' + data[i].id +'</td><td>'+ data[i].name + '</td><td id="2'+ data[i].id +'">' + data[i].stoc + '</td><td id="'+ data[i].id +'">' + data[i].pret + '</td><td>' + data[i].categorie + '</td>';
                    var rand = document.createElement('tr');
                    rand.innerHTML = coloane;
                    if (data[i].stoc<=3){
                        rand.style.color="red";
                    }
                    tabel.appendChild(rand);
                };
            } else for (let i = 0; i < data.length; i++) {
                document.getElementById("active").style.backgroundColor="#cff27d"
                if (this.innerText === data[i].categorie) {
                    var coloane = '<td><input type="checkbox" value="'+ data[i].pret +'" name="'+ data[i].id +'"></td><td>' + data[i].id +'</td><td>'+ data[i].name + '</td><td id="2'+ data[i].id +'">' + data[i].stoc + '</td><td id="'+ data[i].id +'">' + data[i].pret + '</td><td>' + data[i].categorie + '</td>';
                    var rand = document.createElement('tr');
                    rand.innerHTML = coloane;
                    if (data[i].stoc<=3){
                        rand.style.color="red";
                    }
                    tabel.appendChild(rand);
                }
            }

        })
    }
    $("#reducere").on('click', aplicaReducere);
    $("#crestere").on('click', cresterePret);
    $("#comanda").on('click', comandaFurnizor);
}

function aplicaReducere() {
    var produseModificate = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
        document.getElementById(checkboxes[i].name).innerHTML= (parseFloat(checkboxes[i].value)-parseFloat(checkboxes[i].value)*10/100).toFixed(2);
        checkboxes[i].value = (parseFloat(checkboxes[i].value)-parseFloat(checkboxes[i].value)*10/100).toFixed(2);
        produseModificate[i] = {id : checkboxes[i].name,
            pret : checkboxes[i].value};
    }
    $.post( "modifyProducts.php", {produse: produseModificate} );
}

function cresterePret() {
    var produseModificate = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
        document.getElementById(checkboxes[i].name).innerHTML= (parseFloat(checkboxes[i].value)+ parseFloat(checkboxes[i].value)*10/100).toFixed(2);
        checkboxes[i].value = (parseFloat(checkboxes[i].value) +parseFloat(checkboxes[i].value)*10/100).toFixed(2);
        produseModificate[i] = {id : checkboxes[i].name,
            pret : checkboxes[i].value};
    }
    console.log(produseModificate);
    $.post( "modifyProducts.php", {produse: produseModificate} );
}

function comandaFurnizor() {
    var produseModificate = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
        document.getElementById('2'+checkboxes[i].name).innerHTML = parseInt(document.getElementById('2'+checkboxes[i].name).innerHTML)+5;
        produseModificate[i] = {id : checkboxes[i].name,
            stoc : parseInt(document.getElementById('2'+checkboxes[i].name).innerHTML)};
    }
     $.post( "modifStoc.php", {produse: produseModificate} );

}



