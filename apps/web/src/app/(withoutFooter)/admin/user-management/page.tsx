'use client';
import { useState, useEffect } from 'react';
import { IUserState } from '@/type/user';
import { getAllUsers } from '@/lib/user.handler';
import { NextPage } from 'next';
import { getToken } from '@/lib/server';
import {
  Table,
  Spinner,
  Avatar,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';

const UsersManagement: NextPage = () => {
  const [users, setUsers] = useState<IUserState[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken();
        const { result, ok } = await getAllUsers(token);
        if (ok) {
          setUsers(result.usersData);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('An error occurred while fetching the users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <main className="flex flex-col">
        <div className="bg-white p-8">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4">Users Management</h1>
          </header>

          {users && users.length > 0 ? (
            <Table aria-label="Users List">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Avatar</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Avatar src={user.avatarUrl} alt={user.name} size="lg" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UsersManagement;
