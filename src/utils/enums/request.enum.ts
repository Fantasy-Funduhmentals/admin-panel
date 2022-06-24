export enum REQUEST_TYPES {
  TOKENS_SWAP = "tokensSwap",
  CRYPTO_PURCHASE = "cryptoPurchase",
  FIAT_PURCHASE = "fiatPurchase",
}

export enum REQUEST_STATUS {
  APPROVED = "approved",
  REJECTED = "rejected",
  NO_RESPONSE = "noResponse",
}

export enum DIRECT_WIRE {
  TOKEN_PURCHASE = "tokenPurchase",
  NFT_PURCHASE = "nftAcquire",
  WALLET_ACTIVATION = "walletActivation",
  SUBSCRIPTION = "subscription",
}
