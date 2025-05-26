import React from "react";
import { Card, Badge, Group, Text } from "@mantine/core";
import {
  IconCircleCheck,
  IconXboxX,
  IconAlarm,
  IconDeviceSdCard,
  IconCalendarWeek,
} from "@tabler/icons-react";

const SubmissionsList = ({ submissions, isLoading }) => {
  // Helper function to safely parse JSON strings
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  // Helper function to calculate average memory usage
  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {submissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <Card key={submission.id} shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart">
              {/* Left Section: Status and Language */}
              <Group>
                {submission.status === "Accepted" ? (
                  <Group spacing="xs" style={{ color: "green" }}>
                    <IconCircleCheck stroke={2} />
                    <Text weight={500}>Accepted</Text>
                  </Group>
                ) : (
                  <Group spacing="xs" style={{ color: "red" }}>
                    <IconXboxX stroke={2} />
                    <Text weight={500}>{submission.status}</Text>
                  </Group>
                )}
                <Badge color="gray">{submission.language}</Badge>
              </Group>

              {/* Right Section: Runtime, Memory, and Date */}
              <Group spacing="md" style={{ color: "#6B7280" }}>
                <Group spacing="xs">
                  <IconAlarm stroke={2} />
                  <Text>{avgTime.toFixed(3)} s</Text>
                </Group>
                <Group spacing="xs">
                  <IconDeviceSdCard stroke={2} />
                  <Text>{avgMemory.toFixed(0)} KB</Text>
                </Group>
                <Group spacing="xs">
                  <IconCalendarWeek stroke={2} />
                  <Text>
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </Text>
                </Group>
              </Group>
            </Group>
          </Card>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
