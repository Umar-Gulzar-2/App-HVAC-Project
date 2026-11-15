/**
 * Demo session (preview only).
 *
 * Chunk 1 shows role-based navigation layouts BEFORE Firebase exists.
 * This context switches between the administrator and technician views so
 * both role experiences can be previewed. It is clearly labelled as a demo
 * inside the login screen.
 *
 * In Chunk 2 this is replaced by a real Firebase Authentication context.
 * The reducer pattern matches the course outline (Context API + useReducer).
 *
 * Note: the action functions are wrapped in useCallback so their identity
 * stays stable across renders. Without this, a component using them inside
 * useEffect would re-run the effect on every state change (infinite loop).
 */
import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

const initialState = {
  role: null, // null | 'admin' | 'technician'
  userName: null,
  companyName: null,
  isDemo: true,
};

function sessionReducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN_ADMIN':
      return {
        ...state,
        role: 'admin',
        userName: action.userName ?? 'Company Owner',
        companyName: action.companyName ?? 'Premier Commercial HVAC',
      };
    case 'SIGN_IN_TECHNICIAN':
      return {
        ...state,
        role: 'technician',
        userName: action.userName ?? 'Alex Rivera',
        companyName: 'Premier Commercial HVAC',
      };
    case 'SIGN_OUT':
      return { ...initialState, isDemo: state.isDemo };
    default:
      return state;
  }
}

const DemoSessionContext = createContext(null);

export function DemoSessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const signInAsAdmin = useCallback((options) => dispatch({ type: 'SIGN_IN_ADMIN', ...options }), []);
  const signInAsTechnician = useCallback(() => dispatch({ type: 'SIGN_IN_TECHNICIAN' }), []);
  const signOut = useCallback(() => dispatch({ type: 'SIGN_OUT' }), []);

  const value = useMemo(
    () => ({ ...state, signInAsAdmin, signInAsTechnician, signOut }),
    [state, signInAsAdmin, signInAsTechnician, signOut]
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) {
    throw new Error('useDemoSession must be used inside a DemoSessionProvider');
  }
  return context;
}
