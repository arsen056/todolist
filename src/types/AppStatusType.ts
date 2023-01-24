export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppStatusType = {
    initialized: boolean,
    status: StatusType
    error: string | null
}