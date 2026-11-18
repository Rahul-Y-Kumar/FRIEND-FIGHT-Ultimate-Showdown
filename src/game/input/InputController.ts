export interface InputCommands {
  left: boolean;
  right: boolean;
  jump: boolean;
  crouch: boolean;
  lightPunch: boolean;
  heavyPunch: boolean;
  kick: boolean;
  special: boolean;
  block: boolean;
  dash: boolean;
  pause: boolean;
}

export class InputController {
  private activeKeys = new Set<string>();
  private virtualInputs: Partial<InputCommands> = {};
  private inputBuffer: { key: string; time: number }[] = [];
  private onPauseCallback: (() => void) | null = null;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public attach() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
  }

  public detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    this.activeKeys.clear();
    this.virtualInputs = {};
  }

  public setOnPause(cb: () => void) {
    this.onPauseCallback = cb;
  }

  public setVirtualInput(action: keyof InputCommands, active: boolean) {
    this.virtualInputs[action] = active;
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Ignore if typing in text inputs or textareas
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    const key = e.key.toLowerCase();
    const code = e.code.toLowerCase();

    // Prevent scrolling for gameplay keys
    if (['space', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(code) || [' '].includes(key)) {
      e.preventDefault();
    }

    if (key === 'escape') {
      if (this.onPauseCallback) {
        this.onPauseCallback();
      }
      return;
    }

    if (!this.activeKeys.has(key)) {
      this.activeKeys.add(key);
      this.inputBuffer.push({ key, time: Date.now() });
      if (this.inputBuffer.length > 10) {
        this.inputBuffer.shift();
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    this.activeKeys.delete(key);
  }

  private handleBlur() {
    this.activeKeys.clear();
    this.virtualInputs = {};
  }

  public getCommands(): InputCommands {
    const k = this.activeKeys;
    const v = this.virtualInputs;

    return {
      left: k.has('a') || k.has('arrowleft') || !!v.left,
      right: k.has('d') || k.has('arrowright') || !!v.right,
      jump: k.has('w') || k.has('arrowup') || !!v.jump,
      crouch: k.has('s') || k.has('arrowdown') || !!v.crouch,
      lightPunch: k.has('j') || !!v.lightPunch,
      heavyPunch: k.has('k') || !!v.heavyPunch,
      kick: k.has('l') || !!v.kick,
      special: k.has('i') || !!v.special,
      block: k.has(' ') || !!v.block,
      dash: k.has('shift') || !!v.dash,
      pause: false,
    };
  }

  /**
   * Consumes one-shot attack trigger to prevent holding punch for 60 punches/sec
   */
  public consumeTrigger(key: string): boolean {
    const has = this.activeKeys.has(key);
    if (has) {
      this.activeKeys.delete(key);
      return true;
    }
    return false;
  }

  public consumeVirtualTrigger(action: keyof InputCommands): boolean {
    if (this.virtualInputs[action]) {
      this.virtualInputs[action] = false;
      return true;
    }
    return false;
  }
}
