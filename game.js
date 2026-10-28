//public/game.js
// Simplified logic snippet for the movement loop
function update() {
    // 1. Get input
    if (keys['w']) drone.rotation.x -= 0.02;
    if (keys['s']) drone.rotation.x += 0.02;
    if (keys['a']) drone.rotation.y += 0.02;
    if (keys['d']) drone.rotation.y -= 0.02;

    // 2. Apply movement based on rotation
    drone.position.x += Math.sin(drone.rotation.y) * drone.velocity.x;
    drone.position.z += Math.cos(drone.rotation.y) * drone.velocity.z;

    // 3. Send to server
    socket.emit('move', {
        x: drone.position.x,
        y: drone.position.y,
        z: drone.position.z,
        rx: drone.rotation.x,
        ry: drone.rotation.y,
        rz: drone.rotation.z
    });

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}