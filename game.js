const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;
let obstacles;
let coins;
let score = 0;
let scoreText;
let gameOver = false;

function preload() {
  this.load.image('player', 'https://i.imgur.com/8Q2QKQp.png');
  this.load.image('ground', 'https://i.imgur.com/rXH0z5G.png');
  this.load.image('obstacle', 'https://i.imgur.com/3WbKZ0y.png');
  this.load.image('coin', 'https://i.imgur.com/7yUvePI.png');
}

function create() {
  this.add.text(20, 20, 'ENDLESS RUNNER', { fontSize: '20px', fill: '#fff' });

  const ground = this.physics.add.staticImage(400, 380, 'ground');
  ground.setScale(2, 1).refreshBody();

  player = this.physics.add.sprite(100, 300, 'player');
  player.setScale(0.5);
  player.setCollideWorldBounds(true);

  obstacles = this.physics.add.group();
  coins = this.physics.add.group();

  scoreText = this.add.text(650, 20, 'Score: 0', {
    fontSize: '18px',
    fill: '#fff'
  });

  this.physics.add.collider(player, ground);
  this.physics.add.collider(obstacles, ground);

  this.physics.add.overlap(player, obstacles, hitObstacle, null, this);
  this.physics.add.overlap(player, coins, collectCoin, null, this);

  this.time.addEvent({
    delay: 1500,
    callback: spawnObstacle,
    callbackScope: this,
    loop: true
  });

  this.time.addEvent({
    delay: 1000,
    callback: spawnCoin,
    callbackScope: this,
    loop: true
  });

  this.input.keyboard.on('keydown-SPACE', () => {
    if (player.body.touching.down && !gameOver) {
      player.setVelocityY(-450);
    }
  });

  this.input.on('pointerdown', () => {
    if (player.body.touching.down && !gameOver) {
      player.setVelocityY(-450);
    }
  });
}

function update() {
  if (gameOver) return;

  score++;
  scoreText.setText('Score: ' + score);

  obstacles.getChildren().forEach(obstacle => {
    obstacle.setVelocityX(-300);
    if (obstacle.x < -50) obstacle.destroy();
  });

  coins.getChildren().forEach(coin => {
    coin.setVelocityX(-300);
    if (coin.x < -50) coin.destroy();
  });
}

function spawnObstacle() {
  if (gameOver) return;

  const obstacle = obstacles.create(850, 340, 'obstacle');
  obstacle.setScale(0.5);
  obstacle.setVelocityX(-300);
  obstacle.setImmovable(true);
}

function spawnCoin() {
  if (gameOver) return;

  const coin = coins.create(850, Phaser.Math.Between(200, 300), 'coin');
  coin.setScale(0.3);
  coin.setVelocityX(-300);
}

function collectCoin(player, coin) {
  coin.destroy();
  score += 50;
}

function hitObstacle() {
  gameOver = true;
  this.add.text(300, 200, 'GAME OVER', {
    fontSize: '32px',
    fill: '#ff0000'
  });
  this.physics.pause();
}
