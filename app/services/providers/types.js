/**
 * @typedef {Object} ProviderAdapter
 * @property {(shopId: string) => Promise<boolean>} isConnected
 * @property {(shopId: string) => Promise<Array<{ id: string, name: string }>>} listAccounts
 * @property {(shopId: string, opts: { since: Date, until: Date }) => Promise<{ spend: number, purchases?: number } | null>} fetchSpendAndConversions
 * @property {(shopId: string, params: unknown) => Promise<{ actionAttempted?: string, success?: boolean }>} [pauseEntities]
 * @property {(shopId: string, params: unknown) => Promise<{ actionAttempted?: string, success?: boolean }>} [setBudgets]
 */

export {};
