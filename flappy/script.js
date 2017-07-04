var width = document.documentElement.clientWidth
var height = document.documentElement.clientHeight
var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    play: play,
    update: update
})

function preload() {
    console.log('preload')
    // var loading = this.load.image('loading', './assets/background.png')
    // var loading = this.add.sprite(this.world.centerX, this.world.centerY, 'loading')
    // loading.anchor.setTo(0.5)
    // this.load.setPreloadSprite(loading)

    this.load.image('background', './assets/background.png')
    this.load.spritesheet('bird', './assets/bird.png', 34, 24, 3)

    game.load.image('ground', 'assets/ground.png'); //地面
    game.load.image('title', 'assets/title.png'); //游戏标题
    game.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3); //鸟
    game.load.image('btn', 'assets/start-button.png'); //按钮
    game.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2); //管道
    game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt'); //显示分数的字体
    game.load.audio('fly_sound', 'assets/flap.wav'); //飞翔的音效
    game.load.audio('score_sound', 'assets/score.wav'); //得分的音效
    game.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
    game.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效

    game.load.image('ready_text', 'assets/get-ready.png'); //get ready图片
    game.load.image('play_tip', 'assets/instructions.png'); //玩法提示图片
    game.load.image('game_over', 'assets/gameover.png'); //gameover图片
    game.load.image('score_board', 'assets/scoreboard.png'); //得分板
    game.load.spritesheet('medal', 'assets/medals.png', 44, 46, 2)
}

function create() {
    console.log('create')
    this.soundFly = this.add.audio('fly_sound')
    this.hitPipe = this.add.audio('hit_pipe_sound')
    this.hitGround = this.add.audio('hit_ground_sound')
    var bg = this.add.tileSprite(0, 0, width, height, 'background')
    bg.autoScroll(-10, 0)
    var ground = this.add.tileSprite(0, height - 112, width, 112, 'ground')
    ground.autoScroll(-100, 0)
    var _this = this
    // 开始按钮
    var start = this.add.button(this.world.centerX, this.world.centerY, 'btn', function () {
        // alert(1)
        _this.play()
    })
    start.anchor.set(0.5)

    var titleGroup = this.add.group()
    var title = titleGroup.create(0, 0, 'title')
    title.anchor.setTo(0.5)
    title.x = this.world.centerX
    title.y = 100
    var bird = titleGroup.create(0, 0, 'bird')
    bird.anchor.setTo(0.5)
    bird.x = this.world.centerX + title.width / 2 + 25
    bird.y = 100
    bird.animations.add('birdFly', [0, 1, 2], 10, true)
    bird.play('birdFly')
    this.add.tween(titleGroup).to({
        y: -20
    }, 1000, null, true, 0, -1, true)
    this.currentScored = 0
    this.bestScored = 0
}

function play() {
    console.log('play')
    this.background = this.add.tileSprite(0, 0, width, height, 'background')
    this.ground = this.add.tileSprite(0, height - 112, width, 112, 'ground')
    this.ground.autoScroll(100, 0)
    // 开启地面的物理系统
    this.physics.enable(this.ground, Phaser.Physics.ARCADE)
    // 让地面在物理环境中固定不动
    this.ground.body.immovable = true
    this.readyText = this.add.sprite(this.world.centerX, 200, 'ready_text')
    this.readyText.anchor.setTo(0.5)
    this.bird = this.add.sprite(100, 350, 'bird')
    this.bird.anchor.setTo(0.5)
    this.bird.animations.add('birdFly')
    this.bird.play('birdFly', 12, true)
    this.physics.enable(this.bird, Phaser.Physics.ARCADE)
    this.bird.body.gravity.y = 0
    this.playTip = this.add.sprite(120, 320, 'play_tip')
    this.time.events.loop(2000, createPipe, this)
    this.input.onDown.addOnce(startGame, this)
    this.pipeGroup = this.add.group()
    this.pipeGroup.enableBody = true
    // 把地面元素置顶
    this.world.swap(this.ground, this.pipeGroup)
    this.isStart = false
    this.speed = 200
    this.isOver = false
    this.isHit = false

    this.scordText = this.add.bitmapText(game.world.centerX - 20, 30, 'flappy_font', '0', 36);

    this.stopGame = function stopGame() {
        this.isOver = true
        this.background.stopScroll()
        this.ground.stopScroll()
        this.pipeGroup.setAll('body.velocity.x', 0)
        this.bird.animations.stop('birdFly', 0)
        this.time.events.stop(true)
        this.input.onDown.remove(fly, this)

        this.showGameOver()
    }
    this.showGameOver = function () {
        this.overGroup = this.add.group()
        var overText = this.add.sprite(this.world.centerX, 0, 'game_over', '', this.overGroup)
        overText.anchor.setTo(0.5, 0)
        var scoreBoard = this.add.sprite(this.world.centerX, 70, 'score_board', '', this.overGroup)
        scoreBoard.anchor.setTo(0.5, 0)
        var playBtn = this.add.button(this.world.centerX, 210, 'btn', startGame)
        playBtn.anchor.setTo(0.5, 0)
        this.overGroup.add(playBtn)
        var medal = this.add.sprite(100, 111, 'medal', 0, this.overGroup)

        var currentScoreText = game.add.bitmapText(game.width / 2 + 60, 105, 'flappy_font', this.currentScored + '', 20, this.overGroup); //当前分数
        var bestScoreText = game.add.bitmapText(game.width / 2 + 60, 153, 'flappy_font', this.bestScored + '', 20, this.overGroup); //最好分数

        this.overGroup.y = 30
    }
}

function startGame() {
    this.isStart = true
    this.readyText.destroy()
    this.playTip.destroy()
    this.background.autoScroll(-50, 0)

    this.bird.body.gravity.y = 1150
    // this.add.tween(this.bird).to({
    //     angle: 30
    // }, 100, null, true, 0, 0, false)

    this.input.onDown.add(fly, this)
}

function createPipe() {
    if (this.isOver) {
        return
    }
    // console.log('create')
    var gap = 100
    var groudHeight = this.ground.height
    var maxTop = 0
    var minTop = 50 - 320
    var maxBtm = height - 320
    var minBtm = height - min - groudHeight

    var min = height - (320 + gap + groudHeight)
    var max = 320
    var randomGapPos = rd(min, max)

    var topPos = randomGapPos - 320
    var btmPos = randomGapPos + gap
    this.add.sprite(width, topPos, 'pipe', 0, this.pipeGroup)
    this.add.sprite(width, btmPos, 'pipe', 1, this.pipeGroup)
    this.pipeGroup.setAll('body.velocity.x', -this.speed)


    this.pipeGroup.forEachExists(function (pipe) {
        if (pipe.x < -54) {
            this.pipeGroup.remove(pipe, true)
        }
    }, this)
}

function fly() {
    this.bird.body.velocity.y = -350
    this.add.tween(this.bird).to({
        angle: -30
    }, 100, null, true, 0, 0, false)
    this.soundFly.play()
}

function update() {
    if (!this.isStart) {
        return
    }
    this.physics.arcade.overlap(this.bird, this.pipeGroup, hitPipe, null, this)
    this.physics.arcade.collide(this.bird, this.ground, hitGround, null, this)
    if (this.bird.angle < 90) {
        this.bird.angle += 3
    }
    this.pipeGroup.forEachExists(function (pipe) {
        var left = Math.floor(pipe.x + pipe.width + this.bird.width / 2)
        if (!pipe.hasScored && pipe.y > 0 && left > 0 && this.bird.x >= Math.floor(pipe.x + pipe.width + this.bird.width / 2)) {
            pipe.hasScored = true
            this.currentScored += 1
            this.bestScored += 1

            this.scordText.text = this.currentScored
            console.log('success')
        }
    }, this)
}

function hitPipe() {
    this.hitPipe.play()
    this.stopGame()
}

function hitGround() {
    if (this.isHit) {
        return
    }
    console.log('--HIT--')
    this.isHit = true
    this.hitGround.play()
    this.stopGame()
}



function rd(n, m) {
    var c = m - n + 1;
    return Math.floor(Math.random() * c + n);
}