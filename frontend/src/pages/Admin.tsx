import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Users, Trash2, Shield, Loader2, Database, Calendar } from 'lucide-react';

interface UserWithCount {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  _count: {
    datasets: number;
  };
}

const Admin = () => {
  const [users, setUsers] = useState<UserWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
    } catch (err: any) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(id);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await adminAPI.updateUserRole(id, newRole);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Manage users and their access levels
            </p>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {users.length}
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-sm">
              {users.length === 1 ? 'User' : 'Users'}
            </span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            {error}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>All Users</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">User</th>
                <th className="table-header-cell hidden md:table-cell">Email</th>
                <th className="table-header-cell">Role</th>
                <th className="table-header-cell hidden sm:table-cell">Datasets</th>
                <th className="table-header-cell hidden lg:table-cell">Joined</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {users.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate md:hidden">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <span className="text-slate-600 dark:text-slate-400">
                      {user.email}
                    </span>
                  </td>
                  <td className="table-cell">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="input py-1.5 text-sm w-full sm:w-auto min-w-[100px]"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    <div className="flex items-center space-x-1.5">
                      <Database className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        {user._count.datasets}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell hidden lg:table-cell">
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Delete user"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              No users found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              There are no users in the system yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;