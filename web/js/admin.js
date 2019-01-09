/**
 * Created by anamadincea on 08.01.2019.
 */
let doctori = {}
let pacienti = {}


$.get("istoricDoctori.php", function(data) {
    doctori = data;
    const lista_doctori = Object.entries(data).map(function([key, value]) {
        return {
            doctor: key,
            consultatii: value.consultatii
        }
    })
    doctoriGridOptions.api.setRowData(lista_doctori);
})
$.get("istoricPacienti.php", function(data) {
    pacienti = data;
    console.log('pacienti: ', pacienti)
    const lista_pacienti = Object.entries(data).map(function([key, value]) {
        return {
            cnp: key,
            pacient: value.nume,
            telefon: value.telefon,
            consultatii: value.consultatii
        }
    })
    pacientiGridOptions.api.setRowData(lista_pacienti);
})

$('#exampleModal').on('show.bs.modal', function (event) {
    const clickedButton = event.relatedTarget;
    const tip = $(clickedButton).attr('data-tip');
    const id = $(clickedButton).attr('data-id');
    if (tip === 'doctor') {
        const consultatii = doctori[id].consultatii;
        let consultatii_html = '<ul>';
        Object.keys(consultatii).forEach(function(data_consultatie) {
            const ore_consultatii = consultatii[data_consultatie];
            let ore_consultatii_html = '<ul>'
            Object.keys(ore_consultatii).forEach(function(ora_consultatie){
                const consultatie = ore_consultatii[ora_consultatie];
                ore_consultatii_html += `<li><h5>${ora_consultatie}<p>${consultatie.nume_pacient} | ${consultatie.nume_serviciu} | ${consultatie.pret}</p></h5></li>`
            });
            ore_consultatii_html += '</ul>'
            consultatii_html += `<li><h4>${data_consultatie}</h4>${ore_consultatii_html}</li>`
        });
        consultatii_html += '</ul>'
        $('.modal-title').html(`Doctor: ${id}`);
        $('.modal-body').html(`
            <p>Consultatii </p>
            ${consultatii_html}
        `)
    } else {
        const pacient = pacienti[id];
        const consultatii = pacient.consultatii;
        let consultatii_html = '<ul>';
        Object.keys(consultatii).forEach(function(data_consultatie) {
            const ore_consultatii = consultatii[data_consultatie];
            let ore_consultatii_html = '<ul>'
            Object.keys(ore_consultatii).forEach(function(ora_consultatie){
                const consultatie = ore_consultatii[ora_consultatie];
                ore_consultatii_html += `<li><h5>${ora_consultatie}<p>${consultatie.nume_serviciu} | ${consultatie.pret}</p></h5></li>`
            });
            ore_consultatii_html += '</ul>'
            consultatii_html += `<li><h4>${data_consultatie}</h4>${ore_consultatii_html}</li>`
        });
        consultatii_html += '</ul>'
        $('.modal-title').html(`Doctor: ${pacient.nume}`);
        $('.modal-body').html(`
            <p>Consultatii </p>
            ${consultatii_html}
        `)
    }

});

function arata_consultatii_doctori(params) {

    return `<span type="button" class="detalii" data-tip="doctor" data-id="${params.data.doctor}" data-toggle="modal" data-target="#exampleModal">
                <i class="fas fa-briefcase-medical"></i>
            </span>`
}

const doctoriColumnDefs = [
    {
        headerName: "Doctor", field: "doctor", cellStyle: {outline: "none" },
        suppressSizeToFit: true, width:599
    },
    {
        headerName: "Consultatii", field: "consultatii", cellStyle: {outline: "none" }, width:199,
        suppressSizeToFit: true, suppressSorting: true, cellRenderer: arata_consultatii_doctori
    },
];

const doctoriGridOptions = {
    columnDefs: doctoriColumnDefs,
    enableColResize: true,
    enableSorting: true,
    animateRows: true,
    enableRangeSelection: false,
    suppressCellSelection: true,
    rowHeight: 50,
    rowStyle: {textAlign: "center", verticalAlign: "middle", borderBottom:"1px solid #ddd"},
};

// lookup the container we want the Grid to use
const eDoctoriGridDiv = document.querySelector('#ag-grid-doctori');

// create the grid passing in the div to use together with the columns & data we want to use
const doctoriGrid = new agGrid.Grid(eDoctoriGridDiv, doctoriGridOptions);

function onFiltrareDoctori() {
    doctoriGridOptions.api.setQuickFilter(document.getElementById('filtreaza-doctori').value);
}

function arata_consultatii_pacienti(params) {

    return `<span type="button" class="detalii" data-tip="pacient" data-id="${params.data.cnp}" data-toggle="modal" data-target="#exampleModal">
                <i class="fas fa-diagnoses"></i>
            </span>`
}

const columnDefs = [
    {
        headerName: "Pacient", field: "pacient", cellStyle: {outline: "none" },
        suppressSizeToFit: true, width: 199
    },
    {
        headerName: "CNP", field: "cnp", cellStyle: {outline: "none" },
        suppressSizeToFit: true, suppressSorting: true, width: 199
    },
    {
        headerName: "Telefon", field: "telefon", cellStyle: {outline: "none" },
        suppressSizeToFit: true, suppressSorting: true, width: 199
    },
    {
        headerName: "Consultatii", field: "consultatii", cellStyle: {outline: "none" }, width: 199,
        suppressSizeToFit: true, suppressSorting: true, cellRenderer: arata_consultatii_pacienti
    },
];

const pacientiGridOptions = {
    columnDefs: columnDefs,
    enableColResize: true,
    enableSorting: true,
    animateRows: true,
    enableRangeSelection: false,
    suppressCellSelection: true,
    rowHeight: 50,
    rowStyle: {textAlign: "center", verticalAlign: "middle", borderBottom:"1px solid #ddd"},
};

// lookup the container we want the Grid to use
const ePacientiGridDiv = document.querySelector('#ag-grid-pacienti');

// create the grid passing in the div to use together with the columns & data we want to use
const pacientiGrid = new agGrid.Grid(ePacientiGridDiv, pacientiGridOptions);

function onFiltrarePacienti() {
    pacientiGridOptions.api.setQuickFilter(document.getElementById('filtreaza-pacienti').value);
}

const filtreaza_doctori_input = $('#filtreaza-doctori');
const filtreaza_pacienti_input = $('#filtreaza-pacienti')

$('#myTab a#doctori-tab').tab('show') // Select tab by name
$('#myTab a#doctori-tab').on('click', function (e) {
    e.preventDefault();
    $(ePacientiGridDiv).hide();
    filtreaza_pacienti_input.hide();
    $(eDoctoriGridDiv).show();
    filtreaza_doctori_input.show;
    $(this).tab('show')
})

$('#myTab a#pacienti-tab').on('click', function (e) {
    e.preventDefault();
    $(eDoctoriGridDiv).hide();
    filtreaza_doctori_input.hide();
    $(ePacientiGridDiv).show();
    filtreaza_pacienti_input.show();
    $(this).tab('show')
})

