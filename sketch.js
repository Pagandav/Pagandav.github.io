const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 640;

// Game States
const STATE_TITLE = 'TITLE';
const STATE_BEDROOM = 'BEDROOM';
const STATE_LIVING_ROOM = 'LIVING_ROOM';
const STATE_TOILET = 'TOILET';
const STATE_FADING_OUT = 'FADING_OUT';
const STATE_FADING_IN = 'FADING_IN';

let currentState = STATE_TITLE;
let currentSceneToDraw = STATE_TITLE; // Scene to draw during fades
let nextSceneAfterFade = '';

let fadeAlpha = 0;
const FADE_SPEED = 5; // Lower is slower, higher is faster

// Clickable areas (will be defined in setup or draw functions for dynamic text sizing)
let startButtonRect;
const NAV_AREA_WIDTH = 150; // Width of the navigation click areas on left/right

function setup() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    textAlign(CENTER, CENTER);
    textSize(32);
    textFont('Arial'); // Or any font you prefer
}

function draw() {
    // Always draw the current scene first, then overlay fade if active
    drawScene(currentSceneToDraw);

    // Handle fading logic
    if (currentState === STATE_FADING_OUT) {
        fadeAlpha += FADE_SPEED;
        if (fadeAlpha >= 255) {
            fadeAlpha = 255;
            currentSceneToDraw = nextSceneAfterFade; // Switch the underlying scene
            currentState = STATE_FADING_IN;      // Start fading in
        }
    } else if (currentState === STATE_FADING_IN) {
        fadeAlpha -= FADE_SPEED;
        if (fadeAlpha <= 0) {
            fadeAlpha = 0;
            currentState = currentSceneToDraw; // Transition complete, set state to the new scene
        }
    }

    // Draw the fade overlay if alpha is greater than 0
    if (fadeAlpha > 0) {
        fill(0, 0, 0, fadeAlpha); // Black overlay
        rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
}

function drawScene(scene) {
    switch (scene) {
        case STATE_TITLE:
            drawTitleScreen();
            break;
        case STATE_BEDROOM:
            drawBedroom();
            break;
        case STATE_LIVING_ROOM:
            drawLivingRoom();
            break;
        case STATE_TOILET:
            drawToilet();
            break;
    }
}

function drawTitleScreen() {
    background(50, 50, 100); // Dark blue
    fill(255);
    textSize(64);
    text("老式冒險遊戲", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3);

    textSize(48);
    let startText = "start";
    let tw = textWidth(startText);
    let th = 48; // Approximate text height
    startButtonRect = {
        x: SCREEN_WIDTH / 2 - tw / 2 - 20, // Add some padding
        y: SCREEN_HEIGHT * 2 / 3 - th / 2 - 10,
        w: tw + 40,
        h: th + 20
    };
    // Optional: Draw a visible button area
    // noFill();
    // stroke(255);
    // rect(startButtonRect.x, startButtonRect.y, startButtonRect.w, startButtonRect.h);
    // noStroke();
    fill(200, 200, 255);
    text(startText, SCREEN_WIDTH / 2, SCREEN_HEIGHT * 2 / 3);
}

function drawBedroom() {
    background(150, 100, 80); // Brownish
    fill(255);
    textSize(48);
    text("臥室 (Bedroom)", SCREEN_WIDTH / 2, 50);

    textSize(24);
    fill(200);
    textAlign(LEFT, CENTER);
    text("< 前往廁所", 20, SCREEN_HEIGHT / 2);
    textAlign(RIGHT, CENTER);
    text("前往客廳 >", SCREEN_WIDTH - 20, SCREEN_HEIGHT / 2);
    textAlign(CENTER, CENTER); // Reset
}

function drawLivingRoom() {
    background(100, 150, 100); // Greenish
    fill(255);
    textSize(48);
    text("客廳 (Living Room)", SCREEN_WIDTH / 2, 50);

    textSize(24);
    fill(200);
    textAlign(LEFT, CENTER);
    text("< 前往臥室", 20, SCREEN_HEIGHT / 2);
    textAlign(CENTER, CENTER); // Reset
}

function drawToilet() {
    background(100, 100, 150); // Bluish-gray
    fill(255);
    textSize(48);
    text("廁所 (Toilet)", SCREEN_WIDTH / 2, 50);

    textSize(24);
    fill(200);
    textAlign(RIGHT, CENTER);
    text("前往臥室 >", SCREEN_WIDTH - 20, SCREEN_HEIGHT / 2);
    textAlign(CENTER, CENTER); // Reset
}

function mousePressed() {
    if (currentState === STATE_FADING_OUT || currentState === STATE_FADING_IN) {
        return; // Don't allow clicks during fade
    }

    switch (currentState) {
        case STATE_TITLE:
            if (startButtonRect && isMouseInRect(startButtonRect)) {
                startTransitionTo(STATE_BEDROOM);
            }
            break;
        case STATE_BEDROOM:
            // Click left side
            if (mouseX < NAV_AREA_WIDTH) {
                startTransitionTo(STATE_TOILET);
            }
            // Click right side
            else if (mouseX > SCREEN_WIDTH - NAV_AREA_WIDTH) {
                startTransitionTo(STATE_LIVING_ROOM);
            }
            break;
        case STATE_LIVING_ROOM:
            // Click left side
            if (mouseX < NAV_AREA_WIDTH) {
                startTransitionTo(STATE_BEDROOM);
            }
            break;
        case STATE_TOILET:
            // Click right side
            if (mouseX > SCREEN_WIDTH - NAV_AREA_WIDTH) {
                startTransitionTo(STATE_BEDROOM);
            }
            break;
    }
}

function isMouseInRect(rect) {
    return mouseX >= rect.x && mouseX <= rect.x + rect.w &&
           mouseY >= rect.y && mouseY <= rect.y + rect.h;
}

function startTransitionTo(newScene) {
    if (currentState === newScene || currentState === STATE_FADING_IN || currentState === STATE_FADING_OUT) {
        return; // Already transitioning or already in that scene
    }
    nextSceneAfterFade = newScene;
    // currentSceneToDraw remains the current scene for the fade-out effect
    currentState = STATE_FADING_OUT;
    fadeAlpha = 0; // Start fade out from fully visible
}