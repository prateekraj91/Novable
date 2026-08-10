'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold">
          ExpensePulse
        </Link>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden md:block">Welcome, {user?.email}</span>
              <button
                onClick={logout}
                className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium hover:bg-blue-800 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium hover:bg-blue-800 transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
