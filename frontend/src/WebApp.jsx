import React, { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import useProblemStore from "./store/useProblemStore.js";
import { Loader } from "@mantine/core";
import ProblemsTables from "./components/ProblemsTables.jsx";
import { Text } from "@mantine/core";

const WebApp = () => {
  // Get the problem store to fetch problems
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  // Fetch all problems when the component mounts

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  // check if problems are loading ya not
  if (isProblemsLoading) {
    return (
      <div>
        <Loader color="blue" />
      </div>
    );
  }

  console.log("get Problems:", problems);

  return (
    <div>
      <HeroSection />
      {problems.length > 0 ? (
        <ProblemsTables problems={problems} />
      ) : (
        <Text size="xs">No problems found</Text>
      )}
    </div>
  );
};

export default WebApp;
