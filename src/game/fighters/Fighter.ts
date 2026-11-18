import { FighterState, AttackDef } from '../../types/game';
import { ATTACKS } from '../../data/attacks';
import { CombatSystem } from '../combat/CombatSystem';
import { InputCommands } from '../input/InputController';
import { audioManager } from '../effects/AudioManager';

export function createFighter(
  id: 'p1' | 'p2',
  characterId: string,
  isAI: boolean
): FighterState {
  const isP1 = id === 'p1';
  return {
    id,
    characterId,
    isAI,
    x: isP1 ? -3.0 : 3.0,
    y: 0,
    vx: 0,
    vy: 0,
    facing: isP1 ? 'right' : 'left',
    health: 1000,
    maxHealth: 1000,
    energy: 100,
    maxEnergy: 100,
    stamina: 100,
    maxStamina: 100,
    isGrounded: true,
    isCrouching: false,
    isBlocking: false,
    isDashing: false,
    dashTimer: 0,
    animState: 'IDLE',
    animTimer: 0,
    currentAttack: null,
    attackPhase: 'none',
    attackPhaseTimer: 0,
    hitConfirmed: false,
    stunTimer: 0,
    invulnerableTimer: 0,
    comboCount: 0,
    comboTimer: 0,
    roundsWon: 0,
    lastHitType: null,
    specialCooldownTimer: 0,
  };
}

export function resetFighterForRound(f: FighterState) {
  const isP1 = f.id === 'p1';
  f.x = isP1 ? -3.0 : 3.0;
  f.y = 0;
  f.vx = 0;
  f.vy = 0;
  f.facing = isP1 ? 'right' : 'left';
  f.health = f.maxHealth;
  f.energy = 50; // starts with half energy each round for dynamic combat
  f.stamina = f.maxStamina;
  f.isGrounded = true;
  f.isCrouching = false;
  f.isBlocking = false;
  f.isDashing = false;
  f.dashTimer = 0;
  f.animState = 'IDLE';
  f.animTimer = 0;
  f.currentAttack = null;
  f.attackPhase = 'none';
  f.attackPhaseTimer = 0;
  f.hitConfirmed = false;
  f.stunTimer = 0;
  f.invulnerableTimer = 0;
  f.comboCount = 0;
  f.comboTimer = 0;
  f.specialCooldownTimer = 0;
}

export function applyPlayerInput(f: FighterState, input: InputCommands) {
  if (f.stunTimer > 0) {
    f.isBlocking = false;
    return;
  }

  // Handle blocking
  if (input.block && f.isGrounded && f.attackPhase === 'none') {
    f.isBlocking = true;
    f.animState = 'BLOCK';
    f.vx *= 0.5;
    return;
  } else {
    f.isBlocking = false;
  }

  // Handle crouching
  if (input.crouch && f.isGrounded && f.attackPhase === 'none') {
    f.isCrouching = true;
    f.animState = 'CROUCH';
    f.vx *= 0.5;
  } else {
    f.isCrouching = false;
  }

  // Handle attacks (only when not crouching or as low attacks)
  if (input.special) {
    CombatSystem.tryStartAttack(f, ATTACKS.SPECIAL_ATTACK);
    return;
  }
  if (input.heavyPunch) {
    CombatSystem.tryStartAttack(f, ATTACKS.HEAVY_PUNCH);
    return;
  }
  if (input.kick) {
    if (!f.isGrounded) {
      CombatSystem.tryStartAttack(f, ATTACKS.JUMP_KICK);
    } else {
      CombatSystem.tryStartAttack(f, ATTACKS.KICK);
    }
    return;
  }
  if (input.lightPunch) {
    if (f.isDashing) {
      CombatSystem.tryStartAttack(f, ATTACKS.DASH_PUNCH);
    } else {
      CombatSystem.tryStartAttack(f, ATTACKS.LIGHT_PUNCH);
    }
    return;
  }

  // If in active attack, do not allow movement input
  if (f.attackPhase !== 'none') return;

  // Handle Dash
  if (input.dash && f.isGrounded && f.stamina >= 20 && !f.isDashing) {
    const dir = input.left ? -1 : input.right ? 1 : f.facing === 'right' ? 1 : -1;
    f.isDashing = true;
    f.dashTimer = 10;
    f.stamina -= 20;
    f.vx = dir * 0.24;
    audioManager.playDash();
    f.animState = 'RUN';
    return;
  }

  // Dash timer decrement
  if (f.isDashing) {
    f.dashTimer--;
    if (f.dashTimer <= 0) {
      f.isDashing = false;
    }
    return;
  }

  // Handle jumping
  if (input.jump && f.isGrounded && !f.isCrouching) {
    f.isGrounded = false;
    f.vy = 0.35;
    f.animState = 'JUMP';
    audioManager.playJump();
    return;
  }

  // Horizontal movement
  const moveSpeed = 0.095;
  if (input.left && !f.isCrouching) {
    f.vx = -moveSpeed;
    if (f.isGrounded) f.animState = 'WALK';
  } else if (input.right && !f.isCrouching) {
    f.vx = moveSpeed;
    if (f.isGrounded) f.animState = 'WALK';
  } else {
    if (f.isGrounded && !f.isCrouching && f.attackPhase === 'none') {
      f.animState = 'IDLE';
    }
  }
}
