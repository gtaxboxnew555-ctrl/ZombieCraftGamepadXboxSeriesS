import * as THREE from 'https://unpkg.com/three@0.166.1/build/three.module.js';
let yaw = 0;
let pitch = -0.2;const scene = new THREE.Scene();
let flashlightOn = false;
let health = 100;
let kills = 0;
const bullets = [];
let wood = 0;
let stone = 0;
let inventoryOpen = false;
let craftingOpen = false;
let hasAxe = false;
let hasPickaxe = false;
let buildMode = false;
let selectedBlock = "wood";
const walls = [];
let buildHeight = 2;
let flyMode = false;

const raycaster = new THREE.Raycaster();
let velocityY = 0;
let onGround = true;
const placedBlocks = [];
const groundBlocks = [];
const doors = [];
const lastPreviewPosition = new THREE.Vector3();
const buildRange = 8;



const buildReach = 8;

const maxWallHeight = 4;

const playerRadius = 0.4;
const playerHeight = 2;

let gamepad = null;
let lastLT = false;
let lastRT = false;
let lastLB = false;
let lastRB = false;

function deadzone(value, amount = 0.3) {

    return Math.abs(value) < amount
        ? 0
        : value;

}
if (gamepad) {

    console.log(gamepad.axes[0]);

}






scene.background = new THREE.Color(0x87CEEB);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.4
);

scene.add(ambientLight);

const flashlight = new THREE.SpotLight(
    0xffffff,
    200
);

flashlight.distance = 300;
flashlight.angle = Math.PI / 4;

flashlight.visible = false;

scene.add(flashlight);
scene.add(flashlight.target);



const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5),
    new THREE.MeshBasicMaterial({
        color: 0xffff00
    })
);

scene.add(sun);



/*
const  = new THREE.Mesh(
    new THfor (let x = -50; x <= 50; x++) {
*    for (let z = -50; z <= 50; z++* {

        const grassBlock = new*THREE.Mesh(
            new*THREE.BoxGeometry(1, 1, 1),
      *     new THREE.MeshBasicMaterial({*                color: 0x228B22
  *         })
        );

        gr*ssBlock.position.set(
            *,
            -0.5,
            z
*       );

        scene.add*gr*ssBlock);

    }

}REE.PlaneGeometry(200, 200),
    ...
);

scene.add();
*/


const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);

cube.position.set(0, 1.5, -20);
scene.add(cube);

function createZombie() {

    const zombie = new THREE.Group();

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.MeshStandardMaterial({
            color: 0x55aa55
        })
    );

    head.position.y = 4.75;

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 1),
        new THREE.MeshStandardMaterial({
            color: 0x3366cc
        })
    );

    body.position.y = 2.5;

    const leftArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 3, 0.75),
        new THREE.MeshStandardMaterial({
            color: 0x55aa55
        })
    );

    leftArm.position.set(-1.4, 2.5, 0);

    const rightArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 3, 0.75),
        new THREE.MeshStandardMaterial({
            color: 0x55aa55
        })
    );

    rightArm.position.set(1.4, 2.5, 0);

    const leftLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 3, 0.8),
        new THREE.MeshStandardMaterial({
            color: 0x4444aa
        })
    );

    leftLeg.position.set(-0.5, 0.5, 0);

    const rightLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 3, 0.8),
        new THREE.MeshStandardMaterial({
            color: 0x4444aa
        })
    );

    rightLeg.position.set(0.5, 0.5, 0);

    zombie.add(head);
    zombie.add(body);
    zombie.add(leftArm);
    zombie.add(rightArm);
    zombie.add(leftLeg);
    zombie.add(rightLeg);

    zombie.userData.leftArm = leftArm;
    zombie.userData.rightArm = rightArm;
    zombie.userData.leftLeg = leftLeg;
    zombie.userData.rightLeg = rightLeg;

    return zombie;
}

const zombie = createZombie();

const zombies = [zombie];

zombie.position.set(20, 0, -20);

scene.add(zombie);

for (let x = -40; x <= 40; x++) {

    for (let z = -40; z <= 40; z++) {

        const grassBlock = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                color: 0x228B22
            })
        );

        grassBlock.position.set(
            x,
            0.5,
            z
        );

        grassBlock.userData.blockType = "grass";

        scene.add(grassBlock);

        groundBlocks.push(grassBlock);

    }

}




for (let i = 0; i < 4; i++) {

    const newZombie = createZombie();

    newZombie.position.set(
        Math.random() * 100 - 50,
        0,
        Math.random() * 100 - 50
    );

    scene.add(newZombie);

    zombies.push(newZombie);

}

const treeTrunks = [];

for (let i = 0; i < 100; i++) {

    const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
);
    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshStandardMaterial({ color: 0x228B22 })
    );

    const x = Math.random() * 180 - 90;
    const z = Math.random() * 180 - 90;

    trunk.position.set(x, 2, z);
    leaves.position.set(x, 5, z);

scene.add(trunk);
scene.add(leaves);

treeTrunks.push(trunk);

}   // <-- end of tree loop

const rocks = [];

for (let i = 0; i < 50; i++) {

    const rock = new THREE.Mesh(
        new THREE.SphereGeometry(1.5),
        new THREE.MeshStandardMaterial({
            color: 0x888888
        })
    );

    rock.position.set(
        Math.random() * 180 - 90,
        1.5,
        Math.random() * 180 - 90
    );

    scene.add(rock);

    rocks.push(rock);

}   // <-- end of rock loop

const buildings = [];

for (let i = 0; i < 20; i++) {

    const bx = Math.random() * 180 - 90;
    const bz = Math.random() * 180 - 90;

    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa
    });

    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x884444
    });

    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 4, 8),
        wallMaterial
    );

    leftWall.position.set(bx - 4, 2, bz);

    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 4, 8),
        wallMaterial
    );

    rightWall.position.set(bx + 4, 2, bz);

    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4, 1),
        wallMaterial
    );

    backWall.position.set(bx, 2, bz - 4);

    const frontLeft = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 1),
        wallMaterial
    );

    frontLeft.position.set(bx - 2.5, 2, bz + 4);

    const frontRight = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 1),
        wallMaterial
    );

    frontRight.position.set(bx + 2.5, 2, bz + 4);

    const roof = new THREE.Mesh(
    new THREE.BoxGeometry(9, 1, 9),
    roofMaterial
);


roof.position.set(bx, 4.5, bz);
const door = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 0.2),
    new THREE.MeshStandardMaterial({
        color: 0x654321
    })
);

door.position.set(
    bx - 0.5,
    1.5,
    bz + 4
);


door.userData.closedX = bx;
door.userData.closedZ = bz + 4;
door.userData.open = false;

scene.add(leftWall);
scene.add(rightWall);
scene.add(backWall);
scene.add(frontLeft);
scene.add(frontRight);
scene.add(roof);
scene.add(door);

doors.push(door);

const housePieces = [
    leftWall,
    rightWall,
    backWall,
    frontLeft,
    frontRight,
    roof
];

for (const piece of housePieces) {

    const helper = new THREE.BoxHelper(
        piece,
        0xffff00
    );

    scene.add(helper);/*
for (const piece of housePieces) {

    const helper = new THREE.BoxHelper(
        piece,
        0xffff00
    );

    scene.add(helper);

}
*/

}

    buildings.push(
        leftWall,
        rightWall,
        backWall,
        frontLeft,
        frontRight,
        roof
    );
}


camera.position.y = 2;

const keys = {};

window.addEventListener("gamepadconnected", (e) => {

    gamepad = e.gamepad;

    console.log(
        "Controller connected:",
        gamepad.id
    );

});



document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});



document.addEventListener("keydown", (e) => {

    if (e.repeat) return;

    if (e.key.toLowerCase() === "f") {

        flashlightOn = !flashlightOn;

        flashlight.visible = flashlightOn;
    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() !== "e") return;

    let closestDoor = null;
    let closestDistance = Infinity;

    for (const door of doors) {

        const distance = camera.position.distanceTo(
            door.position
        );

        if (distance < closestDistance) {

            closestDistance = distance;
            closestDoor = door;

        }

    }

    if (!closestDoor || closestDistance > 3)
        return;

    if (closestDoor.userData.open) {

        closestDoor.visible = true;
        closestDoor.userData.open = false;

    } else {

        closestDoor.visible = false;
        closestDoor.userData.open = true;

    }

});







document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "e") {

        for (let trunk of treeTrunks) {

            const distance = Math.sqrt(
                (camera.position.x - trunk.position.x) ** 2 +
                (camera.position.z - trunk.position.z) ** 2
            );

            if (distance < 5 && trunk.visible) {

                trunk.visible = false;

                if (hasAxe) {
    wood += 3;
} else {
    wood++;
}

                document.getElementById("wood").textContent =
    "Wood: " + wood;

document.getElementById("slot1").textContent =
    "1 Wood (" + wood + ")";



                return;
            }
        }

        for (let rock of rocks) {

            const distance = Math.sqrt(
                (camera.position.x - rock.position.x) ** 2 +
                (camera.position.z - rock.position.z) ** 2
            );

            if (distance < 5 && rock.visible) {

                rock.visible = false;

                if (hasPickaxe) {
    stone += 3;
} else {
    stone++;
}

                document.getElementById("stone").textContent =
                    "Stone: " + stone;

                return;
            }
        }
    }

});

document.addEventListener("mousemove", (e) => {

    if (document.pointerLockElement === document.body) {

        yaw -= e.movementX * 0.0005;
        pitch -= e.movementY * 0.0005;

        pitch = Math.max(
    -1.5,
    Math.min(1.5, pitch)
);
    }

});









        console.log("WALL BUILT");
    



if (document.getElementById("slot1")) {

    document.getElementById("slot1").textContent =
        "1 Wood (" + wood + ")";

}   





   

;

for (let bullet of bullets) {

    bullet.position.x += bullet.userData.vx;
    bullet.position.z += bullet.userData.vz;

}

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "i") {

        inventoryOpen = !inventoryOpen;

        document.getElementById("inventory").innerHTML =
            inventoryOpen
            ? "Inventory<br>Wood: " + wood + "<br>Stone: " + stone
            : "Inventory";
    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "c") {

        craftingOpen = !craftingOpen;

        document.getElementById("crafting").innerHTML =
            craftingOpen
? "Crafting<br>1 = Axe (10 Wood)<br>2 = Pickaxe (10 Wood + 5 Stone)"            : "Crafting";
    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "1") {

        if (wood >= 10 && !hasAxe) {

            wood -= 0;

            hasAxe = true;

            document.getElementById("wood").textContent =
                "Wood: " + wood;

            ("Axe crafted!");
        }

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "2") {

        if (wood >= 10 && stone >= 5 && !hasPickaxe) {

            wood -= 10;
            stone -= 5;

            hasPickaxe = true;

            document.getElementById("wood").textContent =
document.getElementById("slot1").textContent =
    "1 Wood (" + wood + ")";
            document.getElementById("stone").textContent =
                "Stone: " + stone;

            ("Pickaxe crafted!");
        }

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "b") {

        buildMode = !buildMode;

        (
            buildMode
            ? "Build Mode ON"
            : "Build Mode OFF"
        );
    }

});

document.addEventListener("click", () => {

    document.body.requestPointerLock();

if (
    buildMode &&
    (
        (selectedBlock === "wood" && wood >= 1) ||
        (selectedBlock === "stone" && stone >= 1)
    )
) {


    const wall = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
        color:
            selectedBlock === "wood"
                ? 0x8B4513
                : 0x888888
    })
);

wall.userData.blockType = selectedBlock;



raycaster.setFromCamera(
    new THREE.Vector2(0, 0),
    camera
);

const intersects =
    raycaster.intersectObjects(placedBlocks);
  

if (intersects.length > 0) {

    const hit = intersects[0];

    if (keys["shift"]) {

        wall.position.copy(
            hit.object.position
        );

        wall.position.add(
            hit.face.normal
        );

    } else {

        wall.position.set(
            hit.object.position.x,
            hit.object.position.y + 1,
            hit.object.position.z
        );

    }

} else {

    wall.position.copy(
        previewBlock.position
    );

}

wall.position.copy(
    previewBlock.position
);

const playerInsideBlock =
    Math.abs(camera.position.x - wall.position.x) < 0.6 &&
    Math.abs(camera.position.z - wall.position.z) < 0.6 &&
    camera.position.y > wall.position.y - 0.5 &&
    camera.position.y < wall.position.y + 2;

if (playerInsideBlock) {
    return;
}

scene.add(wall);

placedBlocks.push(wall);



    if (selectedBlock === "wood") {

    wood -= 1;

    document.getElementById("wood").textContent =
        "Wood: " + wood;

} else {

    stone -= 1;

    document.getElementById("stone").textContent =
        "Stone: " + stone;

}

    document.getElementById("stone").textContent =
        "stone: " + stone;

    console.log("WALL BUILT");

    return;
}

    const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(1),
        new THREE.MeshBasicMaterial({
            color: 0xff00ff
        })
    );

    bullet.position.copy(camera.position);

    bullet.userData = {
        vx: -Math.sin(yaw) * 0.5,
        vz: -Math.cos(yaw) * 0.5
    };

    scene.add(bullet);

    bullets.push(bullet);

});

const previewBlock = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5
    })
);

scene.add(previewBlock);

const targetBlock = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 1.05, 1.05),
    new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
    })
);

targetBlock.visible = false;

scene.add(targetBlock);

const lookBlock = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 1.08, 1.08),
    new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true
    })
);

lookBlock.visible = false;

scene.add(lookBlock);





document.addEventListener("keydown", (e) => {

    if (e.key === "=") {
        buildHeight += 1;
    }

    if (e.key === "-") {
        buildHeight = Math.max(1.5, buildHeight - 1);
    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "g") {

        flyMode = !flyMode;

        (
            flyMode
            ? "Fly Mode ON"
            : "Fly Mode OFF"
        );
    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "r") {

        raycaster.setFromCamera(
            new THREE.Vector2(0, 0),
            camera
        );

        const intersects =
            raycaster.intersectObjects(
    [...placedBlocks, ...groundBlocks]
);

        if (intersects.length > 0) {

            const block =
                intersects[0].object;

console.log(block.userData.blockType);

            scene.remove(block);
        




            const index =
                placedBlocks.indexOf(block);

            if (index > -1) {
                placedBlocks.splice(index, 1);
            }

            if (block.userData.blockType === "stone") {

    stone++;

    document.getElementById("stone").textContent =
        "Stone: " + stone;

    document.getElementById("slot2").textContent =
        "2 Stone (" + stone + ")";

} else {

    wood++;

    document.getElementById("wood").textContent =
        "Wood: " + wood;

    document.getElementById("slot1").textContent =
        "1 Wood (" + wood + ")";

}

        }

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "2") {

        selectedBlock = "stone";

        document.getElementById("selectedBlock").textContent =
            "Block: Stone";

        document.getElementById("slot2").classList.add("selected");
        document.getElementById("slot1").classList.remove("selected");

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "1") {

        selectedBlock = "wood";

       document.getElementById("wood").textContent =
    "Wood: " + wood;

document.getElementById("slot1").textContent =
    "1 Wood (" + wood + ")";

        document.getElementById("slot1").classList.add("selected");
        document.getElementById("slot2").classList.remove("selected");

    }

});



document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "v") {

        selectedBlock = "stone";

        document.getElementById("selectedBlock").textContent =
            "Block: Stone";

    }

});




function animate() {

    requestAnimationFrame(animate);

    const pads = navigator.getGamepads();

gamepad = pads[0] || null;

let speed = 0.1;
    if (keys["shift"]) speed = 0.15;

    const oldX = camera.position.x;
const oldZ = camera.position.z;

    if (keys["w"]) {
        camera.position.x -= Math.sin(yaw) * speed;
        camera.position.z -= Math.cos(yaw) * speed;
    }

    if (keys["s"]) {
        camera.position.x += Math.sin(yaw) * speed;
        camera.position.z += Math.cos(yaw) * speed;
    }

    if (keys["a"]) {
        camera.position.x -= Math.cos(yaw) * speed;
        camera.position.z += Math.sin(yaw) * speed;
    }

    if (keys["d"]) {
        camera.position.x += Math.cos(yaw) * speed;
        camera.position.z -= Math.sin(yaw) * speed;
    }
/*if (gamepad) {

    let leftX = gamepad.axes[0];
let leftY = gamepad.axes[1];

if (Math.abs(leftX) < 0.35) leftX = 0;
if (Math.abs(leftY) < 0.35) leftY = 0;

    camera.position.x +=
        Math.cos(yaw) * leftX * 0.1;

    camera.position.z -=
        Math.sin(yaw) * leftX * 0.1;

    camera.position.x -=
        Math.sin(yaw) * leftY * 0.1;

    camera.position.z -=
        Math.cos(yaw) * leftY * 0.1;

}if (gamepad) {

    let rightX = gamepad.axes[2];
let rightY = gamepad.axes[3];

if (Math.abs(rightX) < 0.35) rightX = 0;
if (Math.abs(rightY) < 0.35) rightY = 0;

yaw -= rightX * 0.05;
pitch -= rightY * 0.05;

    pitch = Math.max(
        -1.5,
        Math.min(1.5, pitch)
    );

}*/
   if (gamepad) {

    console.log(gamepad.axes[0]);

}


    

   if (flyMode) {

    if (keys[" "]) {
        camera.position.y += 0.5;
    }

    if (keys["control"]) {
        camera.position.y -= 0.5;
    }

}

if (
    gamepad &&
    gamepad.buttons[0].pressed &&
    onGround &&
    !flyMode
) {

    velocityY = 0.25;
    onGround = false;

}




    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    const time = Date.now() * 0.00005;

    light.position.x = Math.sin(time) * 100;
    light.position.y = Math.cos(time) * 100;

    sun.position.copy(light.position);

    light.intensity = Math.max(0.1, light.position.y / 50);

    flashlight.position.copy(camera.position);

    flashlight.target.position.set(
        camera.position.x - Math.sin(yaw) * 10,
        camera.position.y,
        camera.position.z - Math.cos(yaw) * 10
    );

    const dx = camera.position.x - zombie.position.x;
    const dz = camera.position.z - zombie.position.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

   for (let zombie of zombies) {

    const dx = camera.position.x - zombie.position.x;
    const dz = camera.position.z - zombie.position.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

    const oldZombieX = zombie.position.x;
    const oldZombieZ = zombie.position.z;

    const walkTime = Date.now() * 0.01;

zombie.userData.leftLeg.rotation.x =
    Math.sin(walkTime) * 0.5;

zombie.userData.rightLeg.rotation.x =
    -Math.sin(walkTime) * 0.5;

zombie.userData.leftArm.rotation.x =
    -Math.sin(walkTime) * 0.5;

zombie.userData.rightArm.rotation.x =
    Math.sin(walkTime) * 0.5;

    

    if (distance > 1 && zombie.visible) {

        zombie.position.x += dx * 0.001;
        zombie.position.z += dz * 0.001;

        let hitWall = false;

        for (const block of placedBlocks) {

            if (
                Math.abs(zombie.position.x - block.position.x) < 0.8 &&
                Math.abs(zombie.position.z - block.position.z) < 0.8
            ) {
                hitWall = true;
                break;
            }

        }

        

        if (hitWall) {

            zombie.position.x = oldZombieX;
            zombie.position.z = oldZombieZ;

        }

    }

    zombie.lookAt(
        camera.position.x,
        zombie.position.y,
        camera.position.z
    );

}


    

    for (let bullet of bullets) {

        bullet.position.x += bullet.userData.vx;
        bullet.position.z += bullet.userData.vz;

        const hitDistance = Math.sqrt(
            (bullet.position.x - zombie.position.x) ** 2 +
            (bullet.position.z - zombie.position.z) ** 2
        );

        for (let zombie of zombies) {

    const hitDistance = Math.sqrt(
        (bullet.position.x - zombie.position.x) ** 2 +
        (bullet.position.z - zombie.position.z) ** 2
    );

    if (hitDistance < 5 && zombie.visible) {

        zombie.visible = false;

        kills++;

        document.getElementById("kills").textContent =
            "Kills: " + kills;

    }

}

    }











const gridSize = 1;

raycaster.setFromCamera(
    new THREE.Vector2(0, 0),
    camera
);

const intersects =
    raycaster.intersectObjects(
        [...placedBlocks, ...groundBlocks]
    );lastPreviewPosition.copy(
    previewBlock.position
);



    


    if (intersects.length > 0) {

    const hit = intersects[0];

    if (buildMode) {

        targetBlock.position.copy(
            hit.object.position
        );

        targetBlock.visible = true;
        lookBlock.visible = false;

    } else {

        lookBlock.position.copy(
            hit.object.position
        );

        lookBlock.visible = true;
        targetBlock.visible = false;

    }

} else {

    targetBlock.visible = false;
    lookBlock.visible = false;

}





if (intersects.length > 0) {

    const hit = intersects[0];

    if (keys["shift"]) {

        previewBlock.position.copy(
            hit.object.position
        );

        previewBlock.position.add(
            hit.face.normal
        );

    } else {


    previewBlock.position.set(
            hit.object.position.x,
            hit.object.position.y + 1,
            hit.object.position.z
        );
        

    }

} else {

    previewBlock.position.copy(
        lastPreviewPosition
    );

}

previewBlock.visible = buildMode;


cube.rotation.y += 0.01;




if (!flyMode) {

    velocityY -= 0.01;

    camera.position.y += velocityY;

    onGround = false;

    if (camera.position.y <= 2) {

        camera.position.y = 2;

        velocityY = 0;

        onGround = true;

    }

    for (const block of placedBlocks) {

        const overlapX =
            Math.abs(camera.position.x - block.position.x) < 0.8;

        const overlapZ =
            Math.abs(camera.position.z - block.position.z) < 0.8;

        const blockTop =
            block.position.y + 0.5;

        if (
            overlapX &&
            overlapZ &&
            velocityY <= 0 &&
            camera.position.y <= blockTop + 2 &&
            camera.position.y >= blockTop + 1.5
        ) {

            camera.position.y = blockTop + 2;

            velocityY = 0;

            onGround = true;
        }
    }
}


for (const block of placedBlocks) {

    const overlapX =
        Math.abs(camera.position.x - block.position.x) < 0.9;

    const overlapZ =
        Math.abs(camera.position.z - block.position.z) < 0.9;

    const blockBottom = block.position.y - 0.5;
    const blockTop = block.position.y + 0.5;

    const playerBottom = camera.position.y - 2;
    const playerTop = camera.position.y;

    const overlapY =
        playerBottom < blockTop &&
        playerTop > blockBottom;

    if (overlapX && overlapZ && overlapY) {

        camera.position.x = oldX;
        camera.position.z = oldZ;

        break;
    }
}


for (const piece of buildings) {

    const overlapX =
        Math.abs(camera.position.x - piece.position.x) <
        (piece.geometry.parameters.width / 2);

    const overlapZ =
        Math.abs(camera.position.z - piece.position.z) <
        (piece.geometry.parameters.depth / 2);

    const pieceBottom =
        piece.position.y -
        piece.geometry.parameters.height / 2;

    const pieceTop =
        piece.position.y +
        piece.geometry.parameters.height / 2;

    const playerBottom = camera.position.y - 2;
    const playerTop = camera.position.y;

    const overlapY =
        playerBottom < pieceTop &&
        playerTop > pieceBottom;

    if (overlapX && overlapZ && overlapY) {

        camera.position.x = oldX;
        camera.position.z = oldZ;

        break;

    }

}










    renderer.render(scene, camera);
}

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "b") {

        selectedBlock = "wood";

        console.log("Wood Block Selected");

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "v") {

        selectedBlock = "stone";

        console.log("Stone Block Selected");

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === " " && onGround && !flyMode) {

        velocityY = 0.25;
        onGround = false;

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "p") {

        saveGame();
        alert("GAME SAVED");

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "o") {

        localStorage.removeItem("survivalSave");

        console.log("Save Deleted");

    }

});

function saveGame() {

    const saveData = {

        wood: wood,
        stone: stone,
        health: health,
        kills: kills,

        player: {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        },

        blocks: placedBlocks.map(block => ({
            x: block.position.x,
            y: block.position.y,
            z: block.position.z,
            type: block.userData.blockType
        }))

    };

    localStorage.setItem(
        "survivalSave",
        JSON.stringify(saveData)
    );

    console.log("Game Saved");

}

function loadGame() {

    const saveData = JSON.parse(
        localStorage.getItem("survivalSave")
    );

    if (!saveData) return;

    wood = saveData.wood;
    stone = saveData.stone;
    health = saveData.health;
    kills = saveData.kills;

    camera.position.set(
        saveData.player.x,
        saveData.player.y,
        saveData.player.z
    );

    for (const block of saveData.blocks) {

        const newBlock = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
                color:
                    block.type === "wood"
                        ? 0x8B4513
                        : 0x888888
            })
        );

        newBlock.position.set(
            block.x,
            block.y,
            block.z
        );

        newBlock.userData.blockType =
            block.type;

        scene.add(newBlock);
        placedBlocks.push(newBlock);

    }

    console.log("Game Loaded");

}
const pads = navigator.getGamepads();

if (pads[0]) {

    gamepad = pads[0];

}

if (gamepad) {

    const lt = gamepad.buttons[6].pressed;

    if (lt && !lastLT) {

        buildMode = !buildMode;

        console.log(
            buildMode
                ? "Build Mode ON"
                : "Build Mode OFF"
        );

    }

    lastLT = lt;

}
if (gamepad) {

    const rt = gamepad.buttons[7].pressed;

    if (rt && !lastRT) {

        document.dispatchEvent(
            new MouseEvent("click")
        );

    }

    lastRT = rt;

}
if (gamepad) {

    const lb = gamepad.buttons[4].pressed;
    const rb = gamepad.buttons[5].pressed;

    if (lb && !lastLB) {

        selectedBlock = "wood";

        console.log("Wood Selected");

    }

    if (rb && !lastRB) {

        selectedBlock = "stone";

        console.log("Stone Selected");

    }

    lastLB = lb;
    lastRB = rb;

}



if (gamepad) {

    console.log(
        gamepad.axes[0],
        gamepad.axes[1]
    );

    console.log(
        "LX:", gamepad.axes[0],
        "LY:", gamepad.axes[1],
        "RX:", gamepad.axes[2],
        "RY:", gamepad.axes[3]
    );

}

console.log("STARTING GAME");
console.log("ANIMATE RUNNING");

loadGame();
animate();
