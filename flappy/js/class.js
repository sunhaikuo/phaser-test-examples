class Flappy {
    // constructor() {
    //     var width = document.documentElement.clientWidth
    //     var height = document.documentElement.clientHeight
    //     var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    //         preload: this.preload,
    //         create: this.create,
    //         play: this.play,
    //         update: this.update
    //     })
    //     this.width = width
    //     this.height = height
    // }
    init() {
        var width = document.documentElement.clientWidth
        var height = document.documentElement.clientHeight
        var game = new Phaser.Game(300, 300)
        console.log(game, this)
    }

    // preload() {
    //     console.log('preload')
    //     this.load.image('background', './assets/background.png')
    //     this.load.spritesheet('bird', './assets/bird.png', 34, 24, 3)
    //     this.load.image('ground', 'assets/ground.png'); //地面
    //     this.load.image('title', 'assets/title.png'); //游戏标题
    //     this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3); //鸟
    //     this.load.image('btn', 'assets/start-button.png'); //按钮
    //     this.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2); //管道
    //     this.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt'); //显示分数的字体
    //     this.load.audio('fly_sound', 'assets/flap.wav'); //飞翔的音效
    //     this.load.audio('score_sound', 'assets/score.wav'); //得分的音效
    //     this.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
    //     this.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效
    //     this.load.image('ready_text', 'assets/get-ready.png'); //get ready图片
    //     this.load.image('play_tip', 'assets/instructions.png'); //玩法提示图片
    //     this.load.image('game_over', 'assets/gameover.png'); //gameover图片
    //     this.load.image('score_board', 'assets/scoreboard.png'); //得分板
    //     this.load.spritesheet('medal', 'assets/medals.png', 44, 46, 2) // 金银牌
    // }
    // create() {
    //     console.log('create')
    // }
    // play() {
    //     console.log('play')
    // }


    // test() {
    //     console.log('text')
    // }
    // update() {
    //     // console.log('update')
    //     test()
    // }
}

var flappy = new Flappy()
flappy.init()