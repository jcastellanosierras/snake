import start from './utils.js'

document.getElementById('start-button').onclick = newGame;

function newGame(){
	console.log("Hola");
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    start();
}