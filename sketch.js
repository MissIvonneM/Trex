//Referencia C14 a  C15 con la plantilla del PROC15

// Declara variables pasa los estados del juego 
var PLAY = 1;            
var END = 0;             
var gameState = PLAY;    

 

var trex, trex_running, trex_collided;       
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstacle, obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound, checkPointSound, dieSound; 

var message = "This is a Message";     //D) Profe
    



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");   
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");         
  obstacle2 = loadImage("obstacle2.png");         
  obstacle3 = loadImage("obstacle3.png");         
  obstacle4 = loadImage("obstacle4.png");         
  obstacle5 = loadImage("obstacle5.png");         
  obstacle6 = loadImage("obstacle6.png");        
  
  //Precargar la imágenes del Game Over y Restart
  gameOverImg = loadImage("gameOver.png");     
  restartImg = loadImage("restart.png");       
  
  
  //Precargar Sonidos del Juego
  jumpSound = loadSound("jump.mp3")      
  dieSound = loadSound("die.mp3")        
  checkPointSound = loadSound("checkPoint.mp3")    
  
  
}

function setup() {
  createCanvas(600, 200);
  
  //var message = "This is a Message";     //A) Profe
  //console.log("Hola"+ " "* "Mundo");      
  //console.log(message);          // B) Profe
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);  
  trex.scale = 0.5;
  
  //Ver el área de Collisión (Probar parámetros)
  //trex.setCollider("circle",0,0,40);     
   
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);

  //Crea los Sprites del Game Over y de Restart
  gameOver=createSprite(300,80,100,40);       
  gameOver.addImage(gameOverImg);             
  
  restart=createSprite(300,110,100,40);     
  restart.addImage(restartImg);           
  
  
   //Hace menos grande las imágenes
  gameOver.scale = 0.5;
  restart.scale = 0.5;
    
  gameOver.visible = false;
  restart.visible = false;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
                               
  
  score = 0;
  
  // Crea los grupos de Obstáculos y Nubes
  obstaclesGroup = new Group();      
  cloudsGroup = new Group();
   
  //
  trex.setCollider("rectangle",0,0, trex.width,trex.height);  
  trex.debug = false;     

 
  //var message = "This is a Message"
  
  
}

function draw() {
  background(140);
  
  //console.log(message);          // C) Profe
  
  fill("white");          
  
  //Texto de Puntución se ve siempe
  text("Puntuación: "+ score, 500,50);      

  
  
  //Condiciona actividades a los gameStates
  if(gameState === PLAY) {         
     
     // Muestra el valor delScore, pero no el texto   
      score = score + Math.round(frameCount/60);   
    
    //Se mueve mientras está en PLAY
    //ground.velocityX = -4;    //G) Student   
     ground.velocityX = -(4+2*score/400);    
    
    //change the trex animation       // 
    trex.changeAnimation("running", trex_running);   //
    
    
    //Sonido 100 puntos del Score
    if(score>0 && score%100 === 0){       
       checkPointSound.play()             
    }
    
    // Se reestablece el suelo, se mueve.
     if (ground.x < 0){              
    ground.x = ground.width/2;
     }
    
    //Trex se mueve en PLAY, no en END
    trex.velocityY = trex.velocityY + 0.8    
    
    //Aparece las nubes
    spawnClouds();                    
   
    //Aparecen los obstáculos
    spawnObstacles();                   
    
     if(mousePressedOver(restart) && gameState === END){           //E) Profe   
    //console.log("Reinicia el juego")      //F) Profe
    reset();       // Ga) Profe
     }
       
    //Si Trex toca obstaculos cambia a END en gameState
    if(obstaclesGroup.isTouching(trex)) {  
      // I) Student
      trex.velocityY=-12;
      //jumpSound.play();
      //Sonido cuando muere el Trex
      dieSound.play();                   
      gameState = END;                
      
      
    }     
  }   
  else if(gameState === END) {
    
   
    
    // Se detiene Suelo cuando el gameState es END
       ground.velocityX = 0;       
          
    // Detiene movimiento de los obstáculos 
      obstaclesGroup.setVelocityXEach(0);      
    
    // Ya no desaparecen los obtáculos
      obstaclesGroup.setLifetimeEach(-1);    
    
    // Se detiene el movimiento de las nubes
      cloudsGroup.setVelocityXEach(0);     
    
     // Ya no desaparecen los obtáculos cambiamos tiempo de vida
      cloudsGroup.setLifetimeEach(-1);    
    
    //Cambia la Animación del Trex cuando choca con obstáculos
      trex.changeAnimation("collided",trex_collided)   
    
    //Quita el movimiento del salto al Trex
      trex.velocityY = 0;     
    
    gameOver.visible = true;
    restart.visible = true;
    
    //if(mousePressedOver(restart)){           //E) Profe   
    //console.log("Reinicia el juego")      //F) Profe
    //reset();       // Ga) Profe
  //}
  
    
   
   }

  
  if(keyDown("space")&& trex.y>=160) { 
    trex.velocityY = -13;
    
    //Sonido cuando brinca
    jumpSound.play();         
  }
  
  
  //Siempre Collisiona al Piso
  trex.collide(invisibleGround);    
  
  
  
  
  
  drawSprites();
}

function spawnObstacles(){         
 if (frameCount % 60 === 0){
   //var obstacle = createSprite(400,165,10,40);   
   var obstacle = createSprite(600,165,10,40);  
                                     
   obstacle.shapeColor= "green";                     
   //obstacle.velocityX = -4;                     
 
   //Incrementa la velocidad de los obstáculos
   obstacle.velocityX = -(6 + score/200);     
   //ground.velocityX = obstacle.velocityX;    
   
    //Genera obstáculos al azar 
    var rand = Math.round(random(1,6));             
    switch(rand) {                                  
      case 1: obstacle.addImage(obstacle1);         
              break; 
      case 2: obstacle.addImage(obstacle2);         
              break; 
      case 3: obstacle.addImage(obstacle3);         
              break;
      case 4: obstacle.addImage(obstacle4);         
              break;
      case 5: obstacle.addImage(obstacle5);         
              break;
      case 6: obstacle.addImage(obstacle6);         
              break;
      default: break;
    
    }
   
    //asigna escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.5;                           
    obstacle.lifetime = 300;                        
   
   // Agrega los obstáculos a su grupo
   obstaclesGroup.add(obstacle);    
 }
}


function spawnClouds() {
  
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.6;
    cloud.velocityX = -3;
    
     //asigna ciclo de vida a la variable 
    cloud.lifetime = 220;                  
    
    //ajusta la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    // Agrega nubes a su grupo
    cloudsGroup.add(cloud);      
  }
  
}
 
function reset(){    // Gb Profe
   gameState = PLAY;      // Aa) Student
   gameOver.visible = false;   // Ab) Student
   restart = false;            // Ab) Student
  
   obstaclesGroup.destroyEach();     //Ac)) Student
   cloudsGroups.destroyEach();     //Ac)) Student
   trex.changeAnimation("running", tres_running);  //Ad)) Student
}