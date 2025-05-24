import {
  Container,
  Group,
  Title,
  Button,
  TextInput,
  Select,
  Table,
} from "@mantine/core";
import React, { useState, useMemo } from "react";
import { IconHexagonPlus } from "@tabler/icons-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";

const ProblemsTables = ({ problems }) => {
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  return (
    <Container size="xl">
      <Group justify="space-between" position="apart" mb="md">
        <Title order={2}>Problems</Title>
        <Button leftIcon={<IconHexagonPlus size={18} />}>
          Create Playlist
        </Button>
      </Group>

      {/* Filters */}
      <Group grow mb="md">
        <TextInput
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          data={[
            { value: "ALL", label: "All Difficulties" },
            ...difficulties.map((diff) => ({ value: diff, label: diff })),
          ]}
          value={difficulty}
          onChange={setDifficulty}
        />
        <Select
          data={[
            { value: "ALL", label: "All Tags" },
            ...allTags.map((tag) => ({ value: tag, label: tag })),
          ]}
          value={selectedTag}
          onChange={setSelectedTag}
        />
      </Group>

      {/* Problems Table */}
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Solved</th>
            <th>Title</th>
            <th>Tags</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProblems.length > 0 ? (
            paginatedProblems.map((problem) => (
              <tr key={problem.id}>
                <td>
                  <input type="checkbox" readOnly />
                </td>
                <td>
                  <Link to={`/problem/${problem.id}`}>{problem.title}</Link>
                </td>
                <td>
                  {problem.tags?.map((tag, idx) => (
                    <span key={idx} style={{ marginRight: "5px" }}>
                      {tag}
                    </span>
                  ))}
                </td>
                <td>{problem.difficulty}</td>
                <td>
                  <Button variant="outline">Save to Playlist</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                No problems found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="flex justify-center mt-6 gap-2">
        <Button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>
        <Button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default ProblemsTables;
