import { FighterState, AIDifficulty, AIPersonality } from '../../types/game';
import { createFighter, applyPlayerInput } from '../fighters/Fighter';
import { InputController } from '../input/InputController';
import { AIController } from '../ai/AIController';
import { PhysicsSystem } from '../physics/PhysicsSystem';
import { CombatSystem } from '../combat/CombatSystem';
import { MatchManager, MatchSnapshot } from '../match/MatchManager';
import { effectsManager } from '../effects/EffectsManager';

export interface GameEngineState {
  p1: FighterState;
  p2: FighterState;
  match: MatchSnapshot;
  isPaused: boolean;
}

export class GameEngine {
  public p1: FighterState;
  public p2: FighterState;
  public input: InputController;
  public ai: AIController;
  public match: MatchManager;

  private isRunning = false;
  private isPaused = false;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private accumulator = 0;
  private readonly fixedTimestep = 1000 / 60; // 16.67ms per tick

  private listeners: Set<(state: GameEngineState) => void> = new Set();
  private onMatchFinishedCallback: ((match: MatchSnapshot) => void) | null = null;

  constructor(
    p1CharId: string,
    p2CharId: string,
    difficulty: AIDifficulty = 'MEDIUM',
    aiPersonality: AIPersonality = 'BALANCED'
  ) {
    this.p1 = createFighter('p1', p1CharId, false);
    this.p2 = createFighter('p2', p2CharId, true);
    this.input = new InputController();
    this.ai = new AIController(difficulty, aiPersonality);
    this.match = new MatchManager();

    this.input.setOnPause(() => {
      this.togglePause();
    });

    this.loop = this.loop.bind(this);
  }

  public subscribe(listener: (state: GameEngineState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setOnMatchFinished(cb: (match: MatchSnapshot) => void) {
    this.onMatchFinishedCallback = cb;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.input.attach();
    this.match.initMatch();
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.input.detach();
  }

  public togglePause() {
    this.isPaused = !this.isPaused;
    this.notifyListeners();
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    this.notifyListeners();
  }

  public restartMatch() {
    this.p1 = createFighter('p1', this.p1.characterId, false);
    this.p2 = createFighter('p2', this.p2.characterId, true);
    this.match.initMatch();
    this.isPaused = false;
    this.notifyListeners();
  }

  private loop(currentTime: number) {
    if (!this.isRunning) return;

    let delta = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Clamp huge frame jumps (e.g. background tab or lag spike)
    if (delta > 200) delta = 200;

    if (!this.isPaused) {
      this.accumulator += delta;

      // Fixed timestep updates
      while (this.accumulator >= this.fixedTimestep) {
        this.stepSimulation();
        this.accumulator -= this.fixedTimestep;
      }
    }

    this.notifyListeners();
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  private stepSimulation() {
    const matchSnap = this.match.getSnapshot();

    // 1. Process player controls & AI decisions if in fighting phase
    if (matchSnap.roundStatus === 'FIGHTING') {
      const commands = this.input.getCommands();
      applyPlayerInput(this.p1, commands);
      this.ai.update(this.p2, this.p1);
    } else if (matchSnap.roundStatus === 'ROUND_OVER' || matchSnap.roundStatus === 'MATCH_OVER') {
      // Victory / Defeat poses
    } else {
      // Countdown or pre-round: keep fighters grounded and idle
      this.p1.animState = 'IDLE';
      this.p2.animState = 'IDLE';
    }

    // 2. Physics & movement
    PhysicsSystem.update(this.p1, this.p2);

    // 3. Combat attack phases progression
    CombatSystem.updateAttackerPhases(this.p1);
    CombatSystem.updateAttackerPhases(this.p2);

    // 4. Hit detection & damage calculation
    if (matchSnap.roundStatus === 'FIGHTING') {
      // Check P1 attacking P2
      const p1Hit = CombatSystem.evaluateCombat(this.p1, this.p2);
      if (p1Hit) {
        this.match.recordDamage('p1', p1Hit.damage, p1Hit.isBlocked, this.p1.currentAttack?.id === 'SPECIAL_ATTACK');
        this.match.recordCombo('p1', p1Hit.comboCount);
        effectsManager.addHitEffect(
          p1Hit.hitX,
          p1Hit.hitY,
          p1Hit.isBlocked,
          p1Hit.isCritical,
          p1Hit.damage,
          p1Hit.comboLabel
        );
      }

      // Check P2 attacking P1
      const p2Hit = CombatSystem.evaluateCombat(this.p2, this.p1);
      if (p2Hit) {
        this.match.recordDamage('p2', p2Hit.damage, p2Hit.isBlocked, this.p2.currentAttack?.id === 'SPECIAL_ATTACK');
        this.match.recordCombo('p2', p2Hit.comboCount);
        effectsManager.addHitEffect(
          p2Hit.hitX,
          p2Hit.hitY,
          p2Hit.isBlocked,
          p2Hit.isCritical,
          p2Hit.damage,
          p2Hit.comboLabel
        );
      }
    }

    // 5. Update visual effects & particles
    effectsManager.update();

    // 6. Round and Match lifecycle update
    const matchFinished = this.match.update(this.p1, this.p2);
    if (matchFinished && this.onMatchFinishedCallback) {
      this.onMatchFinishedCallback(this.match.getSnapshot());
    }
  }

  private notifyListeners() {
    const state: GameEngineState = {
      p1: this.p1,
      p2: this.p2,
      match: this.match.getSnapshot(),
      isPaused: this.isPaused,
    };
    this.listeners.forEach((l) => l(state));
  }
}
