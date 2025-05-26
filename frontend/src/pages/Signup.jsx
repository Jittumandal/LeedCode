import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useForm } from "@mantine/form";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";

import classes from "./AuthenticationImage.module.css";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "@mantine/core";

// Validation schema
const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name should have at least 5 letters" }),
  email: z.string().email({ message: " please enter a Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  keepLoggedIn: z.boolean().refine((value) => value === true, {
    message: "Please select the checkbox",
  }),
});

export default function Signup() {
  const form = useForm({
    //get values from the user ya cleint
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: zodResolver(SignupSchema),
  });

  // Get the signup function from the store
  const { signup, isSigninUp } = useAuthStore();
  const onSubmit = async (values) => {
    try {
      await signup(values);
      console.log("Signup successful", values);
    } catch (error) {
      console.error("Signup error", error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} shadow="md" padding="lg" withBorder>
        <Title className={classes.title}>
          Welcome to
          <Text component="span" className={classes.highlight} inherit>
            Adjustcode
          </Text>
        </Title>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            label="Name"
            placeholder="Enter your Name"
            size="md"
            radius="sm"
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email address"
            placeholder=" Enter your Email"
            mt="md"
            size="md"
            radius="sm"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter Your password"
            mt="md"
            size="md"
            radius="sm"
            {...form.getInputProps("password")}
          />
          <Checkbox
            label="Keep me logged in"
            mt="xl"
            {...form.getInputProps("keepLoggedIn", { type: "checkbox" })}
          />

          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            radius="sm"
            disabled={isSigninUp}
          >
            {isSigninUp ? (
              <>
                <Loader color="blue" />
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <Text ta="center" mt="md">
          I have allready an account?
          <Link className={classes.link} to="/login">
            Sign in
          </Link>
        </Text>
      </Paper>

      {/* Right Side - Image/Pattern */}
      {/* <AuthImagePattern
        className={classes.codeshow}
        title={"Welcome to our platform!"}
        subtitle={
          "Sign up to access our platform and start using our services."
        }
      /> */}
    </div>
  );
}
