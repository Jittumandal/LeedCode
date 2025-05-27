import React from "react";
import { useForm } from "@mantine/form";
import { Modal, TextInput, Textarea, Button, Group } from "@mantine/core";

const CreatePlaylistModal = ({ isOpen, onClose = () => {}, onSubmit }) => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Playlist name is required",
    },
  });

  const handleFormSubmit = async (values) => {
    await onSubmit(values);
    form.reset();
    onClose(); // Ensure `onClose` is a valid function
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Create New Playlist"
      centered
    >
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <TextInput
          label="Playlist Name"
          placeholder="Enter playlist name"
          {...form.getInputProps("name")}
        />

        <Textarea
          label="Description"
          placeholder="Enter playlist description"
          {...form.getInputProps("description")}
          mt="md"
        />

        <Group position="right" mt="lg">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Playlist</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreatePlaylistModal;
