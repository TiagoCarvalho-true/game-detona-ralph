const state = {
    view:{
       squares: document .querySelectorAll(".square"),
       enemy: document .querySelector(".enemy"),
       timeLeft: document .querySelector("#time-left"),
       score: document .querySelector("#score")
    },
    values:{
       gameVelocity:1000, 
       hitPosition:0,  
       result: 0, 
       curretTime:60,
       lives:25
    },
    actions:{
       timeId:setInterval(randomSquare, 1000),
       countDownTimeID:setInterval(countDown, 1000),
    }
};
function playSound(audioName, loop = false){
    let audio = new Audio (`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.loop = loop
    audio.play();
    return audio;
}
function resetGame() {
    state.values.result = 0;
    state.values.curretTime = 60;
    state.values.lives = 25; // Reinicia as vidas para 3
    state.view.score.textContent = 0;
    state.view.timeLeft.textContent = 60;
    updateLives(); // Atualiza o contador de vidas na tela

    clearInterval(state.actions.timeId);
    clearInterval(state.actions.countDownTimeID);

    state.actions.timeId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimeID = setInterval(countDown, 1000);

    if (state.audioBackground) {
        state.audioBackground.pause();
        state.audioBackground.currentTime = 0;
    }
    state.audioBackground = playSound("fundo", true);
}

document.getElementById('restart-btn').addEventListener('click', () => {
    resetGame(); // Reinicia o jogo
    document.getElementById('restart-btn').style.display = 'none'; // Esconde o botão novamente
});
function countDown() 
{
    state.values.curretTime--;
    state.view.timeLeft.textContent =  state.values.curretTime;
    if (state.values.curretTime <= 0){
        playSound("gameOver");
    
        alert("Game Over! Voce obteve: " + state.values.result + " points");

        clearInterval(state.actions.countDownTimeID);
        clearInterval(state.actions.timeId); 
        document.getElementById('restart-btn').style.display = 'block';
    }  
}

function randomSquare()
{
    state.view.squares.forEach((square)=>{
        square.classList.remove("enemy")
    });

    let randomNumber = Math.floor(Math.random()*9);
    let randomSquare =  state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitbox()
{
    state.view.squares.forEach((square)=> {
        const martelo = document.getElementById('#martelo');
      square.addEventListener("mousedown", ()=>{
            

        if (square.id === state.values.hitPosition){
         state.values.result++;
         state.view.score.textContent =  state.values.result;
         state.values.hitPosition = null;
         playSound("hit");
        } else {
            // Se o jogador clicar no quadrado errado, ele perde uma vida
            state.values.lives--;
            playSound("error"); // Adicione um som opcional para indicar um erro
            updateLives();
           
            // Verifica se acabou as vidas
            if (state.values.lives <= 0) {
                playSound("gameOver");
                alert("Game Over! Você obteve: " + state.values.result + " pontos");
                clearInterval(state.actions.countDownTimeID);
                clearInterval(state.actions.timeId);
                resetGame(); // Reinicia o jogo
            }
        }
      });
    });
}
function updateLives() {
    const livesElement = document.querySelector(".menu-lives h2");
    livesElement.textContent = `x${state.values.lives}`;
}
function initialize(){
      addListenerHitbox();
      state.audioBackground = playSound("fundo", true);
}
initialize();