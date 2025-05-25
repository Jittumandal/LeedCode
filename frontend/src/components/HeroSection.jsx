import { Button, Container, Group, Text, Title } from "@mantine/core";
import classes from "./HeaderTabs.module.css";

export default function HeroSection() {
  return (
    <Container className={classes.wrapper} size="lg">
      <Group justify="center" className={classes.inner}>
        <Title className={classes.title}>
          Welcome to
          <Text component="span" className={classes.highlight} inherit>
            Adjustcode Lab
          </Text>
        </Title>

        <Container p={0} size="md">
          <Text size="lg" c="dimmed" className={classes.description}>
            A platform inspired by Leetcode, designed to help you excel in
            coding interviews and enhance your programming skills. Through a
            diverse collection of coding challenges, you can sharpen your
            problem-solving abilities and gain confidence in technical
            assessments.
          </Text>
        </Container>

        {/* <div className={classes.controls}>
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
        </div> */}
      </Group>
    </Container>
  );
}
