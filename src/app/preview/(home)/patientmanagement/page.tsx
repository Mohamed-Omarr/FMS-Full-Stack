"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/Context/UserInfo";
import { redirect } from "next/navigation";

/**
 * Represents a flattened patient for display in the UI.
 */
export type FlattenedPatient = {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  therapistName: string;
  lastAssessment: string | null;
  fmsScore: number | string;
  status: string;
};

/**
 * React component for managing patients.
 *
 * Displays a table of patients with filtering, searching, and adding new patients.
 *
 * @component
 *
 */

export const dynamic = "force-dynamic"; 

export default function PatientManagement() {

  const data = useUser();

  const [statusFilter, setStatusFilter] = useState("all");

  const [searchFilter, setSearchFilter] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    phone: "",
  });

  if (!data.user) return redirect("/preview/login");

  /**
   * Flattens the patient data from the backend for easier table display.
   */
  const allPatients: FlattenedPatient[] = (data.user.patient ?? []).map(
    (p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      email: p.contact?.[0]?.email ?? "",
      phone: p.contact?.[0]?.phone ?? "",
      therapistName: data.user?.name ?? "",
      lastAssessment: null,
      fmsScore: "-",
      status: p.status ?? "pending",
    })
  );

  /**
   * Filter patients by search text and status.
   */
  const filteredPatients = allPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      patient.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  /**
   * Handles submission of the "Add Patient" form.
   * Sends a POST request to the server to create a new patient.
   *
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("name", formData.fullName);
    form.append("age", formData.age);

    try {
      const res = await fetch("/api/therapist/features/patient", {
        method: "POST",
        body: form,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Process has failed");
        return;
      }

      alert(result.message || "Failed to add new patient");
      setIsDialogOpen(false);
      setFormData({ fullName: "", age: "", email: "", phone: "" });
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-full p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header + Dialog */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Patient Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Patient</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Patient
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search patients..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Patients Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Patient</th>
                  <th className="text-left p-4 font-medium">Age</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Therapist</th>
                  <th className="text-left p-4 font-medium">Last Assessment</th>
                  <th className="text-left p-4 font-medium">FMS Score</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="p-4 font-medium">{patient.name}</td>
                    <td className="p-4 text-muted-foreground">{patient.age}</td>
                    <td className="p-4 text-muted-foreground">
                      {patient.email} / {patient.phone}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {patient.therapistName}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {patient.lastAssessment
                        ? new Date(patient.lastAssessment).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4 font-medium">{patient.fmsScore}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
