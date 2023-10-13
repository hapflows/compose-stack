export class PersistentData<TCurrentState> {
  ls_key: string = '';
  getDefaultValues: () => TCurrentState;

  constructor(key: string, getDefaultValues: () => TCurrentState) {
    this.ls_key = key;
    this.getDefaultValues = getDefaultValues;
  }

  readData(returnDefault = false): TCurrentState | null {
    if (typeof localStorage === 'undefined') return null;

    const savedData = localStorage.getItem(this.ls_key);
    if (!savedData) {
      if (returnDefault) return { ...this.getDefaultValues() };
      return null;
    }

    const read = JSON.parse(savedData) as TCurrentState;
    return { ...this.getDefaultValues(), ...read };
  }

  setData(currentState: TCurrentState) {
    localStorage.setItem(this.ls_key, JSON.stringify(currentState));
  }

  updateValue<TKey extends keyof TCurrentState>(key: TKey, value: TCurrentState[TKey]) {
    const currentState = this.readData(true) as TCurrentState;
    currentState[key] = value;
    localStorage.setItem(this.ls_key, JSON.stringify(currentState));
  }

  removeData() {
    localStorage.removeItem(this.ls_key);
  }
}
