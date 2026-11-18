import { FighterState, AttackDef } from '../../types/game';
import { CollisionSystem } from './CollisionSystem';
import { audioManager } from '../effects/AudioManager';
import { getCharacterById } from '../../data/characters';
import { getComboFeedback } from '../../data/attacks';

export interface HitResult {
  attackerId: 'p1' | 'p2';
  defenderId: 'p1' | 'p2';
  damage: number;
  isBlocked: boolean;
  isCritical: boolean;
  hitX: number;
  hitY: number;
  comboCount: number;
  comboLabel?: string;
  attackType: string;
}

export class CombatSystem {
  public static updateAttackerPhases(f: FighterState) {
    if (!f.currentAttack || f.attackPhase === 'none') return;

    f.attackPhaseTimer++;
    const atk = f.currentAttack;

    if (f.attackPhase === 'startup') {
      if (f.attackPhaseTimer >= atk.startupFrames) {
        f.attackPhase = 'active';
        f.attackPhaseTimer = 0;
      }
    } else if (f.attackPhase === 'active') {
      if (f.attackPhaseTimer >= atk.activeFrames) {
        f.attackPhase = 'recovery';
        f.attackPhaseTimer = 0;
      }
    } else if (f.attackPhase === 'recovery') {
      if (f.attackPhaseTimer >= atk.recoveryFrames) {
        // Attack completed
        f.attackPhase = 'none';
        f.attackPhaseTimer = 0;
        f.currentAttack = null;
        f.hitConfirmed = false;
        if (f.isGrounded) {
          f.animState = f.isCrouching ? 'CROUCH' : 'IDLE';
        }
      }
    }
  }

  public static tryStartAttack(f: FighterState, atk: AttackDef): boolean {
    // Can only attack if not stunned, not in another attack, and not blocking
    if (f.stunTimer > 0 || f.attackPhase !== 'none' || f.isBlocking) {
      return false;
    }

    // Check resource costs
    if (f.energy < atk.energyCost || f.stamina < atk.staminaCost) {
      return false;
    }

    // Deduct costs
    f.energy -= atk.energyCost;
    f.stamina -= atk.staminaCost;

    f.currentAttack = atk;
    f.attackPhase = 'startup';
    f.attackPhaseTimer = 0;
    f.hitConfirmed = false;
    f.animState = atk.animation;

    // Play whoosh / sound for starting special or heavy attack
    if (atk.id === 'SPECIAL_ATTACK') {
      audioManager.playSpecialAttack();
      f.specialCooldownTimer = 180; // ~3s
    }

    return true;
  }

  public static evaluateCombat(
    attacker: FighterState,
    defender: FighterState
  ): HitResult | null {
    if (!CollisionSystem.checkHit(attacker, defender)) {
      return null;
    }

    attacker.hitConfirmed = true;
    const atk = attacker.currentAttack!;
    const attackerChar = getCharacterById(attacker.characterId);
    const defenderChar = getCharacterById(defender.characterId);

    // Check if defender is actively blocking and facing the attacker
    const facingAttacker =
      (defender.facing === 'left' && attacker.x < defender.x) ||
      (defender.facing === 'right' && attacker.x > defender.x);
    const isBlocked = defender.isBlocking && facingAttacker;

    // Damage calculations with stats
    const strengthMultiplier = 0.8 + (attackerChar.strength / 100) * 0.4;
    const defenseReduction = 1 - (defenderChar.defense / 100) * 0.25;

    let baseDamage = atk.damage * strengthMultiplier * defenseReduction;

    // Critical hit chance (~10%)
    const isCritical = Math.random() < 0.1;
    if (isCritical) {
      baseDamage *= 1.35;
    }

    // Combo multiplier
    attacker.comboCount = (attacker.comboCount || 0) + 1;
    attacker.comboTimer = 75; // ~1.25s at 60fps
    const comboInfo = getComboFeedback(attacker.comboCount);
    if (comboInfo) {
      baseDamage *= comboInfo.multiplier;
    }

    // Apply blocking reduction
    let finalDamage = Math.round(baseDamage);
    if (isBlocked) {
      finalDamage = Math.max(5, Math.round(finalDamage * 0.25)); // 75% reduction
      defender.stamina = Math.max(0, defender.stamina - 15);
      audioManager.playBlock();
    } else {
      // Play appropriate hit sound
      if (atk.id === 'LIGHT_PUNCH' || atk.id === 'DASH_PUNCH') {
        audioManager.playLightPunch();
      } else if (atk.id === 'HEAVY_PUNCH') {
        audioManager.playHeavyPunch();
      } else if (atk.id === 'KICK' || atk.id === 'JUMP_KICK') {
        audioManager.playKick();
      } else if (atk.id === 'SPECIAL_ATTACK') {
        audioManager.playHeavyPunch();
      }
    }

    // Apply health reduction
    defender.health = Math.max(0, defender.health - finalDamage);

    // Energy gain: attacker gains energy from landing, defender gains energy from damage
    attacker.energy = Math.min(attacker.maxEnergy, attacker.energy + (isBlocked ? 5 : 12));
    defender.energy = Math.min(defender.maxEnergy, defender.energy + (isBlocked ? 4 : 8));

    // Stun and knockback
    const dir = attacker.facing === 'right' ? 1 : -1;
    const knockbackMult = isBlocked ? 0.4 : 1.0;

    defender.vx += dir * atk.knockbackX * knockbackMult;
    if (!isBlocked && atk.knockbackY > 0) {
      defender.vy = atk.knockbackY;
      defender.isGrounded = false;
    }

    if (!isBlocked) {
      defender.stunTimer = atk.stunDuration;
      defender.animState = atk.knockbackY > 0.05 ? 'KNOCKBACK' : 'HIT';
      // Interrupt defender's attack if not in special armor
      if (defender.currentAttack && defender.currentAttack.id !== 'SPECIAL_ATTACK') {
        defender.attackPhase = 'none';
        defender.currentAttack = null;
      }
    }

    const hitX = (attacker.x + defender.x) / 2;
    const hitY = defender.y + (defender.isCrouching ? 0.8 : 1.3);

    return {
      attackerId: attacker.id,
      defenderId: defender.id,
      damage: finalDamage,
      isBlocked,
      isCritical,
      hitX,
      hitY,
      comboCount: attacker.comboCount,
      comboLabel: comboInfo?.text,
      attackType: atk.name,
    };
  }
}
