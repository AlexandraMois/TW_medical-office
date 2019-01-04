$(document).ready(function() {
	$.get("getProducts.php", process);
	$('#buy').on('click', function () {
		localStorage.setItem('cos',JSON.stringify(cosCumparaturi));
	});
});


var total = 0;
const cosCumparaturi = {};
var totalNou = 0;


function addToCart () {
	var name = $(this).parent().children(':nth-child(2)').text();
	var productName = $(this).parent().children(':nth-child(2)').text().split(' ').join('');
	var productPrice = $(this).prev().find('span').text();
	let cantitateMaxima = $(this).parent().children(':nth-child(3)').find('span').text();
	if (cosCumparaturi[productName] == undefined && (cantitateMaxima>0)) {
		cosCumparaturi[productName] = {
			pret: parseFloat(productPrice),
			cantitate: 1
		}
		total += Number(productPrice);
		document.getElementById('total').innerHTML = total.toFixed(2) + ' lei';

		var productHtml = '<tr><td>' + name + '</td><td id="cant' + productName + '">x' + ' ' + cosCumparaturi[productName].cantitate + '</td><td id="' + productName + '">' + productPrice + ' lei</td>\n' +
			'<td><button class="delbutton del-'+productName +'">x</button></td></tr>';
		$("#cart-products").append(productHtml);
		$('.delbutton.del-'+productName).on('click', function () {
			var pretScazut = $('#'+productName).text().replace(' lei','');
			delete cosCumparaturi[productName];
			$(this).parent().parent().remove();
			totalNou = $('#total').text().replace(' lei','');
			Number(totalNou);
			Number(pretScazut);
			totalNou -= pretScazut;
			total -= pretScazut;
			document.getElementById('total').innerHTML = totalNou.toFixed(2) + ' lei'



		})

	} else if (cantitateMaxima>cosCumparaturi[productName].cantitate){
		total += Number(productPrice);
		cosCumparaturi[productName].pret += parseFloat(productPrice);
		let pret=cosCumparaturi[productName].pret;
		cosCumparaturi[productName].cantitate += 1;
		document.getElementById(productName).innerHTML = pret.toFixed(2) + " lei";
		document.getElementById("cant" + productName).innerHTML = 'x ' + cosCumparaturi[productName].cantitate;
	} else {
		alert("Produsul nu mai exista in stoc!");

	}

}

function process(data) {
	var searchData = data;
	for (let i = 0; i < data.length; i++) {
		var product = data[i];
		var productHtml = '<div class="product container"" data-id="' + product.id + '">\n    ' + '<img src="' + product.imagine + '">' +
			'<h5>' + product.name + '</h5>\n    <h5>Stoc: <span>' + product.stoc + '</span></h5>\n    ' +
			'<div>Pret:\n        <span>' + product.pret + '</span> lei\n    </div>\n'  + '<button class="add-button">+</button>\n' + '<button class="det-button" data-toggle="modal" data-target="#myModal-'+ product.id +'">Detalii</button>' +
			'  <!-- Modal --> <div class="modal fade" id="myModal-'+ product.id +'" role="dialog"> <div class="modal-dialog modal-sm"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">'+ product.name +'</h4> </div> <div class="modal-body"> <p>'+ product.detalii +'</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Inchide</button> </div> </div> </div> </div></div>';
		switch (product.categorie) {
			case "Frumusete si ingrijire":
				$("#frumusete").append(productHtml);
				break;
			case "Suplimente alimentare":
				$("#suplimente").append(productHtml);
				break;
			case "Medicamente":
				$("#medicamente").append(productHtml);
				break;
			case "Produse naturiste":
				$("#naturiste").append(productHtml);
				break;
		}
	}

	$(".add-button").on('click', addToCart);

	$('#search-area').on("keyup", function () {
		var searchedText = $(this).val().toLowerCase();
		$('.nav-tabs a[href="#menu5"]').tab('show');
		$("#cautate").empty();
		for (let i = 0; i < data.length; i++) {
			var product = data[i];
			var productName = product.name.toLocaleLowerCase();
			if (searchedText === '' || productName.includes(searchedText)) {
				var productHtml = '<div class="product" data-id="' + product.id + '">\n    ' + '<img src="' + product.imagine + '">' +
					'<h5>' + product.name + '</h5>\n    <h5>Stoc: ' + product.stoc + '</h5>\n    ' +
					'<div>Pret:\n        <span>' + product.pret + '</span> lei\n    </div>\n    ' + '<button class="addbutton">+</button>\n' + '<button class="detbutton" data-toggle="modal" data-target="#Modal-'+ product.id +'">Detalii</button>' +
					'  <!-- Modal --> <div class="modal fade" id="Modal-'+ product.id +'" role="dialog"> <div class="modal-dialog modal-sm"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">'+ product.name +'</h4> </div> <div class="modal-body"> <p>'+ product.detalii +'</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Inchide</button> </div> </div> </div> </div></div>';

				$("#cautate").append(productHtml);
			}

		}
		$(".addbutton").on('click', addToCart);


		//  Object.keys(cosCumparaturi).forEach(key => {
		//  	console.log(key);          // the name of the current key.
		//  	console.log(cosCumparaturi[key].pret);   // the value of the current key.
		//  	console.log(cosCumparaturi[key].cantitate);   // the value of the current key.
		//  });
	})
}


