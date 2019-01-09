let specializari = {}
const zile = ['duminica', 'luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata'];
$.get("getData.php", procesareDate);
$.get("istoricDoctori.php", function(data) {
    console.log('istoricDoctori: ', data)
})
$.get("istoricPacienti.php", function(data) {
    console.log('istoricPacienti: ', data)
})

function procesareDate(specializari) {
    Object.keys(specializari).forEach(function (key) {
        const specializare = specializari[key];
        Object.keys(specializare).forEach(function (id) {
            const doctor = specializare[id];
            doctor.orar = formateazaOrar(doctor.orar);
            doctor.date_ocupate = formateazaDateOcupate(doctor.date_ocupate)
        })
    });
    $('.name').find('option').not(':first').remove();
    for (var specializare in specializari) {
        $('#specializari').append('<div class="col-md-2 about-w3-grids butonSpecializare"> <h4>'+ specializare +'</h4> </div>');
        $('.name').append('<option value="'+specializare+'">' + specializare + '</option>');
    }

    $('.name').on("click", function () {
        $('.doct').find('option').not(':first').remove();
        let spec = $(this).val();
        const specializare = specializari[spec];
        const doctori_ids = Object.keys(specializare);
        $('.doct').find('option').not(':first').remove();
        for (let i=0; i<doctori_ids.length;i++){
            const id = doctori_ids[i];
            const doctor = specializare[id];
            $('.doct').append('<option value="'+ id +'">' + doctor.nume + ' ' + doctor.prenume  + '</option>');
        }
    })

    $('.doct').on("click", function () {
        $('.serv').find('option').not(':first').remove();
        let id_doct = $(this).val();
        let specializare = $('.name').val();
        const doctor = specializari[specializare][id_doct];
        const servicii = Object.entries(doctor.servicii);
        const orar = doctor.orar;
        $('#datepicker1').datepicker( 'option', 'beforeShowDay', function(date) {
            var zileInOrar = Object.keys(orar);
            var ziuaSelectata = zile[date.getDay()];
            if (!zileInOrar.includes(ziuaSelectata)) {
                return [false, 'dateNA' , 'Ziua nu apare in orar']
            }
            const dataFormatata = moment(date).format("YYYY-MM-DD");
            const oreOcupate = doctor.date_ocupate[dataFormatata]
            if (oreOcupate) {
                const oreDisponibile = obtineOreDisponibile(date, orar, oreOcupate)
                if (oreDisponibile.length === 0) {
                    return [false, 'dateNA', 'Toate orele din aceasta zi sunt ocupate']
                }
            }
            return [true, '', '']
        });
        $('#datepicker1').datepicker('option', 'onSelect', function(dateText, inst) {
            const date = moment(dateText, "DD/MM/YYYY").toDate();
            const dataFormatata = moment(date).format("YYYY-MM-DD");
            const oreOcupate = doctor.date_ocupate[dataFormatata];
            const oreDisponibile = obtineOreDisponibile(date, orar, oreOcupate);
            $('.ora').find('option').not(':first').remove();
            oreDisponibile.forEach(function (ora) {
                $('.ora').append(`<option>${ora}:00-${ora+1}:00</option>`)
            })
        });
        $('.serv').find('option').not(':first').remove();
        servicii.forEach(function ([id, serviciu]) {
            Object.entries(serviciu).forEach(function ([type, valoare]) {
                $('.serv').append('<option value="'+ id +'">' + type+' '+ valoare +' lei'+ '</option>');
            })
        })

    })

    $('.butonSpecializare').on("click", function () {
        let spec = $(this).find("h4").text();
        $('.titlu-echipa').show() ;
        for (let specializare in specializari) {
            if (specializare == spec) {
                $('#team .team-row').empty();
                const doctori = specializari[specializare];
                for (let doctor_id in doctori){
                    const doctor = doctori[doctor_id];
                    $('#team .team-row').append('<div class="col-sm-3 thumbnail team-w3agile"><img src="images/t1.jpg" class="img-responsive" alt=""><div class="social-icons team-icons right-w3l fotw33"> <div class="caption"> <h4>'+ doctor.nume + ' '+ doctor.prenume +'</h4> </div> </div> </div>');
                }
            }
        }
    })
}


// const specializari = {
//     'alergologie': {
//         '1': {
//             'nume': 'Popescu',
//             'prenume': 'Ion',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'110',
//                 'control':'70',
//                 'test1':'200',
//                 'test2':'160'
//             }
//         },
//         '2': {
//             'nume': 'Alexandrescu',
//             'prenume': 'Maria',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'electrocardiograma':'200',
//                 'ecografie':'160'
//             }
//         }
//     },
//     'cardiologie': {
//         '3': {
//             'nume': 'Popescux',
//             'prenume': 'Ioxn',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'electrocardiograma':'200',
//                 'ecografie':'160'
//             }
//         },
//         '4': {
//             'nume': 'Alexandrescux',
//             'prenume': 'Mariax',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'electrocardiograma':'200',
//                 'ecografie':'160'
//             }
//         }
//     },
//     'dermatologie': {
//         '5': {
//             'nume': 'Marin',
//             'prenume': 'Ioana',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test':'200',
//                 'test2':'160'
//             }
//         },
//         '6': {
//             'nume': 'Stefan',
//             'prenume': 'Maria',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test1':'200',
//                 'test3':'160'
//             }
//         }
//     },
//     'endocrinologie': {
//         '7': {
//             'nume': 'Marin',
//             'prenume': 'Ioana',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test':'200',
//                 'test2':'160'
//             }
//         },
//         '8': {
//             'nume': 'Stefan',
//             'prenume': 'Maria',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test1':'200',
//                 'test3':'160'
//             }
//         }
//     },
//     'hematologie': {
//         '9': {
//             'nume': 'Marin',
//             'prenume': 'Ioana',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test':'200',
//                 'test2':'160'
//             }
//         },
//         '10': {
//             'nume': 'Stefan',
//             'prenume': 'Maria',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test1':'200',
//                 'test3':'160'
//             }
//         }
//     },
//     'pediatrie': {
//         '11': {
//             'nume': 'Marin',
//             'prenume': 'Ioana',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test':'200',
//                 'test2':'160'
//             }
//         },
//         '12': {
//             'nume': 'Stefan',
//             'prenume': 'Maria',
//             'orar':{
//                 'luni': '08:00-12:00',
//                 'marti': '12:00-16:00',
//                 'miercuri': '08:00-12:00',
//                 'joi': '12:00-16:00',
//                 'vineri': '10:00-14:00'
//             },
//             'date_ocupate': {
//                 "2018-12-11": ["12:00:00", "14:00:00"],
//                 "2018-12-12": ["08:00:00","09:00:00","10:00:00","11:00:00"]
//             },
//             'servicii':{
//                 'consultatie':'100',
//                 'control':'60',
//                 'test1':'200',
//                 'test3':'160'
//             }
//         }
//     }
// }

function fillRange (start, end) {
    return Array(end - start).fill().map((item, index) => start + index);
};

function obtineOreDisponibile (date, orar, oreOcupate = []) {
    const ziuaSelectata = zile[date.getDay()];
    const [start, stop] = orar[ziuaSelectata];
    const oreOrar = fillRange(start, stop);
    return oreOrar.filter(ora => !oreOcupate.includes(ora))
}

// TODO: formateaza tot orarul o singura data la inceput, altfel da eroare cand incerci sa selectezi doctorii de mai multe ori
function formateazaOrar(orar) {
    Object.keys(orar).forEach(function(zi) {
        orar[zi] = orar[zi]
            .split('-')
            .map(ora => parseInt(ora.substring(0,2)))
    })
    return orar
}
function formateazaDateOcupate(dateOcupate = {}) {
    Object.keys(dateOcupate).forEach(function(data) {
        dateOcupate[data] = dateOcupate[data]
            .map(function(ora) {return parseInt(ora.substring(0,2))});
    })
    return dateOcupate;
}
