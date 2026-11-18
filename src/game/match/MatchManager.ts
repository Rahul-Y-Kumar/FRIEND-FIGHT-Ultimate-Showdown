import { FighterState, RoundStatus, MatchStats } from '../../types/game';
import { resetFighterForRound } from '../fighters/Fighter';
import { audioManager } from '../effects/AudioManager';

export interface MatchSnapshot {
  currentRound: number;
  maxRounds: number;
  p1RoundsWon: number;
  p2RoundsWon: number;
  roundTimer: number; // in seconds
  roundStatus: RoundStatus;
  countdownSeconds: number;
  roundWinner: 'p1' | 'p2' | 'draw' | null;
  matchWinner: 'p1' | 'p2' | null;
  bannerMessage: string | null;
  stats: MatchStats;
}

export class MatchManager {
  private currentRound = 1;
  private maxRounds = 3;
  private p1RoundsWon = 0;
  private p2RoundsWon = 0;
  private roundTimer = 90;
  private roundStatus: RoundStatus = 'PRE_ROUND';
  private countdownSeconds = 3;
  private timerTickCounter = 0;
  private transitionTimer = 0;
  private roundWinner: 'p1' | 'p2' | 'draw' | null = null;
  private matchWinner: 'p1' | 'p2' | null = null;
  private bannerMessage: string | null = 'ROUND 1';

  private stats: MatchStats = {
    p1DamageDealt: 0,
    p2DamageDealt: 0,
    p1DamageReceived: 0,
    p2DamageReceived: 0,
    p1MaxCombo: 0,
    p2MaxCombo: 0,
    p1SpecialsUsed: 0,
    p2SpecialsUsed: 0,
    p1Blocks: 0,
    p2Blocks: 0,
    matchDurationSeconds: 0,
  };

  public initMatch() {
    this.currentRound = 1;
    this.p1RoundsWon = 0;
    this.p2RoundsWon = 0;
    this.roundTimer = 90;
    this.roundStatus = 'PRE_ROUND';
    this.countdownSeconds = 3;
    this.timerTickCounter = 0;
    this.transitionTimer = 90; // ~1.5s
    this.roundWinner = null;
    this.matchWinner = null;
    this.bannerMessage = `ROUND 1`;
    this.stats = {
      p1DamageDealt: 0,
      p2DamageDealt: 0,
      p1DamageReceived: 0,
      p2DamageReceived: 0,
      p1MaxCombo: 0,
      p2MaxCombo: 0,
      p1SpecialsUsed: 0,
      p2SpecialsUsed: 0,
      p1Blocks: 0,
      p2Blocks: 0,
      matchDurationSeconds: 0,
    };
  }

  public recordDamage(attackerId: 'p1' | 'p2', damage: number, isBlocked: boolean, isSpecial: boolean) {
    if (attackerId === 'p1') {
      this.stats.p1DamageDealt += damage;
      this.stats.p2DamageReceived += damage;
      if (isSpecial) this.stats.p1SpecialsUsed++;
      if (isBlocked) this.stats.p2Blocks++;
    } else {
      this.stats.p2DamageDealt += damage;
      this.stats.p1DamageReceived += damage;
      if (isSpecial) this.stats.p2SpecialsUsed++;
      if (isBlocked) this.stats.p1Blocks++;
    }
  }

  public recordCombo(attackerId: 'p1' | 'p2', comboCount: number) {
    if (attackerId === 'p1') {
      this.stats.p1MaxCombo = Math.max(this.stats.p1MaxCombo, comboCount);
    } else {
      this.stats.p2MaxCombo = Math.max(this.stats.p2MaxCombo, comboCount);
    }
  }

  public update(p1: FighterState, p2: FighterState): boolean {
    if (this.roundStatus === 'MATCH_OVER') {
      return true; // Match finished
    }

    if (this.roundStatus === 'PRE_ROUND') {
      this.transitionTimer--;
      if (this.transitionTimer <= 0) {
        this.roundStatus = 'COUNTDOWN';
        this.countdownSeconds = 3;
        this.bannerMessage = '3';
        this.transitionTimer = 40; // frames per countdown number
        audioManager.playCountdown(3);
      }
      return false;
    }

    if (this.roundStatus === 'COUNTDOWN') {
      this.transitionTimer--;
      if (this.transitionTimer <= 0) {
        this.countdownSeconds--;
        if (this.countdownSeconds > 0) {
          this.bannerMessage = `${this.countdownSeconds}`;
          this.transitionTimer = 40;
          audioManager.playCountdown(this.countdownSeconds);
        } else if (this.countdownSeconds === 0) {
          this.bannerMessage = 'FIGHT!';
          this.transitionTimer = 35;
          audioManager.playCountdown(0);
        } else {
          this.roundStatus = 'FIGHTING';
          this.bannerMessage = null;
        }
      }
      return false;
    }

    if (this.roundStatus === 'FIGHTING') {
      // Tick round timer (60 simulation frames = 1 second)
      this.timerTickCounter++;
      if (this.timerTickCounter >= 60) {
        this.timerTickCounter = 0;
        this.roundTimer--;
        this.stats.matchDurationSeconds++;
      }

      // Check for knockout
      const p1Dead = p1.health <= 0;
      const p2Dead = p2.health <= 0;

      if (p1Dead || p2Dead || this.roundTimer <= 0) {
        this.roundStatus = 'ROUND_OVER';
        this.transitionTimer = 150; // ~2.5s for victory celebration

        if (p1Dead && p2Dead) {
          this.roundWinner = 'draw';
          this.bannerMessage = 'DOUBLE KNOCKOUT!';
          audioManager.playKnockout();
        } else if (p2Dead) {
          this.roundWinner = 'p1';
          this.p1RoundsWon++;
          p1.roundsWon = this.p1RoundsWon;
          p1.animState = 'VICTORY';
          p2.animState = 'DEFEAT';
          this.bannerMessage = 'KNOCKOUT! P1 WINS!';
          audioManager.playKnockout();
        } else if (p1Dead) {
          this.roundWinner = 'p2';
          this.p2RoundsWon++;
          p2.roundsWon = this.p2RoundsWon;
          p2.animState = 'VICTORY';
          p1.animState = 'DEFEAT';
          this.bannerMessage = 'KNOCKOUT! CPU WINS!';
          audioManager.playKnockout();
        } else {
          // Time expired
          if (p1.health > p2.health) {
            this.roundWinner = 'p1';
            this.p1RoundsWon++;
            p1.roundsWon = this.p1RoundsWon;
            this.bannerMessage = "TIME'S UP! P1 WINS!";
          } else if (p2.health > p1.health) {
            this.roundWinner = 'p2';
            this.p2RoundsWon++;
            p2.roundsWon = this.p2RoundsWon;
            this.bannerMessage = "TIME'S UP! CPU WINS!";
          } else {
            this.roundWinner = 'draw';
            this.bannerMessage = "TIME'S UP! DRAW!";
          }
        }
      }
      return false;
    }

    if (this.roundStatus === 'ROUND_OVER') {
      this.transitionTimer--;
      if (this.transitionTimer <= 0) {
        // Check if someone has won 2 rounds (Best of 3)
        if (this.p1RoundsWon >= 2) {
          this.matchWinner = 'p1';
          this.roundStatus = 'MATCH_OVER';
          this.bannerMessage = 'VICTORY! PLAYER 1 WINS THE MATCH!';
          audioManager.playVictoryFanfare();
          return true;
        } else if (this.p2RoundsWon >= 2) {
          this.matchWinner = 'p2';
          this.roundStatus = 'MATCH_OVER';
          this.bannerMessage = 'DEFEAT! CPU WINS THE MATCH!';
          audioManager.playVictoryFanfare();
          return true;
        } else {
          // Prepare for next round
          this.currentRound++;
          this.roundTimer = 90;
          this.roundWinner = null;
          this.roundStatus = 'PRE_ROUND';
          this.bannerMessage = `ROUND ${this.currentRound}`;
          this.transitionTimer = 75;

          resetFighterForRound(p1);
          resetFighterForRound(p2);
        }
      }
    }

    return false;
  }

  public getSnapshot(): MatchSnapshot {
    return {
      currentRound: this.currentRound,
      maxRounds: this.maxRounds,
      p1RoundsWon: this.p1RoundsWon,
      p2RoundsWon: this.p2RoundsWon,
      roundTimer: this.roundTimer,
      roundStatus: this.roundStatus,
      countdownSeconds: this.countdownSeconds,
      roundWinner: this.roundWinner,
      matchWinner: this.matchWinner,
      bannerMessage: this.bannerMessage,
      stats: { ...this.stats },
    };
  }
}
