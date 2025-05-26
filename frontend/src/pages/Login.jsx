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
import { useAuthStore } from "../store/useAuthStore.js";
import classes from "./AuthenticationImage.module.css";
import { Loader } from "@mantine/core";

// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: " please enter a Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  keepLoggedIn: z.boolean().refine((value) => value === true, {
    message: "Please select the checkbox",
  }),
});

export default function Login() {
  const { isLoggingIn, login } = useAuthStore();

  const form = useForm({
    //get values from the user ya cleint
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
    } catch (error) {
      console.error("Login error:", error);
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
            label="Email address"
            placeholder="Enter your Email "
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
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
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
          Don’t have an account?
          <Link className={classes.link} to="/signup">
            Sign in
          </Link>
        </Text>
      </Paper>
    </div>
  );
}
