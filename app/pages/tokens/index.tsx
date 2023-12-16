import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import {
  CardBox,
  LargeLoadingButton,
  MediumLoadingButton,
} from "@/components/styled";
import { registryAbi } from "@/contracts/abi/registry";
import { tokenAbi } from "@/contracts/abi/token";
import useError from "@/hooks/useError";
import { theme } from "@/theme";
import { chainToSupportedChainConfig } from "@/utils/chains";
import { addressToShortAddress } from "@/utils/converters";
import {
  Avatar,
  Box,
  Link as MuiLink,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getContract, zeroAddress } from "viem";
import {
  useAccount,
  useContractRead,
  useNetwork,
  usePublicClient,
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
    functionName: "getContracts",
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
  const [contractParams, setContractParams] = useState<
    { name: string; symbol: string; totalSupply: bigint } | undefined
  >();
  const contractLink = `${
    chainToSupportedChainConfig(chain).chain.blockExplorers?.default.url
  }/address/${props.contract}`;

  async function loadData() {
    try {
      setContractParams(undefined);
      const contract = getContract({
        address: props.contract,
        abi: tokenAbi,
        publicClient: publicClient,
      });
      const contractName = await contract.read.name();
      const contractSymbol = await contract.read.symbol();
      const contractTotalSuply = await contract.read.totalSupply();
      setContractParams({
        name: contractName,
        symbol: contractSymbol,
        totalSupply: contractTotalSuply,
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
          <Typography fontSize={36}>🍥</Typography>
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
        {contractParams ? (
          <Typography variant="h6" fontWeight={700}>
            {contractParams.name} ({contractParams.symbol})
          </Typography>
        ) : (
          <Skeleton height={32} width={120} />
        )}
        {/* Link */}
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Typography color="text.secondary">Contract</Typography>
          <Typography color="text.secondary">-</Typography>
          <MuiLink href={contractLink} target="_blank" fontWeight={700}>
            {addressToShortAddress(props.contract)}
          </MuiLink>
        </Stack>
        {/* Supply */}
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Typography color="text.secondary">Total Supply</Typography>
          <Typography color="text.secondary">-</Typography>
          {contractParams ? (
            <Typography fontWeight={700}>
              {String(contractParams.totalSupply)} tokens
            </Typography>
          ) : (
            <Skeleton height={24} width={60} />
          )}
        </Stack>
        {/* Earning */}
        {/* TODO: Define earnings */}
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Typography color="text.secondary">Earnings</Typography>
          <Typography color="text.secondary">-</Typography>
          <Skeleton height={28} width={60} />
        </Stack>
        {/* Actions */}
        {/* TODO: Implement actions */}
        <Stack direction="column" spacing={1} alignItems="flex-start" mt={1}>
          <MediumLoadingButton variant="contained" disabled>
            🎮 Manage
          </MediumLoadingButton>
          <MediumLoadingButton variant="outlined">
            🦊 Add to MetaMask
          </MediumLoadingButton>
          <MediumLoadingButton variant="outlined">
            💸 Withdraw earnings
          </MediumLoadingButton>
        </Stack>
      </Box>
    </CardBox>
  );
}
