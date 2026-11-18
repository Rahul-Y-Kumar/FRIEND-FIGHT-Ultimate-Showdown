export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
  vy: number;
  scale: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export class EffectsManager {
  public screenShake = 0;
  public floatingTexts: FloatingText[] = [];
  public particles: Particle[] = [];

  public triggerScreenShake(amount: number) {
    this.screenShake = Math.max(this.screenShake, amount);
  }

  public addHitEffect(x: number, y: number, isBlocked: boolean, isCritical: boolean, damage: number, comboLabel?: string) {
    // Screen shake
    this.triggerScreenShake(isCritical ? 14 : isBlocked ? 4 : 8);

    // Floating damage text
    const textId = `ft-${Date.now()}-${Math.random()}`;
    const damageColor = isBlocked ? '#9E9E9E' : isCritical ? '#FFD700' : '#FF5252';
    const damagePrefix = isCritical ? 'CRITICAL! ' : isBlocked ? 'BLOCKED ' : '';
    
    this.floatingTexts.push({
      id: textId,
      text: `${damagePrefix}-${damage}`,
      x,
      y: y + 0.5,
      color: damageColor,
      life: 45,
      maxLife: 45,
      vy: 0.02,
      scale: isCritical ? 1.5 : 1.1,
    });

    if (comboLabel) {
      this.floatingTexts.push({
        id: `${textId}-combo`,
        text: comboLabel,
        x,
        y: y + 1.1,
        color: '#FF9100',
        life: 55,
        maxLife: 55,
        vy: 0.015,
        scale: 1.3,
      });
    }

    // Spark particles
    const count = isCritical ? 24 : isBlocked ? 8 : 14;
    const baseColor = isBlocked ? '#B0BEC5' : isCritical ? '#FFD700' : '#FF3D00';

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.04 + Math.random() * 0.12;
      this.particles.push({
        id: `p-${Date.now()}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.03,
        color: Math.random() < 0.3 ? '#FFFFFF' : baseColor,
        size: 0.08 + Math.random() * 0.12,
        life: 25 + Math.floor(Math.random() * 15),
        maxLife: 40,
      });
    }
  }

  public addSpecialEffect(x: number, y: number, color: string) {
    this.triggerScreenShake(20);
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.18;
      this.particles.push({
        id: `sp-${Date.now()}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 0.15 + Math.random() * 0.2,
        life: 40 + Math.floor(Math.random() * 20),
        maxLife: 60,
      });
    }
  }

  public update() {
    // Decay screen shake
    if (this.screenShake > 0) {
      this.screenShake *= 0.85;
      if (this.screenShake < 0.5) this.screenShake = 0;
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life--;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.003; // subtle particle gravity
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}

export const effectsManager = new EffectsManager();
