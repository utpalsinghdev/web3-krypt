export const addressMaster = (address: string | undefined) => `${address?.slice(0, 5)}...${address?.slice(address?.length - 4)}`;