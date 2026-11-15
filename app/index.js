/**
 * Launch screen — sends the user to the right place for their session.
 * No session  -> /login
 * Administrator -> /admin  (Admin Dashboard)
 * Technician    -> /technician (Technician Dashboard)
 * Real authentication replaces this demo routing in Chunk 2.
 */
import { Redirect } from 'expo-router';
import React from 'react';
import { useDemoSession } from '../src/context/DemoSessionContext';

export default function Index() {
  const { role } = useDemoSession();

  if (role === 'admin') return <Redirect href="/admin" />;
  if (role === 'technician') return <Redirect href="/technician" />;
  return <Redirect href="/login" />;
}
