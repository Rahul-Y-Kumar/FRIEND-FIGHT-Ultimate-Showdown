import { FighterState } from '../../types/game';
import { Box2D, checkAABBOverlap } from './Hitbox';

export class CollisionSystem {
  public static getHurtbox(f: FighterState): Box2D {
    const width = 0.9;
    const height = f.isCrouching ? 1.4 : 2.2;
    const halfW = width / 2;

    return {
      minX: f.x - halfW,
      maxX: f.x + halfW,
      minY: f.y,
      maxY: f.y + height,
    };
  }

  public static getAttackHitbox(attacker: FighterState): Box2D | null {
    if (!attacker.currentAttack || attacker.attackPhase !== 'active') {
      return null;
    }

    const atk = attacker.currentAttack;
    const dir = attacker.facing === 'right' ? 1 : -1;
    const reach = atk.range;
    const w = atk.hitboxWidth;
    const h = atk.hitboxHeight;

    const centerX = attacker.x + dir * (reach * 0.55);
    const centerY = attacker.y + (attacker.isCrouching ? 0.8 : 1.2);

    return {
      minX: centerX - w / 2,
      maxX: centerX + w / 2,
      minY: centerY - h / 2,
      maxY: centerY + h / 2,
    };
  }

  public static checkHit(attacker: FighterState, defender: FighterState): boolean {
    if (attacker.hitConfirmed) return false;
    if (defender.invulnerableTimer > 0) return false;

    const attackHitbox = this.getAttackHitbox(attacker);
    if (!attackHitbox) return false;

    const defenderHurtbox = this.getHurtbox(defender);
    return checkAABBOverlap(attackHitbox, defenderHurtbox);
  }
}
