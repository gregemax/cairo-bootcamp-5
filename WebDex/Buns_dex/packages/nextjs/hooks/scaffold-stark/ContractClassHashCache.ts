import { BlockIdentifier, ProviderInterface } from "starknet";

export class ContractClassHashCache {
  private static instance: ContractClassHashCache;
  private cache = new Map<string, string>();
  private pendingRequests = new Map<string, Promise<string | undefined>>();

  private constructor() {}

  public static getInstance(): ContractClassHashCache {
    if (!ContractClassHashCache.instance) {
      ContractClassHashCache.instance = new ContractClassHashCache();
    }
    return ContractClassHashCache.instance;
  }

  public async getClassHash(
    publicClient: ProviderInterface,
    address: string,
    blockIdentifier: BlockIdentifier = "pending",
  ): Promise<string | undefined> {
    const cacheKey = `${address}-${blockIdentifier}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const pendingRequest = this.fetchClassHash(
      publicClient,
      address,
      blockIdentifier,
      cacheKey,
    );
    this.pendingRequests.set(cacheKey, pendingRequest);

    try {
      return await pendingRequest;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async fetchClassHash(
    publicClient: ProviderInterface,
    address: string,
    blockIdentifier: BlockIdentifier,
    cacheKey: string,
  ): Promise<string | undefined> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const classHash = await publicClient.getClassHashAt(
          address,
          blockIdentifier,
        );
        this.cache.set(cacheKey, classHash);
        return classHash;
      } catch (error) {
        console.error(`Failed to fetch class hash (attempt ${attempt}/${maxRetries}):`, error);

        if (attempt === maxRetries) {
          // Log detailed error information for debugging
          console.error("Final failure details:", {
            address,
            blockIdentifier,
            error: error instanceof Error ? error.message : String(error),
            cacheKey,
          });
          return undefined;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  public clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

