var game = new Phaser.Game(document.documentElement.clientWidth, document.documentElement.clientHeight, Phaser.AUTO, 'game')
var boot = {
    // 初始一些配置
    create: function () {
        if (window.orientation == 180 || window.orientation == 0) {
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        } else if (window.orientation == 90 || window.orientation == -90) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        }
        // 屏幕旋转
        window.onorientationchange = function () {
            game.state.start('boot')
        }
        // 启动物理系统
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('lottery')
    }
}
var load = {
    preload: function () {
        // 加载资源
        game.load.image('mushroom', './assets/mushroom2.png')
        game.load.image('beast', './assets/shadow_of_the_beast2_karamoon.png')
        // 加载进度
        game.load.onFileComplete.add(function (process) {
            console.log(process)
        })
    },
    create: function () {
        game.state.start('start')
    }
}
var start = {
    create: function () {
        game.state.start('play')
    }
}
var play = {
    create: function () {
        this.mushroomArr = game.add.physicsGroup(Phaser.Physics.ARCADE)
        this.mushroomArr.createMultiple(10, 'mushroom')
        this.mushroomArr.enableBody = true
        // 设置自动销毁 1.超出屏幕 2.
        this.mushroomArr.setAll('body.collideWorldBounds', false)
        this.mushroomArr.setAll('body.bounce.x', 1)
        this.mushroomArr.setAll('body.bounce.y', 1)
        this.mushroomArr.setAll('outOfBoundsKill', true)
        this.mushroomArr.setAll('checkWorldBounds', true)
        this.startTm = 0
    },
    update: function () {
        var now = +(new Date())
        if (this.startTm == 0 || (now - this.startTm) > 400) {
            var mushroom = this.mushroomArr.getFirstExists(false)
            if (!mushroom) {
                return
            }
            // var spriteSize = mushroom.width
            var spriteSize = 0
            var maxY = game.height - spriteSize
            var maxX = game.width - spriteSize
            var edge = [{
                x: -spriteSize,
                y: game.rnd.integerInRange(0, maxY)
            }, {
                x: game.width + spriteSize,
                y: game.rnd.integerInRange(0, maxY)
            }, {
                x: game.rnd.integerInRange(0, maxX),
                y: -spriteSize
            }, {
                x: game.rnd.integerInRange(0, maxX),
                y: game.height + spriteSize
            }]
            var rnIndex = game.rnd.integerInRange(0, edge.length - 1)
            var x = edge[rnIndex].x
            var y = edge[rnIndex].y
            var speedX = game.rnd.integerInRange(50, 200)
            var speedY = game.rnd.integerInRange(50, 200)
            var middleX = x > game.width / 2 ? true : false
            var middleY = y > game.height / 2 ? true : false
            if (rnIndex == 0) {
                speedX = speedX * 1
                if (middleY) {
                    speedY = speedY * -1
                } else {
                    speedY = speedY * 1
                }
            } else if (rnIndex == 1) {
                speedX = speedX * -1
                if (middleY) {
                    speedY = speedY * -1
                } else {
                    speedY = speedY * 1
                }
            } else if (rnIndex == 2) {
                speedY = speedY * 1
                if (middleX) {
                    speedX = speedX * -1
                } else {
                    speedX = speedX * 1
                }
            } else if (rnIndex == 3) {
                speedY = speedY * -1
                if (middleX) {
                    speedX = speedX * -1
                } else {
                    speedX = speedX * 1
                }
            }
            this.livingCnt = this.mushroomArr.countLiving()
            // console.log(this.mushroomArr.countLiving())
            mushroom.reset(x, y)
            // mushroom.scale.setTo(0.3)
            game.physics.arcade.enable(mushroom)
            mushroom.body.velocity.x = speedX
            mushroom.body.velocity.y = speedY
            this.startTm = +(new Date())
        }
        game.physics.arcade.collide(this.mushroomArr)
    },
    render: function () {
        game.debug.text("Living Count:" + this.livingCnt, 100, 100, 0x000000);
    }
}
var over = {}
// 九宫格抽奖
var lottery = {
    preload: function () {
        game.load.image('mushroom', './assets/mushroom2.png')
        game.load.image('background', './assets/starfield.jpg')
        // game.load.spritesheet('button', './assets/button-round.png', 192, 96)
        game.load.spritesheet('button', './assets/follow-style-button.png', 224, 70)
        // game.load.image('button', './assets/button_texture_atlas.png', 193, 71)
    },
    create: function () {
        game.add.tileSprite(0, 0, game.width, game.height, 'background')
        var btn = game.add.button(game.width * 0.6, game.height / 2, 'button', this.down, this, 0, 1, 0)
        var style = {
            font: '30px',
            fill: '#fff'
        }
        var btnTxt = game.add.text(game.width * 0.7, game.height / 2 + 20, '点击开始', style)
        this.mushroom = game.add.sprite(0, 0, 'mushroom')
        var graphics = game.add.graphics(0, 0)
        this.posiArr = []
        for (var i = 1; i <= 8; i++) {
            var color = Phaser.Color.getRandomColor(50, 255, 255)
            graphics.beginFill(color, 1)
            var size = 100
            var x = 0
            var y = 0
            if (i == 4 || i == 8) {
                y = size
                if (i == 4) {
                    x = size * 2
                } else {
                    x = 0
                }
            } else if (i <= 3) {
                y = 0
                x = (i - 1) * size
            } else {
                y = size * 2
                x = Math.abs(i - 7) * size
            }
            var posi = {
                x: x,
                y: y
            }
            this.posiArr.push(posi)
            game.add.text(x, y, i)
            graphics.drawRect(x, y, size, size)
        }
        game.world.bringToTop(this.mushroom)
        this.time = 0
        this.index = 0
        this.initInter = 100
        this.minInter = 40
        this.maxInter = 100
        this.durning = 100
        this.endTime = 0
        this.direction = 'up'
        this.result = 0
        this.start = false
    },
    update: function () {
        var now = +(new Date())
        if (this.start && this.posiArr && this.posiArr.length == 8 && now - this.time > this.initInter) {
            this.result = Math.floor(this.result)
            if (this.result < 0 || this.result > 7) {
                this.start = false
                return
            }
            if (this.direction == 'up') {
                console.log(1)
                this.initInter -= 5
            }
            if (this.direction == 'up' && this.initInter <= this.minInter) {
                console.log(2)
                this.direction = 'ease'
                if (this.endTime == 0) {
                    this.endTime = +(new Date()) + this.durning
                }
            }
            if ((this.direction == 'ease' || this.direction == 'down') && (this.endTime - now <= 0)) {
                console.log(3)
                this.direction = 'down'
                this.initInter += 5
            }
            if ((this.initInter >= this.maxInter) && this.direction == 'down') {
                console.log(4)
                this.direction = 'lottery'
            }
            if (this.direction == 'lottery' && this.index == this.result) {
                console.log(5)
                this.direction = 'stop'
                this.start = false
            }

            var posi = this.posiArr[this.index]
            this.mushroom.reset(posi.x, posi.y)
            this.index++;
            if (this.index > 7) {
                this.index = 0
            }
            this.time = +(new Date())
        }
    },
    down: function () {
        this.start = true
        // alert('down')
    }
}
game.state.add('boot', boot)
game.state.add('load', load)
game.state.add('start', start)
game.state.add('play', play)
game.state.add('over', over)
game.state.add('lottery', lottery)
game.state.start('boot')