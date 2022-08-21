var cards = [];
var oneVisible = false;
var turnCounter = 0;
var visible_nr;
var lock = false;
var pairsLeft = 6;
var number = 1;

$(".c").click(function() {
    id = $(".c").index(this);
    element = $(".c").eq(this);

    revealCard(id);
    console.log(id);
});  

//Fill table with photo numbers
for(i=0; i<12; i++) {
    if(number == 7) number = 1;
    cards[i] = number;
    number++;
}

//Randomize position of numbers in array "cards"
function random(array) {
    var m = array.length, t, i;

    // While there remain elements to random
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

random(cards);

function revealCard(nr) {

    if(visible_nr == nr) return;

    if(lock == false) {
        lock = true;

        var obraz = "url(img/"+cards[nr]+".png)";

        $('.c').eq(nr).css('background-image', obraz);
        $('.c').eq(nr).addClass('cardA');
        $('.c').eq(nr).removeClass('card');

        if(oneVisible == false) {   
            //first card
            oneVisible = true;
            visible_nr = nr; 
            lock = false;
        } else {      
            //second card  
            if((cards[visible_nr] == cards[nr])) {
                //alert("para");
                setTimeout(function() { hide2Cards(visible_nr, nr) }, 750);
            } else {
                //alert("pudło");
                setTimeout(function() { restore2Cards(visible_nr, nr) }, 750);
            }

            turnCounter++;
            $('.score').html('Turn counter: ' + turnCounter);
            oneVisible = false;
        }
    }
    
}

function hide2Cards(nr1, nr2) {
    $('.c').eq(nr1).css('visibility', 'hidden'); 
    $('.c').eq(nr2).css('visibility', 'hidden'); 

    pairsLeft--;
    
    if(pairsLeft == 0) {
        $('.board').html('<h1>You win! <br/>Done in ' + turnCounter + '</h1>');
    }
    lock = false;
}

function restore2Cards(nr1, nr2) {
    $('.c').eq(nr1).css('background-image', 'url(img/karta.png)'); 
    $('.c').eq(nr1).addClass('card');
    $('.c').eq(nr1).removeClass('cardA');
    
    $('.c').eq(nr2).css('background-image', 'url(img/karta.png)'); 
    $('.c').eq(nr2).addClass('card');
    $('.c').eq(nr2).removeClass('cardA');

    visible_nr=100;
    lock = false;
}