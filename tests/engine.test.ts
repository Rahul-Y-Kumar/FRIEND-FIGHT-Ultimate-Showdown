import assert from 'assert';
import { checkAABBOverlap, Box2D } from '../src/game/combat/Hitbox';
import { CollisionSystem } from '../src/game/combat/CollisionSystem';
import { CombatSystem } from '../src/game/combat/CombatSystem';
import { ATTACKS, getComboFeedback } from '../src/data/attacks';
import { createFighter, resetFighterForRound } from '../src/game/fighters/Fighter';
import { AIController } from '../src/game/ai/AIController';
import { MatchManager } from '../src/game/match/MatchManager';

console.log('🧪 RUNNING FRIEND FIGHT GAME ENGINE TESTS...\n');

// --- 1. COLLISION & HITBOX TESTS ---
console.log('1. Testing Collision & Hitbox Overlap...');
const boxA: Box2D = { minX: 0, maxX: 2, minY: 0, maxY: 2 };
const boxB: Box2D = { minX: 1.5, maxX: 3, minY: 1, maxY: 3 };
const boxC: Box2D = { minX: 5, maxX: 7, minY: 0, maxY: 2 };

assert.strictEqual(checkAABBOverlap(boxA, boxB), true, 'Overlapping boxes should return true');
assert.strictEqual(checkAABBOverlap(boxA, boxC), false, 'Separated boxes should return false');

const p1 = createFighter('p1', 'rahuuu', false);
const p2 = createFighter('p2', 'likithuuu', true);

const hurtboxP1 = CollisionSystem.getHurtbox(p1);
assert.ok(hurtboxP1.maxX > hurtboxP1.minX, 'Hurtbox should have positive width');
assert.ok(hurtboxP1.maxY > hurtboxP1.minY, 'Hurtbox should have positive height');
console.log('  ✅ Collision & Hitbox tests passed!');

// --- 2. COMBAT CALCULATIONS & PHASES ---
console.log('\n2. Testing Combat Calculations & Attack Execution...');
// Position fighters in range for a hit
p1.x = 0;
p2.x = 1.0;
p1.facing = 'right';
p2.facing = 'left';

const attackStarted = CombatSystem.tryStartAttack(p1, ATTACKS.LIGHT_PUNCH);
assert.strictEqual(attackStarted, true, 'Attack should start successfully');
assert.strictEqual(p1.attackPhase, 'startup', 'Attack initial phase should be startup');

// Step through startup frames
while (p1.attackPhase === 'startup') {
  CombatSystem.updateAttackerPhases(p1);
}
assert.strictEqual(p1.attackPhase, 'active', 'Attack should transition to active phase');

// Test hit evaluation
const initialHp = p2.health;
const hitResult = CombatSystem.evaluateCombat(p1, p2);
assert.ok(hitResult !== null, 'Hit should register in active phase and range');
assert.ok(p2.health < initialHp, 'Defender health must decrease after taking damage');
assert.strictEqual(hitResult?.isBlocked, false, 'Defender was not blocking');
assert.ok(p1.hitConfirmed, 'Attacker should mark hitConfirmed = true');

// Ensure second call does not multi-hit during same active window
const duplicateHit = CombatSystem.evaluateCombat(p1, p2);
assert.strictEqual(duplicateHit, null, 'Attack must not multi-hit in the same active window');

// Test blocking damage reduction
resetFighterForRound(p1);
resetFighterForRound(p2);
p1.x = 0;
p2.x = 1.0;
p1.facing = 'right';
p2.facing = 'left';
p2.isBlocking = true;

CombatSystem.tryStartAttack(p1, ATTACKS.LIGHT_PUNCH);
while (p1.attackPhase === 'startup') {
  CombatSystem.updateAttackerPhases(p1);
}
const blockedHit = CombatSystem.evaluateCombat(p1, p2);
assert.ok(blockedHit !== null, 'Blocked hit should register');
assert.strictEqual(blockedHit?.isBlocked, true, 'Hit should be marked as blocked');
assert.ok(blockedHit!.damage < hitResult!.damage, 'Blocked damage should be reduced by 75%');
console.log('  ✅ Combat damage & blocking tests passed!');

// --- 3. COMBO RECOGNITION TESTS ---
console.log('\n3. Testing Combo System...');
assert.strictEqual(getComboFeedback(1), null, 'Single hit should not trigger combo feedback');
const combo2 = getComboFeedback(2);
assert.ok(combo2 !== null, '2 hits should trigger combo');
assert.strictEqual(combo2?.text, 'NICE!', '2 hits should give NICE! feedback');
const combo4 = getComboFeedback(4);
assert.ok(combo4 !== null && combo4.multiplier > 1.2, '4 hits should award >1.2x damage multiplier');
console.log('  ✅ Combo recognition tests passed!');

// --- 4. AI CONTROLLER TESTS ---
console.log('\n4. Testing AI Decision Engine...');
const aiEasy = new AIController('EASY', 'DEFENSIVE');
const aiHard = new AIController('HARD', 'AGGRESSIVE');

// Verify AI updates without throwing
resetFighterForRound(p1);
resetFighterForRound(p2);
for (let i = 0; i < 60; i++) {
  aiEasy.update(p2, p1);
}
assert.ok(p2.x !== undefined && p2.health === 1000, 'AI should run 60 frames stably');

for (let i = 0; i < 60; i++) {
  aiHard.update(p2, p1);
}
console.log('  ✅ AI controller tests passed across difficulties & personalities!');

// --- 5. ROUND & MATCH PROGRESSION TESTS ---
console.log('\n5. Testing Match & Round Management...');
const match = new MatchManager();
match.initMatch();
let snap = match.getSnapshot();
assert.strictEqual(snap.currentRound, 1, 'Match should start on round 1');
assert.strictEqual(snap.roundStatus, 'PRE_ROUND', 'Initial round status should be PRE_ROUND');

// Progress countdown until fighting starts
while (match.getSnapshot().roundStatus !== 'FIGHTING') {
  match.update(p1, p2);
}
snap = match.getSnapshot();
assert.strictEqual(snap.roundStatus, 'FIGHTING', 'Match should transition to FIGHTING status');

// Simulate knockout: reduce P2 health to 0
p2.health = 0;
match.update(p1, p2);
snap = match.getSnapshot();
assert.strictEqual(snap.roundStatus, 'ROUND_OVER', 'Knockout should trigger ROUND_OVER');
assert.strictEqual(snap.p1RoundsWon, 1, 'P1 should win round 1');

// Progress transition to next round
for (let i = 0; i < 160; i++) {
  match.update(p1, p2);
}
snap = match.getSnapshot();
assert.strictEqual(snap.currentRound, 2, 'Should advance to round 2');

// Progress countdown for round 2 until fighting starts
while (match.getSnapshot().roundStatus !== 'FIGHTING') {
  match.update(p1, p2);
}

// Simulate round 2 knockout for P1 to win match (Best of 3)
p2.health = 0;
match.update(p1, p2);
// Progress round over transition
for (let i = 0; i < 160; i++) {
  match.update(p1, p2);
}
snap = match.getSnapshot();
assert.strictEqual(snap.roundStatus, 'MATCH_OVER', 'Winning 2 rounds should trigger MATCH_OVER');
assert.strictEqual(snap.matchWinner, 'p1', 'P1 should be declared match winner');
console.log('  ✅ Match & Round management tests passed!');

console.log('\n🎉 ALL 5 GAME ENGINE TEST SUITES PASSED FLAWLESSLY!\n');
