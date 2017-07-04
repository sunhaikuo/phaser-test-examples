var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
})



function preload() {

    console.log(game.device)

    game.load.image('lazur', '../assets/pics/thorn_lazur.png')
    game.load.spritesheet('mummy', '../assets/sprites/metalslug_mummy37x45.png', 37, 45, 18)
    game.load.onFileComplete.add(function (msg) {
        console.log(msg)
    })
}

var back
var mummy
var ani

function create() {
    back = game.add.image(0, -400, 'lazur')
    back.scale.set(2)
    back.smoothed = true

    mummy = game.add.sprite(200, 360, 'mummy')
    mummy.scale.set(3)
    mummy.smoothed = true
    ani = mummy.animations.add('walk11')
    ani.play(10, true)
}

function update() {

}