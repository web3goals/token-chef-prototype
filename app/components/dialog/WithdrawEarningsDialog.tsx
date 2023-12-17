import { LINK_MODE_SFS } from "@/constants/links";
import { sfsAbi } from "@/contracts/abi/sfs";
import useError from "@/hooks/useError";
import useToasts from "@/hooks/useToast";
import { chainToSupportedChainConfig } from "@/utils/chains";
import { Dialog, Link as MuiLink, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import * as yup from "yup";
import FormikHelper from "../helper/FormikHelper";
import { DialogCenterContent, LargeLoadingButton } from "../styled";

export default function WithdrawEarningsDialog(props: {
  sfsTokenId: bigint;
  sfsBalance: bigint;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { handleError } = useError();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { showToastSuccess } = useToasts();

  /**
   * Dialog states
   */
  const [isOpen, setIsOpen] = useState(!props.isClose);

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    recepient: address || "",
    amount: props.sfsBalance ? formatEther(props.sfsBalance) : "0",
  });
  const formValidationSchema = yup.object({
    recepient: yup.string().required(),
    amount: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  /**
   * Function to close dialog
   */
  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Function to handle form submit
   */
  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      if (!walletClient) {
        throw new Error("Wallet is not connected");
      }
      const { request } = await publicClient.simulateContract({
        address: chainToSupportedChainConfig(chain).contracts.sfs,
        abi: sfsAbi,
        functionName: "withdraw",
        args: [props.sfsTokenId, values.recepient, parseEther(values.amount)],
        account: address,
      });
      await walletClient.writeContract(request);
      showToastSuccess(
        "Request to withdraw earnings was successfully submitted"
      );
      close();
    } catch (error) {
      handleError(error as Error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={!isFormSubmitting ? close : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogCenterContent>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          💰 Withdraw earnings
        </Typography>
        <Typography textAlign="center" mt={1}>
          Powered by <MuiLink href={LINK_MODE_SFS}>Mode SFS</MuiLink>
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
                id="recepient"
                name="recepient"
                placeholder="0xCaEd1B..."
                label="Recepient (Address)"
                value={values.recepient}
                onChange={handleChange}
                error={touched.recepient && Boolean(errors.recepient)}
                helperText={touched.recepient && errors.recepient}
                disabled={isFormSubmitting}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                id="amount"
                name="amount"
                placeholder="0.0042..."
                label="Amount (ETH)"
                value={values.amount}
                onChange={handleChange}
                error={touched.amount && Boolean(errors.amount)}
                helperText={touched.amount && errors.amount}
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
                Submit
              </LargeLoadingButton>
            </Form>
          )}
        </Formik>
      </DialogCenterContent>
    </Dialog>
  );
}
