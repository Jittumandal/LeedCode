import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import useProblemStore from "../store/useProblemStore.js";
import useSubmissionStore from "../store/useSubmissionStore.js";
import useExecutionStore from "../store/useExecutionStore.js";
import getLanguageId from "../lib/lang.js";
import SubmissionsList from "../components/SubmissionList";
import SubmissionResults from "../components/Submission";

import {
  Container,
  Group,
  Card,
  Tabs,
  Button,
  Text,
  Table,
  ScrollArea,
  Select,
  Paper,
  Code,
} from "@mantine/core";
import {
  IconClock,
  IconUser,
  IconThumbUp,
  IconBookmarks,
  IconShare,
  IconHome,
  IconFileDescription,
  IconCode,
  IconMessageDots,
  IconPlayerPlay,
  IconBulb,
} from "@tabler/icons-react";
import { Loader } from "@mantine/core";
import classes from "../components/HeaderTabs.module.css";
const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  console.log("submission form first load submissions page", submissions);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <>
        <Loader color="blue" /> problem...
      </>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <Paper
            className={classes.problesdescription}
            shadow="md"
            p="lg"
            radius="md"
          >
            <Text size="lg" mb="md">
              {problem.description}
            </Text>

            {problem.examples && (
              <>
                <Text size="xl" weight={700} mb="md">
                  Examples:
                </Text>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <Paper
                    className={classes.innerbox}
                    key={lang}
                    shadow="sm"
                    p="md"
                    radius="md"
                    mb="md"
                  >
                    <Group mb="xs">
                      <Text weight={600} color="indigo">
                        Input:
                      </Text>
                      <Code style={{ backgroundColor: "#141427" }}>
                        {example.input}
                      </Code>
                    </Group>
                    <Group mb="xs">
                      <Text weight={600} color="indigo">
                        Output:
                      </Text>
                      <Code style={{ backgroundColor: "#141427" }}>
                        {example.output}
                      </Code>
                    </Group>
                    {example.explanation && (
                      <>
                        <Text weight={600} color="teal">
                          Explanation:
                        </Text>
                        <Text size="md">{example.explanation}</Text>
                      </>
                    )}
                  </Paper>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <Text size="xl" weight={700} mb="md">
                  Constraints:
                </Text>
                <Paper
                  className={classes.innerbox}
                  shadow="sm"
                  p="md"
                  radius="md"
                >
                  <Code style={{ backgroundColor: "#141427" }}>
                    {problem.constraints}
                  </Code>
                </Paper>
              </>
            )}
          </Paper>
        );

      case "submissions":
        return (
          <Paper
            className={classes.problesdescription}
            shadow="sm"
            p="md"
            radius="md"
            align="center"
          >
            <Text color="gray">
              <SubmissionsList
                submissions={submissions}
                isLoading={isSubmissionsLoading}
              />
            </Text>
          </Paper>
        );

      case "discussion":
        return (
          <Paper
            className={classes.problesdescription}
            shadow="sm"
            p="md"
            radius="md"
            align="center"
          >
            <Text color="gray">No discussions yet</Text>
          </Paper>
        );

      case "hints":
        return (
          <Paper
            className={classes.problesdescription}
            shadow="sm"
            p="md"
            radius="md"
          >
            {problem?.hints ? (
              <Paper shadow="xs" p="md" radius="md">
                <Code>{problem.hints}</Code>
              </Paper>
            ) : (
              <Text color="gray" align="center">
                No hints available
              </Text>
            )}
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Container size={"lg"} mt="xl">
      <Group justify="space-between">
        <Group gap="md">
          <Link to="/">
            <Text size="xl" color="blue" fw={700}>
              <IconHome stroke={2} />
            </Text>
          </Link>
          <Text size="xl" fw={700}>
            {problem?.title}
          </Text>
        </Group>

        <Group gap="sm" w={"25%"}>
          <Button
            variant="subtle"
            color={isBookmarked ? "blue" : "gray"}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <IconBookmarks stroke={2} />
          </Button>
          <Button variant="subtle">
            <IconShare stroke={2} />
          </Button>

          <select
            className={classes.select}
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </Group>
      </Group>

      <Group justify="space-between" mb={10} mt={10}>
        <Group gap="md" mt="xs">
          <Group align="center" gap="xs">
            <IconClock className={classes.seticon} stroke={2} />
            <Text size="sm">
              Updated{" "}
              {new Date(problem?.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Group>

          <Group align="center" gap="xs">
            <IconUser className={classes.seticon} stroke={2} />
            <Text size="sm">{submissionCount} Submissions</Text>
          </Group>

          <Group align="center" gap="xs">
            <IconThumbUp className={classes.seticon} stroke={2} />
            <Text size="sm">95% Success Rate</Text>
          </Group>
        </Group>
      </Group>

      {/* Grid Layout */}
      <Group grow align="start">
        {/* Tabs Section */}
        <Card className={classes.cardwrapper} shadow="md" p="lg" radius="md">
          <Tabs defaultValue="description">
            <Tabs.List>
              <Tabs.Tab
                className={classes.tabshover}
                value="description"
                icon={<IconFileDescription stroke={2} />}
                onClick={() => setActiveTab("description")}
              >
                <IconFileDescription stroke={2} /> Description
              </Tabs.Tab>
              <Tabs.Tab
                className={classes.tabshover}
                value="submissions"
                icon={<IconCode stroke={2} />}
                onClick={() => setActiveTab("submissions")}
              >
                <IconCode stroke={2} /> Submissions
              </Tabs.Tab>
              <Tabs.Tab
                className={classes.tabshover}
                value="discussion"
                icon={<IconMessageDots stroke={2} />}
                onClick={() => setActiveTab("discussion")}
              >
                <IconMessageDots stroke={2} />
                Discussion
              </Tabs.Tab>
              <Tabs.Tab
                className={classes.tabshover}
                value="hints"
                icon={<IconBulb stroke={2} />}
                onClick={() => setActiveTab("hints")}
              >
                <IconBulb stroke={2} />
                Hints
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel style={{ color: "#000" }} value={activeTab} pt="md">
              {renderTabContent()}
            </Tabs.Panel>
          </Tabs>
        </Card>

        {/* Code Editor Section */}
        <Card className={classes.cardwrapper} shadow="md" p="lg" radius="md">
          <Text mb={"md"} fw={700}>
            Code Editor
          </Text>
          <ScrollArea h={580}>
            <Editor
              height="600px"
              language={selectedLanguage.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 20,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </ScrollArea>
          <Group mt="md" justify="space-between">
            <Button
              className={`gap-2 ${isExecuting ? "loading..." : ""}`}
              onClick={handleRunCode}
              disabled={isExecuting}
            >
              {!isExecuting && <IconPlayerPlay stroke={2} />}
              Run Code
            </Button>
            <Button style={{ backgroundColor: "#fba309" }}>
              Submit Solution
            </Button>
          </Group>
        </Card>
      </Group>

      {/* Test Cases Section */}
      <Card
        className={classes.cardwrapper}
        shadow="md"
        p="lg"
        mt="md"
        mb={"xl"}
        radius="md"
      >
        {submission ? (
          <SubmissionResults submission={submission} />
        ) : (
          <>
            <Text size="xl" fw={700} mb="md">
              Test Cases
            </Text>
            <ScrollArea>
              <Table className={classes.resultable} striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Input</th>
                    <th>Expected Output</th>
                  </tr>
                </thead>
                <tbody>
                  {testcases.map((testCase, index) => (
                    <tr key={index}>
                      <td className="font-mono">{testCase.input}</td>
                      <td className="font-mono">{testCase.output}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </>
        )}
      </Card>
    </Container>
  );
};

export default ProblemPage;
