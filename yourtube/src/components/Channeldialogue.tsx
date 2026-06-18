"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import axiosInstance from "@/lib/axiosinstance";
import { Useuser } from "@/lib/AuthContext";

interface ChannelDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
}

const Channeldialogue = ({
  isOpen,
  onClose,
  mode,
}: ChannelDialogueProps) => {
  const router = useRouter();

  const context: any = Useuser();

  if (!context) return null;

  const { user, login } = context;

  const [formData, setFormData] = useState({
    name: user?.channelname || "",
    description: user?.description || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert("Please sign in first");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        channelname: formData.name,
        description: formData.description,
      };

      const response = await axiosInstance.patch(
        `/user/update/${user._id}`,
        payload
      );

      console.log("Channel Updated:", response.data);

      if (login) {
        login(response.data);
      }

      alert(
        mode === "create"
          ? "Channel created successfully!"
          : "Channel updated successfully!"
      );

      setFormData({
        name: "",
        description: "",
      });

      onClose();

      router.push(`/channel/${user._id}`);
    } catch (error) {
      console.error("Channel Update Error:", error);
      alert("Failed to save channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Your Channel"
              : "Edit Your Channel"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create your channel."
              : "Update your channel details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Channel Name</Label>

            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter channel name"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">
              Channel Description
            </Label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell viewers about your channel..."
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Channel"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Channeldialogue;