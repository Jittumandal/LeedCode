import { Button, Container, Text, Title } from "@mantine/core";
import classes from "./HeaderTabs.module.css";

export default function HeroSection() {
  return (
    <Container className={classes.wrapper} size="lg">
      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome to
          <Text component="span" className={classes.highlight} inherit>
            Adjustcode Lab
          </Text>
        </Title>

        <Container p={0} size="md">
          <Text size="lg" c="dimmed" className={classes.description}>
            A Platform Inspired by Leetcode which helps you to prepare for
            coding interviews and helps you to improve your coding skills by
            solving coding problems
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
          >
            Book a demo
          </Button>
          <Button className={classes.control} size="lg">
            Purchase a license
          </Button>
        </div>
      </div>
    </Container>
  );
}
