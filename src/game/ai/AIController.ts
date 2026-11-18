import { FighterState, AIDifficulty, AIPersonality } from '../../types/game';
import { ATTACKS } from '../../data/attacks';
import { CombatSystem } from '../combat/CombatSystem';
import { audioManager } from '../effects/AudioManager';

export type AIAction =
  | 'IDLE'
  | 'APPROACH'
  | 'RETREAT'
  | 'JUMP_IN'
  | 'LIGHT_ATTACK'
  | 'HEAVY_ATTACK'
  | 'KICK'
  | 'SPECIAL_ATTACK'
  | 'BLOCK'
  | 'DASH_FORWARD'
  | 'DASH_BACK';

export class AIController {
  private currentAction: AIAction = 'IDLE';
  private decisionTimer = 0;
  private actionDuration = 0;
  private comboChainStep = 0;

  constructor(
    private difficulty: AIDifficulty = 'MEDIUM',
    private personality: AIPersonality = 'BALANCED'
  ) {}

  public setSettings(difficulty: AIDifficulty, personality: AIPersonality) {
    this.difficulty = difficulty;
    this.personality = personality;
  }

  public update(ai: FighterState, player: FighterState) {
    if (ai.stunTimer > 0) {
      ai.isBlocking = false;
      return;
    }

    this.decisionTimer--;
    if (this.decisionTimer <= 0) {
      this.makeDecision(ai, player);
    }

    this.executeAction(ai, player);
  }

  private makeDecision(ai: FighterState, player: FighterState) {
    const dist = Math.abs(ai.x - player.x);
    const inMeleeRange = dist <= 1.8;
    const inKickRange = dist <= 2.2;
    const inSpecialRange = dist <= 3.2;

    // Reaction speed intervals based on difficulty
    const intervals: Record<AIDifficulty, number> = {
      EASY: 28 + Math.floor(Math.random() * 16),
      MEDIUM: 14 + Math.floor(Math.random() * 10),
      HARD: 7 + Math.floor(Math.random() * 6),
    };
    this.decisionTimer = intervals[this.difficulty];

    // Mistake chance
    const mistakeChance: Record<AIDifficulty, number> = {
      EASY: 0.35,
      MEDIUM: 0.15,
      HARD: 0.04,
    };

    if (Math.random() < mistakeChance[this.difficulty]) {
      this.currentAction = Math.random() < 0.5 ? 'IDLE' : 'RETREAT';
      this.actionDuration = 15;
      return;
    }

    // Defensive check: if player is currently attacking and close enough, consider blocking
    const playerIsAttacking = player.attackPhase === 'startup' || player.attackPhase === 'active';
    if (playerIsAttacking && dist < 2.5) {
      const blockProb: Record<AIDifficulty, number> = {
        EASY: 0.2,
        MEDIUM: 0.55,
        HARD: 0.85,
      };

      const personalityMod = this.personality === 'DEFENSIVE' ? 0.2 : this.personality === 'AGGRESSIVE' ? -0.15 : 0;
      if (Math.random() < blockProb[this.difficulty] + personalityMod) {
        this.currentAction = 'BLOCK';
        this.actionDuration = 20;
        return;
      }
    }

    // Special attack decision: energy >= 40 and player not invulnerable
    if (ai.energy >= 40 && inSpecialRange && player.invulnerableTimer <= 0 && ai.specialCooldownTimer <= 0) {
      const specialProb: Record<AIDifficulty, number> = {
        EASY: 0.3,
        MEDIUM: 0.6,
        HARD: 0.85,
      };
      if (Math.random() < specialProb[this.difficulty]) {
        this.currentAction = 'SPECIAL_ATTACK';
        this.actionDuration = 10;
        return;
      }
    }

    // Personality-based action picking
    switch (this.personality) {
      case 'AGGRESSIVE':
        if (inMeleeRange) {
          const r = Math.random();
          this.currentAction = r < 0.45 ? 'LIGHT_ATTACK' : r < 0.75 ? 'HEAVY_ATTACK' : 'KICK';
        } else if (dist < 4.0 && Math.random() < 0.35 && ai.stamina >= 25) {
          this.currentAction = 'DASH_FORWARD';
        } else {
          this.currentAction = 'APPROACH';
        }
        break;

      case 'DEFENSIVE':
        if (inMeleeRange) {
          if (Math.random() < 0.5) {
            this.currentAction = 'BLOCK';
          } else {
            this.currentAction = 'KICK'; // poke and disengage
          }
        } else if (dist < 3.0) {
          this.currentAction = Math.random() < 0.6 ? 'RETREAT' : 'IDLE';
        } else {
          this.currentAction = 'IDLE';
        }
        break;

      case 'STRATEGIC':
        if (player.isBlocking) {
          // If player blocks, heavy attack or wait for guard to drop
          this.currentAction = inKickRange ? 'HEAVY_ATTACK' : 'APPROACH';
        } else if (inMeleeRange) {
          // Try combo initiation
          this.currentAction = this.comboChainStep === 0 ? 'LIGHT_ATTACK' : 'KICK';
          this.comboChainStep = (this.comboChainStep + 1) % 2;
        } else if (dist > 3.5) {
          this.currentAction = 'APPROACH';
        } else {
          this.currentAction = Math.random() < 0.5 ? 'APPROACH' : 'JUMP_IN';
        }
        break;

      case 'UNPREDICTABLE': {
        const rand = Math.random();
        if (rand < 0.25) this.currentAction = inMeleeRange ? 'KICK' : 'APPROACH';
        else if (rand < 0.5) this.currentAction = inMeleeRange ? 'HEAVY_ATTACK' : 'JUMP_IN';
        else if (rand < 0.75) this.currentAction = 'RETREAT';
        else this.currentAction = inMeleeRange ? 'LIGHT_ATTACK' : 'DASH_FORWARD';
        break;
      }

      case 'BALANCED':
      default:
        if (inMeleeRange) {
          const r = Math.random();
          if (r < 0.4) this.currentAction = 'LIGHT_ATTACK';
          else if (r < 0.7) this.currentAction = 'KICK';
          else this.currentAction = 'HEAVY_ATTACK';
        } else if (dist > 3.0) {
          this.currentAction = Math.random() < 0.8 ? 'APPROACH' : 'JUMP_IN';
        } else {
          this.currentAction = Math.random() < 0.6 ? 'APPROACH' : 'RETREAT';
        }
        break;
    }

    this.actionDuration = 12 + Math.floor(Math.random() * 10);
  }

  private executeAction(ai: FighterState, player: FighterState) {
    // Reset blocking by default unless action is BLOCK
    if (this.currentAction !== 'BLOCK') {
      ai.isBlocking = false;
    }

    const moveSpeed = 0.085;
    const dirToPlayer = player.x > ai.x ? 1 : -1;

    switch (this.currentAction) {
      case 'APPROACH':
        if (ai.attackPhase === 'none') {
          ai.vx = dirToPlayer * moveSpeed;
          ai.animState = 'WALK';
        }
        break;

      case 'RETREAT':
        if (ai.attackPhase === 'none') {
          ai.vx = -dirToPlayer * (moveSpeed * 0.85);
          ai.animState = 'WALK';
        }
        break;

      case 'JUMP_IN':
        if (ai.isGrounded && ai.attackPhase === 'none') {
          ai.isGrounded = false;
          ai.vy = 0.32;
          ai.vx = dirToPlayer * (moveSpeed * 1.3);
          ai.animState = 'JUMP';
          audioManager.playJump();
        }
        break;

      case 'BLOCK':
        if (ai.attackPhase === 'none') {
          ai.isBlocking = true;
          ai.vx *= 0.5;
          ai.animState = 'BLOCK';
        }
        break;

      case 'DASH_FORWARD':
        if (ai.isGrounded && ai.attackPhase === 'none' && ai.stamina >= 20) {
          ai.isDashing = true;
          ai.stamina -= 20;
          ai.vx = dirToPlayer * 0.22;
          audioManager.playDash();
          this.currentAction = 'IDLE';
        }
        break;

      case 'LIGHT_ATTACK':
        CombatSystem.tryStartAttack(ai, ATTACKS.LIGHT_PUNCH);
        this.currentAction = 'IDLE';
        break;

      case 'HEAVY_ATTACK':
        CombatSystem.tryStartAttack(ai, ATTACKS.HEAVY_PUNCH);
        this.currentAction = 'IDLE';
        break;

      case 'KICK':
        CombatSystem.tryStartAttack(ai, ATTACKS.KICK);
        this.currentAction = 'IDLE';
        break;

      case 'SPECIAL_ATTACK':
        CombatSystem.tryStartAttack(ai, ATTACKS.SPECIAL_ATTACK);
        this.currentAction = 'IDLE';
        break;

      case 'IDLE':
      default:
        if (ai.attackPhase === 'none' && ai.isGrounded && !ai.isBlocking) {
          ai.animState = 'IDLE';
        }
        break;
    }
  }
}
