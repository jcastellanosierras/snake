import {ctx, scoreBoard, width, table, colorEat, colorSnake} from './constants.js'

// Generar comida
const genEat = (ctx, snakeCoor) => {
    let resto;
    let validCoor;
    let x, y;
    let cont;

    do{
        x = Math.floor(Math.random() * (table - width));
        if((resto = x % width) != 0){
            x += (width - resto);
        }

        y = Math.floor(Math.random() * (table - width));
        if((resto = y % width) != 0){
            y += (width - resto);
        }

        validCoor = true;
        cont = 0;
        while((cont < snakeCoor.length) && validCoor){
            if((x == snakeCoor[cont].x) && (y == snakeCoor[cont].y)) validCoor = false;
            cont++;
        }
    }while(!validCoor)
    
    ctx.fillStyle = colorEat;
    ctx.fillRect(x, y, width, width);
    ctx.fillStyle = colorSnake;

    return [x, y];
}

// Inicializar snake
const startSnake = (ctx) => {
    let resto;

    let x = Math.floor(Math.random() * (table - width));
    if((resto = x % width) != 0){
        x += (width - resto);
    }

    let y = Math.floor(Math.random() * (table - width));
    if((resto = y % width) != 0){
        y += (width - resto);
    }
    
    ctx.fillRect(x, y, width, width);

    return {
        x: x,
        y: y
    };
}

// Avanzar snake
const advance = (coor, direction) => {
    // Las posiciones anteriores cogen la coordenada de la posición siguiente
    let aux, aux2;
    for(let i = 1; i < coor.length; i++){
        if(i == 1){
            aux = coor[i];
            coor[i] = coor[i-1];
        }else if(i % 2 == 0){
            aux2 = coor[i];
            coor[i] = aux;
        }else{
            aux = coor[i];
            coor[i] = aux2;
        }
    }

    // Y avanzamos la primera posición de la serpiente
    let newCoor;
    if(direction == 'down'){
        newCoor = {
            x: coor[0].x,
            y: coor[0].y + width
        };
        coor[0] = newCoor;
    }

    if(direction == 'right'){
        newCoor = {
            x: coor[0].x + width,
            y: coor[0].y
        };
        coor[0] = newCoor;
    }

    if(direction == 'up'){
        newCoor = {
            x: coor[0].x,
            y: coor[0].y - width
        };
        coor[0] = newCoor;
    }

    if(direction == 'left'){
        newCoor = {
            x: coor[0].x - width,
            y: coor[0].y
        };
        coor[0] = newCoor;
    }
}

const checkShock = (coor) => {
    let gameOver = false;
    if((coor[0].x == (0-width)) || (coor[0].x == table) || (coor[0].y == (0-width)) || (coor[0].y == table)){
        alert('Game Over');
        gameOver = true;
    }

    let i = 1;
    while((i < coor.length) && !gameOver){
        if((coor[0].x == coor[i].x) && (coor[0].y == coor[i].y)){
            alert('Game Over');
            gameOver = true;
        }
        i++;
    }

    return gameOver;
}

// Establecer dirección
const setDirection = (tecla, direction, changed) => {

    let nextDirection = null;

    if(tecla.key == 'ArrowLeft'){
        if(direction != 'right'){
            if(changed){
                nextDirection = 'left';
            }else{
                direction = 'left';
                changed = true;
            }
        }
    }

    if(tecla.key == 'ArrowUp'){
        if(direction != 'down'){
            if(changed){
                nextDirection = 'up';
            }else{
                direction = 'up';
                changed = true;
            }
        }
    }

    if(tecla.key == 'ArrowRight'){
        if(direction != 'left'){
            if(changed){
                nextDirection = 'right';
            }else{
                direction = 'right';
                changed = true;
            }
        }
    }

    if(tecla.key == 'ArrowDown'){
        if(direction != 'up'){
            if(changed){
                nextDirection = 'down';
            }else{
                direction = 'down';
                changed = true;
            }
        }
    }

    return [direction, changed, nextDirection];
}

const start = () => {
    // Variables del programa
    let score = 0;
    scoreBoard.innerHTML = score;
    let xLast, yLast;
    let direction = 'down';
    let nextDirection; // Variable que, cuando se pulsan dos teclas seguidas, guarda la siguiente dirección y sentido
    let xEat, yEat;
    let snakeCoor = [];
    let timeRefresh = 150;
    let changeTimeRefresh = [5, 10, 15, 20, 25, 30, 35, 45, 50];
    // let changeTimeRefresh = [25, 50, 75, 100, 150, 200, 275, 350, 500];

    // Limpia toda la pantalla
    ctx.clearRect(0, 0, table, table);

    // Detecta cuando se pulsa una tecla
    // No deja cambiar hacia el sentido contrario actual
    let changedDir = false; // Variable que controla que la dirección no se cambie dos veces antes de avanzar la serpiente
    document.onkeydown = (tecla) => {
        [direction, changedDir, nextDirection] = setDirection(tecla, direction, changedDir);
    }

    let interval;

    const play = () => {
        // Avanzamos la serpiente
        xLast = snakeCoor[snakeCoor.length-1].x;
        yLast = snakeCoor[snakeCoor.length-1].y;

        advance(snakeCoor, direction);
        if(nextDirection != null) direction = nextDirection;
        changedDir = false;

        // Comprobamos si ha habido choque
        if(checkShock(snakeCoor)){
            clearInterval(interval);
            document.getElementById('game-over').style.display = 'block';
            document.getElementById('menu').style.display = 'block';
            document.getElementById('game').style.display = 'none';
        }else{
            // Pintamos todas las coordenadas de la serpiente
            for(let i = 0; i < snakeCoor.length; i++){
                ctx.fillRect(snakeCoor[i].x, snakeCoor[i].y, width, width);
            }
            ctx.clearRect(xLast, yLast, width, width);

            if((snakeCoor[0].x == xEat) && (snakeCoor[0].y == yEat)){
                [xEat, yEat] = genEat(ctx, snakeCoor);
                score++;
                scoreBoard.innerHTML = score;
                snakeCoor.push({
                    x: xLast,
                    y: yLast
                });
                ctx.fillRect(xLast, yLast, width, width);
                changeTimeRefresh.forEach((points) => {
                    if(score == points){
                        clearInterval(interval);
                        timeRefresh -= 10;
                        console.log(timeRefresh);
                        interval = setInterval(play, timeRefresh);
                    }
                })
            }
        }
    }

    // Iniciamos la serpiente en una coordenada aleatoria
    snakeCoor.push(startSnake(ctx));
    [xEat, yEat] = genEat(ctx, snakeCoor);
    setTimeout(() => {
        interval = setInterval(play, timeRefresh);
    }, 600);
}

export default start;