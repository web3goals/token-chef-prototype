import Layout from "@/components/layout";
import { ExtraLargeLoadingButton } from "@/components/styled";
import { LINK_MODE_SFS } from "@/constants/links";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";

/**
 * Landing page.
 */
export default function Landing() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <Layout maxWidth="lg" hideToolbar sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 8,
        }}
      >
        {/* Left part */}
        <Box width={{ xs: "100%", md: "100%", lg: "100%" }}>
          <Image
            src="/images/chef.png"
            alt="Chef"
            width="100"
            height="100"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
        {/* Right part */}
        <Box sx={{ textAlign: { xs: "center", md: "start" }, ml: { md: 3 } }}>
          <Typography variant="h2" fontWeight={700}>
            Cook a token in a few clicks
          </Typography>
          <Typography variant="h5" mt={1}>
            And spice it up with an opportunity to get a share of transaction
            fees
          </Typography>
          <Typography color="text.secondary" mt={2}>
            Powered by{" "}
            <MuiLink href={LINK_MODE_SFS} target="_blank">
              Mode SFS
            </MuiLink>
          </Typography>
          {address ? (
            <Link href="/tokens/new">
              <ExtraLargeLoadingButton variant="contained" sx={{ mt: 4 }}>
                🥣 Let’s go!
              </ExtraLargeLoadingButton>
            </Link>
          ) : (
            <ExtraLargeLoadingButton
              variant="contained"
              sx={{ mt: 4 }}
              onClick={() => openConnectModal?.()}
            >
              Let’s go!
            </ExtraLargeLoadingButton>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
