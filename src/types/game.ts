export type Screen =
  | 'MAIN_MENU'
  | 'CHARACTER_SELECT'
  | 'CHARACTER_COLLECTION'
  | 'ARENA_SELECT'
  | 'FIGHT_PREPARATION'
  | 'FIGHTING'
  | 'MATCH_RESULTS'
  | 'SETTINGS'
  | 'HOW_TO_PLAY';

export type AIPersonality = 'AGGRESSIVE' | 'DEFENSIVE' | 'STRATEGIC' | 'UNPREDICTABLE' | 'BALANCED';
export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  damage: number;
  cooldown: number; // in seconds
  visualEffect: 'thunder' | 'fire' | 'shield' | 'chaos' | 'blink' | 'slam' | 'laser';
}

export interface CharacterVoiceLines {
  intro: string;
  victory: string;
  defeat: string;
  specialAttack: string;
}

export interface Character {
  id: string;
  name: string;
  nickname: string;
  portrait: string;
  fighterImage: string;
  aspectRatio: number; // width / height
  bio: string;
  strength: number; // 50 - 100
  speed: number;    // 50 - 100
  defense: number;  // 50 - 100
  stamina: number;  // 50 - 100
  specialAbility: SpecialAbility;
  personality: AIPersonality;
  voiceLines: CharacterVoiceLines;
  themeColor: {
    primary: string;
    secondary: string;
    glow: string;
  };
}

export interface Arena {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  theme: 'dojo' | 'rooftop' | 'neon';
  bgColor: string;
  ambientColor: string;
  lightIntensity: number;
  accentColor: string;
}

export type AnimationState =
  | 'IDLE'
  | 'WALK'
  | 'RUN'
  | 'JUMP'
  | 'CROUCH'
  | 'PUNCH'
  | 'HEAVY_PUNCH'
  | 'KICK'
  | 'BLOCK'
  | 'SPECIAL_ATTACK'
  | 'HIT'
  | 'STUN'
  | 'KNOCKBACK'
  | 'VICTORY'
  | 'DEFEAT';

export type AttackPhase = 'none' | 'startup' | 'active' | 'recovery';

export interface AttackDef {
  id: string;
  name: string;
  animation: AnimationState;
  startupFrames: number;
  activeFrames: number;
  recoveryFrames: number;
  damage: number;
  energyCost: number;
  staminaCost: number;
  range: number;
  hitboxWidth: number;
  hitboxHeight: number;
  knockbackX: number;
  knockbackY: number;
  stunDuration: number; // frames
  isMultiHit?: boolean;
}

export interface ComboFeedback {
  id: string;
  name: string;
  comboCount: number;
  multiplier: number;
  text: string;
  color: string;
}

export interface FighterState {
  id: 'p1' | 'p2';
  characterId: string;
  isAI: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  stamina: number;
  maxStamina: number;
  isGrounded: boolean;
  isCrouching: boolean;
  isBlocking: boolean;
  isDashing: boolean;
  dashTimer: number;
  animState: AnimationState;
  animTimer: number;
  currentAttack: AttackDef | null;
  attackPhase: AttackPhase;
  attackPhaseTimer: number;
  hitConfirmed: boolean;
  stunTimer: number;
  invulnerableTimer: number;
  comboCount: number;
  comboTimer: number;
  roundsWon: number;
  lastHitType: string | null;
  specialCooldownTimer: number;
}

export type RoundStatus = 'PRE_ROUND' | 'COUNTDOWN' | 'FIGHTING' | 'ROUND_OVER' | 'MATCH_OVER';

export interface MatchStats {
  p1DamageDealt: number;
  p2DamageDealt: number;
  p1DamageReceived: number;
  p2DamageReceived: number;
  p1MaxCombo: number;
  p2MaxCombo: number;
  p1SpecialsUsed: number;
  p2SpecialsUsed: number;
  p1Blocks: number;
  p2Blocks: number;
  matchDurationSeconds: number;
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  difficulty: AIDifficulty;
  aiPersonality: AIPersonality | 'CHARACTER_DEFAULT';
  graphicsQuality: 'LOW' | 'MEDIUM' | 'HIGH';
  screenShake: boolean;
  reducedMotion: boolean;
  mobileControlsAlways: boolean;
}
