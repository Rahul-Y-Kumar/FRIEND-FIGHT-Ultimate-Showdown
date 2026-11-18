import { FighterState } from '../../types/game';

export class PhysicsSystem {
  public static readonly GRAVITY = 0.016;
  public static readonly ARENA_MIN_X = -6.5;
  public static readonly ARENA_MAX_X = 6.5;
  public static readonly GROUND_Y = 0;
  public static readonly MIN_FIGHTER_DISTANCE = 0.95;

  public static update(p1: FighterState, p2: FighterState) {
    this.updateFighterPhysics(p1);
    this.updateFighterPhysics(p2);
    this.resolveFighterSeparation(p1, p2);
    this.updateFacingDirections(p1, p2);
  }

  private static updateFighterPhysics(f: FighterState) {
    // Apply horizontal velocity
    f.x += f.vx;

    // Apply arena wall boundaries
    if (f.x < this.ARENA_MIN_X) {
      f.x = this.ARENA_MIN_X;
      f.vx = 0;
    } else if (f.x > this.ARENA_MAX_X) {
      f.x = this.ARENA_MAX_X;
      f.vx = 0;
    }

    // Apply gravity and vertical velocity
    if (!f.isGrounded) {
      f.vy -= this.GRAVITY;
      f.y += f.vy;

      // Ground collision
      if (f.y <= this.GROUND_Y) {
        f.y = this.GROUND_Y;
        f.vy = 0;
        f.isGrounded = true;
        if (f.animState === 'JUMP') {
          f.animState = 'IDLE';
        }
      }
    }

    // Apply friction to horizontal velocity when on ground
    if (f.isGrounded) {
      f.vx *= 0.82;
      if (Math.abs(f.vx) < 0.005) {
        f.vx = 0;
      }
    } else {
      f.vx *= 0.95;
    }

    // Passive stamina and energy regeneration
    if (f.stamina < f.maxStamina && !f.isDashing && !f.isBlocking) {
      f.stamina = Math.min(f.maxStamina, f.stamina + 0.25);
    }
    if (f.energy < f.maxEnergy) {
      f.energy = Math.min(f.maxEnergy, f.energy + 0.08); // passive slow energy trickle
    }

    // Tick timers
    if (f.stunTimer > 0) f.stunTimer--;
    if (f.invulnerableTimer > 0) f.invulnerableTimer--;
    if (f.specialCooldownTimer > 0) f.specialCooldownTimer--;

    // Tick combo timer
    if (f.comboTimer > 0) {
      f.comboTimer--;
      if (f.comboTimer === 0) {
        f.comboCount = 0;
      }
    }
  }

  private static resolveFighterSeparation(p1: FighterState, p2: FighterState) {
    const dx = p2.x - p1.x;
    const dist = Math.abs(dx);

    if (dist < this.MIN_FIGHTER_DISTANCE) {
      const overlap = (this.MIN_FIGHTER_DISTANCE - dist) / 2;
      const sign = dx >= 0 ? 1 : -1;

      // Push each fighter apart if within boundaries
      p1.x -= sign * overlap;
      p2.x += sign * overlap;

      // Clamp again to arena boundaries
      p1.x = Math.max(this.ARENA_MIN_X, Math.min(this.ARENA_MAX_X, p1.x));
      p2.x = Math.max(this.ARENA_MIN_X, Math.min(this.ARENA_MAX_X, p2.x));
    }
  }

  private static updateFacingDirections(p1: FighterState, p2: FighterState) {
    // Do not turn during active attack or stun
    const canTurnP1 = p1.attackPhase === 'none' && p1.stunTimer <= 0;
    const canTurnP2 = p2.attackPhase === 'none' && p2.stunTimer <= 0;

    if (canTurnP1) {
      p1.facing = p1.x <= p2.x ? 'right' : 'left';
    }
    if (canTurnP2) {
      p2.facing = p2.x <= p1.x ? 'right' : 'left';
    }
  }
}
