var width = document.documentElement.clientWidth
var height = document.documentElement.clientHeight
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
});

window.onorientationchange = function () {
    window.location.reload()
}


function preload() {

    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;

    // 加载背景和动物
    this.load.image('background', './assets/images/background.png')
    this.load.image('arrow', './assets/images/arrow.png')
    this.load.spritesheet('chicken', './assets/images/chicken_spritesheet.png', 131, 200, 3)
    this.load.spritesheet('horse', './assets/images/horse_spritesheet.png', 212, 200, 3)
    this.load.spritesheet('pig', './assets/images/pig_spritesheet.png', 297, 200, 3)
    this.load.spritesheet('sheep', './assets/images/sheep_spritesheet.png', 244, 200, 3)

    this.load.audio('chickenSound', './assets/audio/chicken.mp3')
    this.load.audio('horseSound', './assets/audio/horse.mp3')
    this.load.audio('pigSound', './assets/audio/pig.mp3')
    this.load.audio('sheepSound', './assets/audio/sheep.mp3')
}

var animalGroup = null
var currentAnimal = null
var animalText = null

function create() {
    this.background = game.add.sprite(0, 0, 'background')
    var animals = [{
        key: 'chicken',
        text: 'CHICKEN',
        audio: 'chickenSound'
    }, {
        key: 'horse',
        text: 'HORSE',
        audio: 'horseSound'
    }, {
        key: 'pig',
        text: 'PIG',
        audio: 'pigSound'
    }, {
        key: 'sheep',
        text: 'SHEEP',
        audio: 'sheepSound'
    }]
    var _this = this
    animalGroup = this.add.group()

    animals.forEach(function (ele) {
        var animal = animalGroup.create(_this.world.width * 1.5, _this.world.centerY, ele.key, 0)
        animal.customParams = {
            text: ele.text,
            sound: game.add.audio(ele.audio)
        }
        animal.anchor.setTo(0.5)
        animal.animations.add('animate', [0, 1, 2, 0, 1], 3, false)
        animal.inputEnabled = true
        animal.input.pixelPerfectClick = true
        animal.events.onInputDown.add(playSound, animal)
    })

    // this.currentAnimal = this.animalGroup.previous()
    currentAnimal = animalGroup.previous()
    currentAnimal.position.set(this.world.centerX, this.world.centerY)
    addText(currentAnimal)
    // var chicken = game.chicken
    // chicken = game.add.sprite(game.world.centerX, game.world.centerY, 'chicken')
    // chicken.anchor.setTo(0.5)
    // chicken.inputEnabled = true
    // chicken.input.pixelPerfectClick = true
    // chicken.events.onInputDown.add(playSound, chicken)

    var leftA = game.leftArrow
    var rightA = game.rightArrow
    leftA = game.add.sprite(0, game.world.centerY, 'arrow')
    leftA.anchor.setTo(1, 0.5)
    leftA.scale.x = -1
    leftA.customParams = {
        direction: -1
    }
    leftA.inputEnabled = true
    leftA.input.pixelPerfectClick = true
    leftA.events.onInputDown.add(changeAnimal, leftA)
    rightA = game.add.sprite(game.world.width, game.world.centerY, 'arrow')
    rightA.anchor.setTo(1, 0.5)
    rightA.customParams = {
        direction: 1
    }
    rightA.inputEnabled = true
    rightA.input.pixelPerfectClick = true
    rightA.events.onInputDown.add(changeAnimal, rightA)
}

function playSound(sprite) {
    sprite.play('animate')
    sprite.customParams.sound.play()
}

function addText(sprite) {
    var text = sprite.customParams.text
    if (!animalText) {
        var style = {
            font: 'bold 30pt Arial',
            fill: '#D0171B',
            align: 'center'
        }
        animalText = game.add.text(game.world.centerX, game.world.centerY * 1.8, '', style)
        animalText.anchor.setTo(0.5)
    }
    animalText.setText(text)
}

function changeAnimal(sprite, event) {
    var end = 0
    var newAnimal = null
    animalText.visible = false
    if (sprite.customParams.direction > 0) {
        newAnimal = animalGroup.next()
        newAnimal.x = -newAnimal.width / 2
        end = game.world.width + currentAnimal.width / 2
    } else {
        newAnimal = animalGroup.previous()
        newAnimal.x = game.world.width + newAnimal.width / 2
        end = -currentAnimal.width / 2
    }

    var newAnimalMov = game.add.tween(newAnimal)
    newAnimalMov.start(-1000)
    newAnimalMov.to({
        x: game.world.centerX
    }, 1000)
    newAnimalMov.onComplete.add(function () {
        this.isMoving = false
        animalText.visible = true
    })
    newAnimalMov.start()

    var currentAnimalMov = game.add.tween(currentAnimal)
    currentAnimalMov.to({
        x: end
    })
    currentAnimalMov.onComplete.add(function () {
        this.isMoving = false
        playSound(newAnimal)
    })
    currentAnimalMov.start()
    currentAnimal = newAnimal

    addText(currentAnimal)
}

function update() {

}