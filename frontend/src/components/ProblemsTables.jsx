import {
  Container,
  Group,
  Title,
  Button,
  TextInput,
  Select,
  Table,
  Pagination,
} from "@mantine/core";
import React, { useState, useMemo } from "react";
import { IconHexagonPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import classes from "./HeaderTabs.module.css"; // Assuming you have a CSS module for styles

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
    <Container className={classes.wrapperoftable} size="lg">
      <Group justify="space-between" position="apart" mb="md">
        <Title order={2}>Problems</Title>
        <Button>
          <IconHexagonPlus className={classes.Plusicon} stroke={2} /> Create
          Playlist
        </Button>
      </Group>

      {/* Filters */}
      <Group grow mb="md">
        <input
          type="text"
          placeholder="Search by title"
          className={classes.select}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={classes.select}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className={classes.select}
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </Group>

      {/* Problems Table */}
      <Table
        className={classes.tablewrapper}
        striped
        highlightOnHover
        withBorder
      >
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
                  <IconTrash className={classes.IconTrash} stroke={2} />{" "}
                  <IconEdit stroke={2} />
                </td>
                <td>
                  <Button radius="normal" variant="filled">
                    Save to Playlist
                  </Button>
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

      <Group justify="center" mt="lg">
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={setCurrentPage}
          color="blue"
          size="sm"
          position="center"
        />
      </Group>
    </Container>
  );
};

export default ProblemsTables;
