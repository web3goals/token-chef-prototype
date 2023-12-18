import WithdrawEarningsDialog from "@/components/dialog/WithdrawEarningsDialog";
import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import {
  CardBox,
  FullWidthSkeleton,
  LargeLoadingButton,
  MediumLoadingButton,
} from "@/components/styled";
import { DialogContext } from "@/context/dialog";
import { erc20basicAbi } from "@/contracts/abi/erc20basic";
import { registryAbi } from "@/contracts/abi/registry";
import { sfsAbi } from "@/contracts/abi/sfs";
import { tokenAbi } from "@/contracts/abi/token";
import useError from "@/hooks/useError";
import useToasts from "@/hooks/useToast";
import { theme } from "@/theme";
import { chainToSupportedChainConfig } from "@/utils/chains";
import { addressToShortAddress } from "@/utils/converters";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Link as MuiLink,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { formatEther, getContract, zeroAddress } from "viem";
import {
  useAccount,
  useContractRead,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";

/**
 * Page with tokens.
 */
export default function Tokens() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data: contracts } = useContractRead({
    address: chainToSupportedChainConfig(chain).contracts.registry,
    abi: registryAbi,
    functionName: "getTokens",
    args: [address || zeroAddress],
    enabled: Boolean(address),
  });

  return (
    <Layout maxWidth="sm">
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🍱️ My tokens
      </Typography>
      <Typography textAlign="center" mt={1}>
        Spiced with an opportunity to get a share of transaction fees
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Link href="/tokens/new">
          <LargeLoadingButton variant="contained">
            🥣 Cook a token
          </LargeLoadingButton>
        </Link>
      </Box>
      <EntityList
        entities={contracts as any[]}
        renderEntityCard={(contract, index) => (
          <TokenCard key={index} contract={contract} />
        )}
        noEntitiesText="😐 no tokens"
        sx={{ mt: 2 }}
      />
    </Layout>
  );
}

function TokenCard(props: { contract: `0x${string}` }) {
  const { chain } = useNetwork();
  const publicClient = usePublicClient();
  const { handleError } = useError();
  const [tokenParams, setTokenParams] = useState<
    | {
        type: string;
        name: string;
        symbol: string;
        totalSupply: bigint | undefined;
        sfsTokenId: bigint;
        sfsBalance: bigint;
      }
    | undefined
  >();
  const contractLink = `${
    chainToSupportedChainConfig(chain).chain.blockExplorers?.default.url
  }/address/${props.contract}`;

  async function loadData() {
    try {
      setTokenParams(undefined);
      // Define token type
      const tokenType = await publicClient.readContract({
        address: chainToSupportedChainConfig(chain).contracts.registry,
        abi: registryAbi,
        functionName: "getTokenType",
        args: [props.contract],
      });
      // Define data using token contract
      const tokenContract = getContract({
        address: props.contract,
        abi: tokenAbi,
        publicClient: publicClient,
      });
      const tokenName = await tokenContract.read.name();
      const tokenSymbol = await tokenContract.read.symbol();
      const tokenTotalSupply = tokenType.includes("ERC20")
        ? await publicClient.readContract({
            address: props.contract,
            abi: erc20basicAbi,
            functionName: "totalSupply",
          })
        : undefined;
      // Define data using sfs contract
      const sfsContract = getContract({
        address: chainToSupportedChainConfig(chain).contracts.sfs,
        abi: sfsAbi,
        publicClient: publicClient,
      });
      const tokenSfsTokenId = await sfsContract.read.getTokenId([
        props.contract,
      ]);
      const tokenSfsBalance = await sfsContract.read.balances([
        tokenSfsTokenId,
      ]);
      // Save loaded data
      setTokenParams({
        type: tokenType,
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: tokenTotalSupply,
        sfsTokenId: tokenSfsTokenId,
        sfsBalance: tokenSfsBalance,
      });
    } catch (error) {
      handleError(error as Error, true);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contract]);

  return (
    <CardBox sx={{ display: "flex", flexDirection: "row" }}>
      {/* Left part */}
      <Box>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 64,
            height: 64,
            background: theme.palette.divider,
          }}
        >
          <Typography fontSize={36}>
            {tokenParams?.type.includes("ERC721") ? "🖼️" : "🪙"}
          </Typography>
        </Avatar>
      </Box>
      {/* Right part */}
      <Box
        width={1}
        ml={3}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        {/* Name */}
        {tokenParams ? (
          <Typography variant="h6" fontWeight={700}>
            {tokenParams.name} ({tokenParams.symbol})
          </Typography>
        ) : (
          <Skeleton height={32} width={120} />
        )}
        {/* Link */}
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Typography color="text.secondary">Contract</Typography>
          <Typography color="text.secondary">-</Typography>
          <MuiLink href={contractLink} target="_blank" fontWeight={700}>
            🔗 {addressToShortAddress(props.contract)}
          </MuiLink>
        </Stack>
        {/* Supply */}
        {tokenParams?.totalSupply ? (
          <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
            <Typography color="text.secondary">Total Supply</Typography>
            <Typography color="text.secondary">-</Typography>
            <Typography fontWeight={700}>
              {formatEther(tokenParams.totalSupply)} tokens
            </Typography>
          </Stack>
        ) : (
          <></>
        )}
        {/* Earning */}
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Typography color="text.secondary">Earnings</Typography>
          <Typography color="text.secondary">-</Typography>
          {tokenParams ? (
            <Typography fontWeight={700}>
              {formatEther(tokenParams.sfsBalance)}{" "}
              {chainToSupportedChainConfig(chain).chain.nativeCurrency.symbol}
            </Typography>
          ) : (
            <Skeleton height={28} width={60} />
          )}
        </Stack>
        {/* Actions */}
        {tokenParams ? (
          <Stack direction="column" spacing={1} alignItems="flex-start" mt={1}>
            <TokenCardFunctionsButton contract={props.contract} />
            <TokenCardMetamaskButton
              contract={props.contract}
              symbol={tokenParams.symbol}
            />
            <TokenCardAddEarningsButton
              contract={props.contract}
              sfsTokenId={tokenParams.sfsTokenId}
              sfsBalance={tokenParams.sfsBalance}
            />
          </Stack>
        ) : (
          <FullWidthSkeleton />
        )}
      </Box>
    </CardBox>
  );
}

function TokenCardFunctionsButton(props: { contract: `0x${string}` }) {
  const { showToastWarning } = useToasts();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClickMenuItem() {
    setAnchorEl(null);
    showToastWarning("This feature is not yet supported");
  }

  return (
    <>
      <MediumLoadingButton
        aria-controls={open ? "functions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
      >
        ➡️ Execute contract function
      </MediumLoadingButton>
      <Menu
        id="functions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClickMenuItem}>💸 Transfer</MenuItem>
        <MenuItem onClick={handleClickMenuItem}>🆕 Mint</MenuItem>
        <MenuItem onClick={handleClickMenuItem}>🔥 Burn</MenuItem>
        <MenuItem onClick={handleClickMenuItem}>⏸️ Pause</MenuItem>
      </Menu>
    </>
  );
}

function TokenCardMetamaskButton(props: {
  contract: `0x${string}`;
  symbol: string;
}) {
  const { data: walletClient } = useWalletClient();
  const { handleError } = useError();

  async function addToMetamask() {
    try {
      if (!walletClient) {
        throw new Error("Wallet is not connected");
      }
      const success = await walletClient.watchAsset({
        type: "ERC20",
        options: {
          address: props.contract,
          decimals: 18,
          symbol: props.symbol,
        },
      });
    } catch (error) {
      handleError(error as Error, true);
    }
  }

  return (
    <MediumLoadingButton variant="outlined" onClick={() => addToMetamask()}>
      🦊 Add to MetaMask
    </MediumLoadingButton>
  );
}

function TokenCardAddEarningsButton(props: {
  contract: `0x${string}`;
  sfsTokenId: bigint;
  sfsBalance: bigint;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <MediumLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(
          <WithdrawEarningsDialog
            sfsTokenId={props.sfsTokenId}
            sfsBalance={props.sfsBalance}
            onClose={closeDialog}
          />
        )
      }
    >
      💰 Withdraw earnings
    </MediumLoadingButton>
  );
}
