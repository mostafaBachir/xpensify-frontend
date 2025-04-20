"use client";

// 📁 app/dashboard/users/page.jsx

import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import useServiceStore from "@/store/serviceStore";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function UsersPage() {
  const { users, fetchUsers, loading, error, updateUserPermissions } = useUserStore();
  const { services, fetchServices } = useServiceStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedPermissions, setEditedPermissions] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchServices();
  }, [fetchUsers, fetchServices]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedPermissions(user.permissions);
  };

  const handlePermissionChange = (index, field, value) => {
    const updated = [...editedPermissions];
    updated[index][field] = value;
    setEditedPermissions(updated);
  };

  const handleAddPermission = () => {
    setEditedPermissions([...editedPermissions, { service_id: services[0]?.id || "", action: "read" }]);
  };

  const handleRemovePermission = (index) => {
    const updated = [...editedPermissions];
    updated.splice(index, 1);
    setEditedPermissions(updated);
  };

  const handleSavePermissions = async () => {
    if (selectedUser) {
      await updateUserPermissions(selectedUser.id, editedPermissions);
      setSelectedUser(null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

      <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
        <Input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="superuser">Superuser</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <Card className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.permissions.map((perm, index) => (
                        <Badge key={index} variant="outline">
                          {perm.service} → {perm.permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => handleEdit(user)}>✏️</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Modifier les permissions de {user.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {editedPermissions.map((perm, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div>
                                <Label>Service</Label>
                                <select
                                  value={perm.service_id}
                                  onChange={(e) => handlePermissionChange(idx, "service_id", e.target.value)}
                                  className="border px-2 py-1 rounded"
                                >
                                  {services.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label>Action</Label>
                                <select
                                  value={perm.action}
                                  onChange={(e) => handlePermissionChange(idx, "action", e.target.value)}
                                  className="border px-2 py-1 rounded"
                                >
                                  <option value="read">read</option>
                                  <option value="write">write</option>
                                  <option value="manage">manage</option>
                                </select>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => handleRemovePermission(idx)}>🗑</Button>
                            </div>
                          ))}
                          <Button onClick={handleAddPermission}>➕ Ajouter une permission</Button>
                          <div className="flex justify-end">
                            <Button onClick={handleSavePermissions}>💾 Enregistrer</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
