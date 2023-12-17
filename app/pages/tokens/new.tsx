import FormikHelper from "@/components/helper/FormikHelper";
import Layout from "@/components/layout";
import { LargeLoadingButton } from "@/components/styled";
import { erc20basicAbi } from "@/contracts/abi/erc20basic";
import { erc20basicBytecode } from "@/contracts/bytecode/erc20basic";
import useError from "@/hooks/useError";
import { NewTokenParams } from "@/types";
import { chainToSupportedChainConfig } from "@/utils/chains";
import { HelpOutlined } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import * as yup from "yup";

/**
 * Page to create a new token.
 */
export default function NewToken() {
  const [params, setParams] = useState<NewTokenParams>({});
  const [step, setStep] = useState<
    | "STEP_ONE"
    | "STEP_TWO"
    | "STEP_THREE"
    | "STEP_FOUR"
    | "STEP_FINAL"
    | "STEP_SUCCESS_MESSAGE"
  >("STEP_ONE");

  return (
    <Layout maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center">
        {step === "STEP_ONE" && (
          <StepOne
            params={params}
            onCompleted={(updatedParams) => {
              setStep("STEP_TWO"), setParams(updatedParams);
            }}
          />
        )}
        {step === "STEP_TWO" && (
          <StepTwo
            params={params}
            onCompleted={(updatedParams) => {
              setStep("STEP_THREE"), setParams(updatedParams);
            }}
          />
        )}
        {step === "STEP_THREE" && (
          <StepThree
            params={params}
            onCompleted={(updatedParams) => {
              setStep("STEP_FOUR"), setParams(updatedParams);
            }}
          />
        )}
        {step === "STEP_FOUR" && (
          <StepFour
            params={params}
            onCompleted={(updatedParams) => {
              setStep("STEP_FINAL"), setParams(updatedParams);
            }}
          />
        )}
        {step === "STEP_FINAL" && (
          <StepFinal
            params={params}
            onCompleted={() => setStep("STEP_SUCCESS_MESSAGE")}
          />
        )}
        {step === "STEP_SUCCESS_MESSAGE" && <StepSuccessMessage />}
      </Box>
    </Layout>
  );
}

function StepOne(props: {
  params: NewTokenParams;
  onCompleted: (updatedParams: NewTokenParams) => void;
}) {
  return (
    <>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🥣 Cooking - Step 1
      </Typography>
      <Typography textAlign="center" mt={1}>
        What type of token do you want to launch?
      </Typography>
      <Stack direction="column" spacing={1} mt={2}>
        <LargeLoadingButton
          variant="outlined"
          onClick={() => props.onCompleted({ ...props.params, type: "ERC20" })}
        >
          🪙 ERC20
        </LargeLoadingButton>
        <LargeLoadingButton
          variant="outlined"
          onClick={() => props.onCompleted({ ...props.params, type: "ERC721" })}
        >
          🖼️ ERC721
        </LargeLoadingButton>
      </Stack>
    </>
  );
}

function StepTwo(props: {
  params: NewTokenParams;
  onCompleted: (updatedParams: NewTokenParams) => void;
}) {
  const { handleError } = useError();

  const [formValues, setFormValues] = useState({
    name: "",
    symbol: "",
  });
  const formValidationSchema = yup.object({
    name: yup.string().required(),
    symbol: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      props.onCompleted({
        ...props.params,
        name: values.name,
        symbol: values.symbol,
      });
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🥣 Cooking - Step 2
      </Typography>
      <Typography textAlign="center" mt={1}>
        What name and symbol do you want to use?
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submit}
      >
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            <TextField
              fullWidth
              id="name"
              name="name"
              placeholder="SuperDuperToken"
              label="Name"
              value={values.name}
              onChange={handleChange}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              id="symbol"
              name="symbol"
              placeholder="SDT"
              label="Symbol"
              value={values.symbol}
              onChange={handleChange}
              error={touched.symbol && Boolean(errors.symbol)}
              helperText={touched.symbol && errors.symbol}
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            />
            <LargeLoadingButton
              type="submit"
              variant="outlined"
              loading={isFormSubmitting}
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            >
              Next
            </LargeLoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}

function StepThree(props: {
  params: NewTokenParams;
  onCompleted: (updatedParams: NewTokenParams) => void;
}) {
  const { handleError } = useError();

  const [formValues, setFormValues] = useState({
    initialSupply: 0,
  });
  const formValidationSchema = yup.object({
    initialSupply: yup.number().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      props.onCompleted({
        ...props.params,
        initialSupply: values.initialSupply,
      });
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🥣 Cooking - Step 3
      </Typography>
      <Typography textAlign="center" mt={1}>
        How many tokens do you want to premint?
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submit}
      >
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            <TextField
              fullWidth
              id="initialSupply"
              name="initialSupply"
              placeholder="4200"
              label="Number of tokens"
              type="number"
              value={values.initialSupply}
              onChange={handleChange}
              error={touched.initialSupply && Boolean(errors.initialSupply)}
              helperText={touched.initialSupply && errors.initialSupply}
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            />
            <LargeLoadingButton
              type="submit"
              variant="outlined"
              loading={isFormSubmitting}
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            >
              Next
            </LargeLoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}

function StepFour(props: {
  params: NewTokenParams;
  onCompleted: (updatedParams: NewTokenParams) => void;
}) {
  const { handleError } = useError();

  const [formValues, setFormValues] = useState({
    mintable: false,
    burnable: false,
    pausable: false,
  });
  const formValidationSchema = yup.object({
    mintable: yup.boolean().required(),
    burnable: yup.boolean().required(),
    pausable: yup.boolean().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function submit(values: any) {
    try {
      props.onCompleted({
        ...props.params,
        mintable: values.mintable,
        burnable: values.burnable,
        pausable: values.pausable,
      });
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🥣 Cooking - Step 4
      </Typography>
      <Typography textAlign="center" mt={1}>
        What features do you want to add to your token?
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submit}
      >
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            <FormGroup sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControlLabel
                  id="mintable"
                  name="mintable"
                  label="Mintable"
                  value={values.mintable}
                  onChange={handleChange}
                  control={<Checkbox />}
                />
                <Tooltip title="Contract owner will be able to create more tokens">
                  <HelpOutlined
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                </Tooltip>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControlLabel
                  id="burnable"
                  name="burnable"
                  label="Burnable"
                  value={values.burnable}
                  onChange={handleChange}
                  control={<Checkbox />}
                />
                <Tooltip title="Token holders will be able to destroy their tokens">
                  <HelpOutlined
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                </Tooltip>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControlLabel
                  id="pausable"
                  name="pausable"
                  label="Pausable"
                  value={values.pausable}
                  onChange={handleChange}
                  control={<Checkbox />}
                />
                <Tooltip title="Contract owner will be able to pause the functionality">
                  <HelpOutlined
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                </Tooltip>
              </Stack>
            </FormGroup>
            <LargeLoadingButton
              type="submit"
              variant="outlined"
              loading={isFormSubmitting}
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            >
              Next
            </LargeLoadingButton>
          </Form>
        )}
      </Formik>
    </>
  );
}

function StepFinal(props: { params: NewTokenParams; onCompleted: () => void }) {
  const { handleError } = useError();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { chain } = useNetwork();

  async function createToken() {
    try {
      setIsFormSubmitting(true);
      if (!walletClient || !address) {
        throw new Error("Wallet is not connected");
      }
      if (
        props.params.type === "ERC20" &&
        !props.params.mintable &&
        !props.params.burnable &&
        !props.params.pausable
      ) {
        const transactionHash = await walletClient?.deployContract({
          abi: erc20basicAbi,
          account: address,
          args: [
            props.params.name as string,
            props.params.symbol as string,
            parseEther(String(props.params.initialSupply)),
            chainToSupportedChainConfig(chain).contracts.registry,
            chainToSupportedChainConfig(chain).contracts.sfs,
          ],
          bytecode: erc20basicBytecode,
        });
        await publicClient.waitForTransactionReceipt({ hash: transactionHash });
        props.onCompleted();
      } else {
        // TODO: Implement this case
        throw new Error(
          "Some of the selected parameters are not yet supported"
        );
      }
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        👀 Check ingredients
      </Typography>
      <Stack direction="row" spacing={1} mt={2}>
        <Typography color="text.secondary">Type -</Typography>
        <Typography fontWeight={700}>{props.params.type}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} mt={1}>
        <Typography color="text.secondary">Name -</Typography>
        <Typography fontWeight={700}>{props.params.name}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} mt={1}>
        <Typography color="text.secondary">Symbol -</Typography>
        <Typography fontWeight={700}>{props.params.symbol}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} mt={1}>
        <Typography color="text.secondary">Number of tokens -</Typography>
        <Typography fontWeight={700}>{props.params.initialSupply}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} mt={1}>
        <Typography color="text.secondary">Mintable -</Typography>
        <Typography fontWeight={700}>
          {props.params.mintable ? "✅" : "❌"}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} mt={1}>
        <Typography color="text.secondary">Burnable -</Typography>
        <Typography fontWeight={700}>
          {props.params.burnable ? "✅" : "❌"}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} mt={1}>
        <Typography color="text.secondary">Pausable -</Typography>
        <Typography fontWeight={700}>
          {props.params.pausable ? "✅" : "❌"}
        </Typography>
      </Stack>
      <LargeLoadingButton
        type="submit"
        variant="contained"
        loading={isFormSubmitting}
        disabled={isFormSubmitting}
        onClick={() => createToken()}
        sx={{ mt: 2 }}
      >
        🥣 Cook a token
      </LargeLoadingButton>
    </>
  );
}

function StepSuccessMessage() {
  return (
    <>
      <Image
        src="/animations/congrats.webp"
        alt="Congrats"
        width="100"
        height="100"
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "16px",
        }}
      />
      <Typography variant="h4" fontWeight={700} textAlign="center" mt={4}>
        Congrats 🎉
      </Typography>
      <Typography textAlign="center" mt={1}>
        Your token is cooked!
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Link href="/tokens">
          <LargeLoadingButton variant="outlined">
            Go to my tokens
          </LargeLoadingButton>
        </Link>
      </Box>
    </>
  );
}
