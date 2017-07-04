var game = new Phaser.Game(240, 400, Phaser.AUTO, 'game')

window.onorientationchange = function () {
    game.state.start('boot')
}


function getOri() {
    if (window.orientation == 180 || window.orientation == 0) {
        return 'v'
    }
    if (window.orientation == 90 || window.orientation == -90) {
        return 'h'
    }
}

// 初始化设置
var boot = {
    preload: function () {
        game.load.image('preload', './assets/preloader.gif')
        var ori = getOri()
        if (ori == 'v') {
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        } else if (ori == 'h') {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        }

        // if (!game.device.desktop) {
        //     // EXACT_FIT为满屏 SHOW_ALL为只适配宽度, 不拉伸
        //     // game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        //     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        // }
    },
    create: function () {
        game.state.start('load')
    }
}



// 加载资源
var load = {
    preload: function () {
        var preload = game.add.sprite(game.width / 2 - 220 / 2, game.height / 2 - 19 / 2, 'preload')
        game.load.setPreloadSprite(preload)
        game.load.image('background', 'assets/bg.jpg')
        game.load.image('copyright', 'assets/copyright.png')
        game.load.spritesheet('myplane', 'assets/myplane.png', 40, 40, 4)
        game.load.spritesheet('startbutton', 'assets/startbutton.png', 100, 40, 2)
        game.load.spritesheet('replaybutton', 'assets/replaybutton.png', 80, 30, 2)
        game.load.spritesheet('sharebutton', 'assets/sharebutton.png', 80, 30, 2)
        game.load.image('mybullet', 'assets/mybullet.png')
        game.load.image('bullet', 'assets/bullet.png')
        game.load.image('enemy1', 'assets/enemy1.png')
        game.load.image('enemy2', 'assets/enemy2.png')
        game.load.image('enemy3', 'assets/enemy3.png')
        game.load.spritesheet('explode1', 'assets/explode1.png', 20, 20, 3)
        game.load.spritesheet('explode2', 'assets/explode2.png', 30, 30, 3)
        game.load.spritesheet('explode3', 'assets/explode3.png', 50, 50, 3)
        game.load.spritesheet('myexplode', 'assets/myexplode.png', 40, 40, 3)
        game.load.image('award', 'assets/award.png')
        game.load.audio('normalback', 'assets/normalback.mp3')
        game.load.audio('playback', 'assets/playback.mp3')
        game.load.audio('fashe', 'assets/fashe.mp3')
        game.load.audio('crash1', 'assets/crash1.mp3')
        game.load.audio('crash2', 'assets/crash2.mp3')
        game.load.audio('crash3', 'assets/crash3.mp3')
        game.load.audio('ao', 'assets/ao.mp3')
        game.load.audio('pi', 'assets/pi.mp3')
        game.load.audio('deng', 'assets/deng.mp3')
        // 加载进度
        game.load.onFileComplete.add(function (process) {
            // console.log(process)
        })
    },
    create: function () {
        game.state.start('over')
    }
}

var start = {
    create: function () {
        // 版权
        game.add.sprite(0, 0, 'background')
        game.add.sprite(12, game.height - 16, 'copyright')
        // 飞机
        var myplane = game.add.sprite(game.width / 2, game.height / 2 - 100, 'myplane')
        myplane.anchor.set(0.5)
        myplane.animations.add('fly')
        myplane.animations.play('fly', 10, true)
        // 开始
        var playBtn = game.add.button(game.width / 2, game.height / 2, 'startbutton', this.play, this, 1, 1, 0)
        playBtn.anchor.set(0.5)
    },
    play: function () {
        console.log('play')
        game.state.start('play')
    }
}

// 游戏中
var play = {
    create: function () {
        // 开启物理系统
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var bg = game.add.tileSprite(0, 0, game.width, game.height, 'background')
        bg.autoScroll(0, 20)
        // 飞机
        this.myplane = game.add.sprite(game.width / 2, game.height / 2 - 100, 'myplane')
        this.myplane.anchor.set(0.5)
        this.myplane.animations.add('fly')
        this.myplane.animations.play('fly', 10, true)
        // 发射子弹的时间
        this.lastFire = 0
        // 最的敌机时间
        this.lastEnemy = 0
        // 敌机发射子弹的时间
        this.lastEnemyBullet = 0
        // 增加子弹组
        this.mybullets = game.add.group()
        this.mybullets.createMultiple(15, 'mybullet')
        this.mybullets.enableBody = true
        // 增加敌机子弹
        this.enemyBullets = game.add.group()
        this.enemyBullets.createMultiple(50, 'bullet')
        this.enemyBullets.enableBody = true
        // 设置自动销毁 1.超出屏幕 2.自动销毁
        this.mybullets.setAll('outOfBoundsKill', true)
        this.mybullets.setAll('checkWorldBounds', true)
        this.enemyBullets.setAll('outOfBoundsKill', true)
        this.enemyBullets.setAll('checkWorldBounds', true)
        // 增加敌机组
        this.enemys = game.add.group()
        this.enemys.createMultiple(15, 'enemy1')
        this.enemys.enableBody = true
        this.enemys.setAll('outOfBoundsKill', true)
        this.enemys.setAll('checkWorldBounds', true)
        // 增加爆炸组
        this.explodes = game.add.group()
        this.explodes.createMultiple(15, 'explode1')
        // this.explodes.enableBody = true
        // this.enemys.setAll('outOfBoundsKill', true)
        // this.enemys.setAll('checkWorldBounds', true)
        // 下落动画
        var tween = game.add.tween(this.myplane).to({
            y: game.height - 20
        }, 500, null, true)
        tween.onComplete.add(this.onStart, this)
    },
    // 正式开始
    onStart: function () {
        // 是否发射子弹
        this.isFire = true
        // 分数
        var style = {
            font: "16px Arial",
            fill: "#ff0044",
            align: "center"
        }
        var text = game.add.text(0, 0, "Score : 0", style)
        // 飞机可拖拽
        this.myplane.inputEnabled = true
        this.myplane.input.enableDrag()
        game.physics.enable(this.myplane, Phaser.Physics.ARCADE)
        // 和物理世界进行碰撞
        this.myplane.body.collideWorldBounds = true
    },
    update: function () {
        // 生产子弹
        this.createBullet()
        // 生产敌机
        this.createEnemys()
        // 生产敌机子弹
        this.createEnemyBullet()
    },
    // 生产敌机子弹
    createEnemyBullet: function () {
        var now = +(new Date())

        this.enemys.forEachAlive(function (enemy) {
            if (now - enemy.lastTime > 400) {
                var eBullet = this.enemyBullets.getFirstExists(false, true, enemy.x + enemy.width / 2, enemy.y + enemy.height, 'bullet')
                game.physics.arcade.enable(eBullet)
                eBullet.body.velocity.y = enemy.speed
                enemy.lastTime = now
            }
        }, this)

    },
    // 生产敌机
    createEnemys: function () {
        var now = +(new Date())
        if (this.isFire && now - this.lastEnemy > 2000) {
            var rndIndex = game.rnd.integerInRange(1, 3)
            var imageSize = game.cache.getImage('enemy' + rndIndex).width
            var x = game.rnd.integerInRange(0, game.width - imageSize)
            var y = game.rnd.integerInRange(0, imageSize)
            var subEnemy = this.enemys.getFirstExists(false, false, x, y, 'enemy' + rndIndex)
            game.physics.enable(subEnemy, Phaser.Physics.ARCADE)
            subEnemy.body.velocity.y = 50
            subEnemy.index = rndIndex
            if (rndIndex === 1) {
                subEnemy.speed = 180
                subEnemy.time = 400
            } else if (rndIndex === 2) {
                subEnemy.speed = 160
                subEnemy.time = 800
            } else if (rndIndex === 3) {
                subEnemy.speed = 240
                subEnemy.time = 1600
            }
            subEnemy.lastTime = 0
            // 重新设置大小
            subEnemy.body.setSize(imageSize, imageSize)
            this.lastEnemy = +(new Date())
        }
    },
    // 生产子弹
    createBullet: function () {
        var now = +(new Date())
        if (this.myplane && this.myplane.alive && this.isFire && now - this.lastFire > 400) {
            var bullet = this.mybullets.getFirstExists(false, false, this.myplane.x, this.myplane.y - this.myplane.height / 2)
            if (bullet) {
                bullet.anchor.set(0.5, 1)
                game.physics.arcade.enable(bullet)
                bullet.body.velocity.y = -200
            } else {
                console.log('bullet is emplty, ERROR!')
            }
            this.lastFire = +(new Date())
        }
        // 子弹和敌机碰撞
        game.physics.arcade.overlap(this.mybullets, this.enemys, this.enemyOnBullet, null, this)
        game.physics.arcade.overlap(this.myplane, this.enemyBullets, this.myPlantOnBullet, null, this)
    },
    // 子弹和敌机碰撞
    enemyOnBullet: function (bullet, enemy) {
        // kill是把状态改成alive destroy为内存中删除
        enemy.kill()
        var explode = this.explodes.getFirstExists(false, true, enemy.x, enemy.y, 'explode' + enemy.index)
        this.explodeFun(explode)
        bullet.kill()
    },
    // 我方飞机撞上子弹
    myPlantOnBullet: function (myPlane, bullet) {
        bullet.kill()
        var explode = this.explodes.getFirstExists(false, true, myPlane.x, myPlane.y, 'myexplode')
        explode.anchor.set(0.5)
        this.explodeFun(explode, function () {
            myPlane.kill()
            game.state.start('over')
        })
    },
    // 爆炸动画的执行
    explodeFun: function (explode, cb) {
        var explodeAni = explode.animations.add('explode')
        explodeAni.play(50, false, false)
        explodeAni.onComplete.addOnce(function () {
            explode.kill()
            cb && cb()
        })
    },
    // debug
    render: function () {
        // this.enemys.forEachAlive(function (item) {
        //     game.debug.body(item)
        // })
    }
}
// 游戏结束
var over = {
    create: function () {
        // 版权
        game.add.sprite(0, 0, 'background')
        game.add.sprite(12, game.height - 16, 'copyright')
        // 飞机
        var myplane = game.add.sprite(game.width / 2, game.height / 2 - 100, 'myplane')
        myplane.anchor.set(0.5)
        myplane.animations.add('fly')
        myplane.animations.play('fly', 10, true)
        // 开始
        game.add.button(30, 300, 'replaybutton', this.replay, this, 0, 0, 1)
        game.add.button(140, 300, 'sharebutton', this.share, this, 0, 0, 1)

        var bar = game.add.graphics()
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 150, game.width, 70);
        bar.endFill();


        var style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        text = game.add.text(0, 0, "Scord:0", style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        // x:0 y:100 width:800 height:100
        text.setTextBounds(0, 150, game.width, 70);
    },
    replay: function () {
        game.state.start('play')
    },
    share: function () {

    }
}

game.state.add('boot', boot)
game.state.add('load', load)
game.state.add('start', start)
game.state.add('play', play)
game.state.add('over', over)
game.state.start('boot')