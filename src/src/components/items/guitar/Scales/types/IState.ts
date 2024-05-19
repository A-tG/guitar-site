export interface IState {
    id: number,
    toJSON(): any[]
    saveDefaults(): void
    loadDefaults(): void
}