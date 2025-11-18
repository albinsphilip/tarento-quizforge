export default {
  title: 'Welcome',
  parameters: {
    options: {
      showPanel: false,
    },
  },
};

export const Introduction = () => (
  <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 'bold', background: 'linear-gradient(to right, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
      Welcome to QuizForge Storybook 🎯
    </h1>
    
    <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>
      This is the component library for QuizForge - an online assessment platform built with React and TailwindCSS.
    </p>

    <div style={{ backgroundColor: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>
        📚 What is Storybook?
      </h3>
      <p style={{ color: '#1e3a8a', lineHeight: '1.6' }}>
        Storybook is a tool for developing UI components in isolation. Browse components in the sidebar, interact with their props, and see how they look in different states.
      </p>
    </div>

    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
      Available Components
    </h2>

    <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>🔄 LoadingSpinner</h4>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Loading indicator with customizable message and size</p>
      </div>

      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>❌ ErrorMessage</h4>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Error display component with retry functionality</p>
      </div>

      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>📋 Sidebar</h4>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Navigation sidebar with Admin and Candidate variants</p>
      </div>
    </div>

    <div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '12px', padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#92400e', marginBottom: '12px' }}>
        💡 Getting Started
      </h3>
      <ol style={{ color: '#78350f', lineHeight: '1.8', paddingLeft: '20px' }}>
        <li>Select a component from the sidebar on the left</li>
        <li>Use the <strong>Canvas</strong> tab to view the component</li>
        <li>Use the <strong>Controls</strong> panel to change props interactively</li>
        <li>Check the <strong>Docs</strong> tab for component documentation</li>
      </ol>
    </div>
  </div>
);

Introduction.parameters = {
  layout: 'fullscreen',
};
