const width = 12;
const table = 300;
const colorEat = 'red';
const colorSnake = 'black';

// Obtenemos el span del score
const scoreBoard = document.getElementById('score');
scoreBoard.innerHTML = 0;

// Obtenemos el canvas y el context
const ctx = document.getElementById('canvas').getContext('2d');

export {width, table, colorEat, colorSnake, scoreBoard, ctx};