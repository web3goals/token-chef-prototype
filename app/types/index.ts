export type NewTokenParams = {
  type?: "ERC20" | "ERC721";
  name?: string;
  symbol?: string;
  initialSupply?: number;
  mintable?: boolean;
  burnable?: boolean;
  pausable?: boolean;
};
